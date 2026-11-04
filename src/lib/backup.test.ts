import { describe, expect, it } from 'vitest'
import { createBackup, parseBackup, restoreBackup } from '@/lib/backup'

const memory = (init: Record<string, string> = {}) => {
  const m = new Map(Object.entries(init))
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), m }
}

describe('backup', () => {
  it('round-trips persisted stores and ignores unrelated keys', () => {
    const src = memory({ 'dnd-characters': '{"state":{"characters":[1]}}', other: 'x' })
    const backup = parseBackup(JSON.parse(JSON.stringify(createBackup(src, new Date(0)))))
    expect(Object.keys(backup.data)).toEqual(['dnd-characters'])

    const dst = memory()
    expect(restoreBackup(dst, backup)).toBe(1)
    expect(dst.m.get('dnd-characters')).toBe('{"state":{"characters":[1]}}')
    expect(dst.m.has('other')).toBe(false)
  })

  it('rejects files that are not backups', () => {
    expect(() => parseBackup({ foo: 1 })).toThrow(/bukan backup/)
    expect(() => parseBackup(null)).toThrow()
  })
})
