import { Home, Users, Swords, Dice6, Map } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

// Kompendium stays reachable from the dashboard; dice and campaign joining are needed at the table
const tabs = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/characters', icon: Users, label: 'Karakter' },
  { to: '/dice', icon: Dice6, label: 'Dadu' },
  { to: '/combat', icon: Swords, label: 'Combat' },
  { to: '/campaign', icon: Map, label: 'Kampanye' },
]

export function BottomTabBar() {
  const navTabs = tabs

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-stretch bg-forest-deep dark:bg-midnight border-t border-forest-mid/30 shadow-lg md:hidden">
      {navTabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors min-h-[44px]',
              isActive
                ? 'text-gold-light'
                : 'text-parchment/50 hover:text-parchment/80'
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className={cn('h-5 w-5', isActive && 'drop-shadow-[0_0_4px_rgba(232,184,75,0.8)]')} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
