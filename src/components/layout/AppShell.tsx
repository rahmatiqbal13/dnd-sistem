import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { BottomTabBar } from './BottomTabBar'
import { Sidebar } from './Sidebar'
import { Toaster } from 'sonner'
import { useAppStore } from '@/store/appStore'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { applyTheme, getThemeById } from '@/lib/themes'

export function AppShell() {
  const darkMode = useAppStore((s) => s.darkMode)
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed)
  const themeId = useAppStore((s) => s.themeId)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    applyTheme(getThemeById(themeId).colors)
  }, [themeId])

  return (
    <div className="min-h-screen bg-parchment dark:bg-midnight flex flex-col">
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
