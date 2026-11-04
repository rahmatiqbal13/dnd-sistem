/** Every persisted store key; a backup is these localStorage entries plus metadata. */
export const BACKUP_KEYS = ['dnd-app', 'dnd-characters', 'dnd-campaigns', 'dnd-dice-log', 'dnd-combat'] as const

export interface Backup {
  app: 'dnd-sistem'
  version: 1
  exportedAt: string
  data: Partial<Record<(typeof BACKUP_KEYS)[number], unknown>>
}

export function createBackup(storage: Pick<Storage, 'getItem'>, now = new Date()): Backup {
  const data: Backup['data'] = {}
  for (const key of BACKUP_KEYS) {
    const raw = storage.getItem(key)
    if (raw) data[key] = JSON.parse(raw)
  }
  return { app: 'dnd-sistem', version: 1, exportedAt: now.toISOString(), data }
}

/** Validate a parsed backup file; throws a readable (Indonesian) error if it isn't one. */
export function parseBackup(json: unknown): Backup {
  const b = json as Partial<Backup> | null
  if (!b || b.app !== 'dnd-sistem' || b.version !== 1 || typeof b.data !== 'object' || b.data === null) {
    throw new Error('File ini bukan backup D&D Sistem yang valid.')
  }
  return b as Backup
}

export function restoreBackup(storage: Pick<Storage, 'setItem'>, backup: Backup): number {
  let restored = 0
  for (const key of BACKUP_KEYS) {
    if (key in backup.data) {
      storage.setItem(key, JSON.stringify(backup.data[key]))
      restored++
    }
  }
  return restored
}
