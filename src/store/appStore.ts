import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role } from '@/types'
import { DEFAULT_THEME_ID } from '@/lib/themes'

interface AppState {
  nickname: string | null
  role: Role | null
  darkMode: boolean
  diceAnimations: boolean
  sidebarCollapsed: boolean
  themeId: string
  personalNotes: Record<string, string>
  setNickname: (n: string) => void
  setRole: (r: Role) => void
  setProfile: (nickname: string, role: Role) => void
  toggleDarkMode: () => void
  setDarkMode: (v: boolean) => void
  toggleDiceAnimations: () => void
  toggleSidebarCollapsed: () => void
  setSidebarCollapsed: (v: boolean) => void
  setTheme: (id: string) => void
  setPersonalNote: (campaignId: string, note: string) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      nickname: null,
      role: null,
      darkMode: false,
      diceAnimations: true,
      sidebarCollapsed: false,
      themeId: DEFAULT_THEME_ID,
      personalNotes: {},
      setNickname: (nickname) => set({ nickname }),
      setRole: (role) => set({ role }),
      setProfile: (nickname, role) => set({ nickname, role }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setDarkMode: (v) => set({ darkMode: v }),
      toggleDiceAnimations: () => set((s) => ({ diceAnimations: !s.diceAnimations })),
      toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      setTheme: (id) => set({ themeId: id }),
      setPersonalNote: (campaignId, note) =>
        set((s) => ({ personalNotes: { ...s.personalNotes, [campaignId]: note } })),
      reset: () => set({ nickname: null, role: null }),
    }),
    { name: 'dnd-app' }
  )
)
