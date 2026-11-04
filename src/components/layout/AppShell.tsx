import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { BottomTabBar } from './BottomTabBar'
import { Sidebar } from './Sidebar'
import { Toaster } from 'sonner'
import { useAppStore } from '@/store/appStore'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { applyTheme, getThemeById } from '@/lib/themes'
import { startCharacterSync } from '@/lib/sync'
import { useCampaignLive } from '@/lib/live'
import { startCombatBroadcast } from '@/lib/combatShare'
import { currentUserId, ensureSession, isSupabaseConfigured } from '@/lib/supabase'
import { useCombatStore } from '@/store/combatStore'
import { useCharacterStore } from '@/store/characterStore'
import { useCampaignStore } from '@/store/campaignStore'

export function AppShell() {
  const darkMode = useAppStore((s) => s.darkMode)
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed)
  const themeId = useAppStore((s) => s.themeId)
  const activeCampaignId = useCampaignStore((s) => s.activeCampaignId)

  useCampaignLive(activeCampaignId)
  useEffect(() => startCharacterSync(useCharacterStore), [])

  // Publish the DM's tracker to the active campaign so players can follow along
  useEffect(() => {
    if (!isSupabaseConfigured) return
    let uid: string | null = null
    let stop = () => {}
    let cancelled = false
    void ensureSession()
      .then(currentUserId)
      .then((id) => {
        if (cancelled) return
        uid = id
        stop = startCombatBroadcast(
          {
            getState: useCombatStore.getState,
            subscribe: (fn) => {
              const a = useCombatStore.subscribe(fn)
              const b = useCampaignStore.subscribe((s, prev) => {
                if (s.activeCampaignId !== prev.activeCampaignId) fn()
              })
              return () => {
                a()
                b()
              }
            },
          },
          () => {
            const s = useCampaignStore.getState()
            const c = s.campaigns.find((x) => x.id === s.activeCampaignId)
            return c?.dmId && c.dmId === uid ? c.id : null
          }
        )
      })
      .catch(() => {})
    return () => {
      cancelled = true
      stop()
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    applyTheme(getThemeById(themeId).colors)
  }, [themeId])

  return (
    <div className="min-h-screen bg-parchment dark:bg-midnight flex flex-col transition-colors duration-300">
      <Navbar />
      <Sidebar />
      <main
        className={cn(
          'flex-1 overflow-auto pb-20 md:pb-6 md:pl-[52px]',
          !sidebarCollapsed && 'lg:pl-[220px]'
        )}
      >
        <Outlet />
      </main>
      <BottomTabBar />
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast: 'bg-forest-deep text-parchment border-forest-mid/40 font-medium',
            success: 'bg-forest-deep',
            error: 'bg-crimson',
          },
        }}
      />
    </div>
  )
}
