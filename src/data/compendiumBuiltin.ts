import type { CompendiumEntry } from '@/types'

/**
 * Entri kompendium buatan (homebrew / override). Muncul di atas data hasil fetch API.
 * Kosongkan jika hanya memakai data dari `generated/compendium.json`.
 */
export const COMPENDIUM_BUILTIN: CompendiumEntry[] = []
