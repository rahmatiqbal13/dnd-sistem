// Runs the real migrations in PGlite (in-process Postgres) with a minimal stand-in
// for Supabase's auth schema and roles, then checks allow and deny paths per role.
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto'

const MIGRATIONS = path.join(__dirname, '..', 'migrations')

const SUPABASE_STUB = `
  create publication supabase_realtime;
  create role anon nologin;
  create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  grant usage on schema auth to anon, authenticated;
  grant execute on function auth.uid() to anon, authenticated;
`

// Supabase grants table privileges to anon/authenticated by default; RLS does the gating.
const SUPABASE_GRANTS = `
  grant usage on schema public to anon, authenticated;
  grant all on all tables in schema public to anon, authenticated;
`

const DM = '00000000-0000-0000-0000-00000000000d'
const PLAYER = '00000000-0000-0000-0000-00000000000a'
const STRANGER = '00000000-0000-0000-0000-00000000000e'

let db: PGlite
let campaignId: string

async function as<T>(user: string | null, fn: () => Promise<T>): Promise<T> {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${user ?? ''}', false);`)
  await db.exec(`set role ${user ? 'authenticated' : 'anon'}`)
  try {
    return await fn()
  } finally {
    await db.exec('reset role')
  }
}

const rows = async (sql: string, params: unknown[] = []) => (await db.query(sql, params)).rows

beforeAll(async () => {
  db = await PGlite.create({ extensions: { pgcrypto } })
  await db.exec(SUPABASE_STUB)
  const files = readdirSync(MIGRATIONS).filter((f) => f.endsWith('.sql')).sort()
  // Grants run between migrations so the secure migration's column-level revokes still apply.
  await db.exec(readFileSync(path.join(MIGRATIONS, files[0]), 'utf8'))
  await db.exec(SUPABASE_GRANTS)
  for (const f of files.slice(1)) await db.exec(readFileSync(path.join(MIGRATIONS, f), 'utf8'))
  // Run again: migrations must be safe to re-run after a partial run in the SQL Editor
  for (const f of files.slice(1)) await db.exec(readFileSync(path.join(MIGRATIONS, f), 'utf8'))
  await db.exec(`insert into auth.users (id) values ('${DM}'), ('${PLAYER}'), ('${STRANGER}')`)

  campaignId = await as(DM, async () => {
    const [row] = await rows(
      `insert into campaigns (name, dm_nickname, invite_code) values ('Strahd', 'Dee', 'ABC234') returning id`
    )
    return (row as { id: string }).id
  })
})

describe('anon role', () => {
  it('cannot read or write any table', async () => {
    await as(null, async () => {
      expect(await rows('select * from campaigns')).toHaveLength(0)
      expect(await rows('select * from campaign_members')).toHaveLength(0)
      await expect(
        db.query(`insert into campaigns (name, dm_nickname, invite_code) values ('x', 'x', 'ZZZZZZ')`)
      ).rejects.toThrow()
    })
  })

  it('cannot call join_campaign', async () => {
    await as(null, async () => {
      await expect(db.query(`select join_campaign('ABC234', 'x')`)).rejects.toThrow()
    })
  })
})

describe('campaign creation', () => {
  it('adds the DM as a member automatically', async () => {
    const members = await as(DM, () => rows('select user_id, role from campaign_members'))
    expect(members).toEqual([{ user_id: DM, role: 'dm' }])
  })

  it('refuses a campaign whose dm_id is someone else', async () => {
    await as(STRANGER, async () => {
      await expect(
        db.query(`insert into campaigns (name, dm_nickname, invite_code, dm_id) values ('x', 'x', 'QQQQQQ', '${DM}')`)
      ).rejects.toThrow()
    })
  })
})

describe('non-members', () => {
  it('cannot see the campaign, its invite code, members, NPCs or sessions', async () => {
    await as(DM, () => db.query(`insert into campaign_npcs (campaign_id, name) values ($1, 'Ireena')`, [campaignId]))
    await as(STRANGER, async () => {
      expect(await rows('select * from campaigns')).toHaveLength(0)
      expect(await rows('select * from campaign_members')).toHaveLength(0)
      expect(await rows('select * from campaign_npcs')).toHaveLength(0)
    })
  })

  it('cannot add themselves as a member directly', async () => {
    await as(STRANGER, async () => {
      await expect(
        db.query(`insert into campaign_members (campaign_id, nickname) values ($1, 'sneaky')`, [campaignId])
      ).rejects.toThrow()
    })
  })

  it('cannot update or delete the campaign', async () => {
    await as(STRANGER, async () => {
      await db.query(`update campaigns set name = 'pwned' where id = $1`, [campaignId])
      await db.query(`delete from campaigns where id = $1`, [campaignId])
    })
    const [c] = await rows('select name from campaigns where id = $1', [campaignId])
    expect(c).toEqual({ name: 'Strahd' })
  })
})

describe('join_campaign', () => {
  it('returns null for an unknown code', async () => {
    const [r] = await as(STRANGER, () => rows(`select join_campaign('NOPE00', 'x') as id`))
    expect(r).toEqual({ id: null })
  })

  it('joins as a player with a valid code (case-insensitive) and is idempotent', async () => {
    await as(PLAYER, async () => {
      const [a] = await rows(`select join_campaign(' abc234 ', 'Pip') as id`)
      const [b] = await rows(`select join_campaign('ABC234', 'Pip') as id`)
      expect(a).toEqual({ id: campaignId })
      expect(b).toEqual({ id: campaignId })
      expect(await rows('select * from campaigns')).toHaveLength(1)
      expect(await rows('select * from campaign_npcs')).toHaveLength(1)
    })
    const members = await as(DM, () => rows('select user_id, role from campaign_members order by role'))
    expect(members).toEqual([
      { user_id: DM, role: 'dm' },
      { user_id: PLAYER, role: 'player' },
    ])
  })

  it('locks a user out after 10 failed attempts', async () => {
    const BRUTE = '00000000-0000-0000-0000-0000000000bb'
    await db.exec(`insert into auth.users (id) values ('${BRUTE}')`)
    await as(BRUTE, async () => {
      for (let i = 0; i < 10; i++) await db.query(`select join_campaign('WRONG${i}', 'x')`)
      await expect(db.query(`select join_campaign('ABC234', 'x')`)).rejects.toThrow(/too many attempts/)
    })
  })
})

describe('members', () => {
  it('cannot promote themselves to DM or edit NPCs', async () => {
    await as(PLAYER, async () => {
      await expect(db.query(`update campaign_members set role = 'dm' where user_id = $1`, [PLAYER])).rejects.toThrow()
      await db.query(`update campaign_npcs set name = 'pwned'`)
      await expect(
        db.query(`insert into campaign_npcs (campaign_id, name) values ($1, 'x')`, [campaignId])
      ).rejects.toThrow()
    })
    const [npc] = await rows('select name from campaign_npcs')
    expect(npc).toEqual({ name: 'Ireena' })
  })

  it('cannot kick another member, but the DM can', async () => {
    await as(PLAYER, () => db.query(`delete from campaign_members where user_id = $1`, [DM]))
    expect(await rows('select * from campaign_members where user_id = $1', [DM])).toHaveLength(1)

    await as(DM, () => db.query(`delete from campaign_members where user_id = $1`, [PLAYER]))
    expect(await rows('select * from campaign_members where user_id = $1', [PLAYER])).toHaveLength(0)
  })
})

describe('character sync', () => {
  it('owner upserts the full character; campaign members read it, strangers cannot', async () => {
    // PLAYER was kicked above; rejoin, then link a character to the campaign
    await as(PLAYER, () => db.query(`select join_campaign('ABC234', 'Pip')`))
    const charId = '11111111-1111-1111-1111-111111111111'
    const upsert = (name: string) =>
      db.query(
        `insert into characters (id, name, class, race, campaign_id, data) values ($1, $2, 'Rogue', 'Halfling', $3, $4)
         on conflict (id) do update set name = excluded.name, data = excluded.data`,
        [charId, name, campaignId, JSON.stringify({ conditions: ['Prone'] })]
      )
    await as(PLAYER, async () => {
      await upsert('Pip')
      await upsert('Pip v2')
    })

    const dmView = await as(DM, () => rows('select name, data from characters where campaign_id = $1', [campaignId]))
    expect(dmView).toEqual([{ name: 'Pip v2', data: { conditions: ['Prone'] } }])
    expect(await as(STRANGER, () => rows('select * from characters where id = $1', [charId]))).toHaveLength(0)

    // The DM can read but not overwrite a player's sheet
    await as(DM, () => db.query(`update characters set name = 'pwned' where id = $1`, [charId]))
    const [c] = await rows('select name from characters where id = $1', [charId])
    expect(c).toEqual({ name: 'Pip v2' })
  })

  it('publishes campaign tables for realtime', async () => {
    const tables = (await rows(`select tablename from pg_publication_tables where pubname = 'supabase_realtime'`))
      .map((r) => (r as { tablename: string }).tablename)
      .sort()
    expect(tables).toEqual(['campaign_members', 'campaign_npcs', 'campaign_sessions', 'campaigns', 'characters'])
  })
})

describe('owner-only tables', () => {
  it("keeps characters, notes and dice rolls private to their owner", async () => {
    await as(PLAYER, async () => {
      await db.query(`insert into characters (name, class, race) values ('Pip', 'Rogue', 'Halfling')`)
      await db.query(`insert into dice_rolls (dice, total) values (20, 17)`)
    })
    await as(STRANGER, async () => {
      expect(await rows('select * from characters')).toHaveLength(0)
      expect(await rows('select * from dice_rolls')).toHaveLength(0)
      await db.query(`update characters set name = 'pwned'`)
    })
    const [c] = await rows(`select name, user_id from characters where name in ('Pip', 'pwned')`)
    expect(c).toEqual({ name: 'Pip', user_id: PLAYER })
  })

  it('profiles: a user can only create their own row', async () => {
    await as(PLAYER, async () => {
      await db.query(`insert into profiles (id, nickname) values ($1, 'Pip')`, [PLAYER])
      await expect(db.query(`insert into profiles (id, nickname) values ($1, 'Fake')`, [DM])).rejects.toThrow()
    })
  })
})
