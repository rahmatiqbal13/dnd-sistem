import {
  Home, Users, Swords, BookOpen, Map, Dice6, Users2,
  FileText, CalendarDays, FlaskConical, ShieldCheck,
  ChevronLeft, ChevronRight, Moon, Sun, Settings,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getInitials, avatarColor } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/characters', icon: Users, label: 'Karakter' },
  { to: '/party', icon: Users2, label: 'Party' },
  { to: '/combat', icon: Swords, label: 'Combat' },
  { to: '/dice', icon: Dice6, label: 'Dadu' },
  { to: '/compendium', icon: BookOpen, label: 'Kompendium' },
  { to: '/notes', icon: FileText, label: 'Catatan' },
  { to: '/sessions', icon: CalendarDays, label: 'Sesi' },
  { to: '/homebrew', icon: FlaskConical, label: 'Homebrew' },
]

const DM_ITEMS = [
  { to: '/campaign', icon: Map, label: 'Kampanye' },
  { to: '/dm-tools', icon: ShieldCheck, label: 'DM Tools' },
]

function NavItem({
  to, icon: Icon, label, collapsed,
}: {
  to: string; icon: React.ElementType; label: string; collapsed: boolean
}) {
  return (
    <div className="relative group px-1 my-0.5">
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            'flex items-center h-9 rounded-md px-2 transition-colors',
            isActive
              ? 'bg-gold/20 text-gold-light'
              : 'text-parchment/60 hover:text-parchment hover:bg-forest-mid/30'
          )
        }
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span
          className={cn(
            'ml-3 text-sm font-medium whitespace-nowrap overflow-hidden',
            collapsed ? 'hidden' : 'hidden lg:block'
          )}
        >
          {label}
        </span>
      </NavLink>
      <div
        className={cn(
          'absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1',
          'bg-midnight text-parchment text-xs rounded shadow-lg',
          'opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-150',
          !collapsed && 'lg:hidden'
        )}
      >
        {label}
      </div>
    </div>
  )
}

export function Sidebar() {
  const { nickname, role, darkMode, setDarkMode, sidebarCollapsed, toggleSidebarCollapsed } =
    useAppStore()
  const navigate = useNavigate()

  const items = role === 'dm' ? [...NAV_ITEMS, ...DM_ITEMS] : NAV_ITEMS

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-screen z-30',
        'hidden md:flex flex-col',
        'bg-forest-deep dark:bg-midnight border-r border-forest-mid/30',
        'w-[52px] transition-[width] duration-200 overflow-hidden',
        !sidebarCollapsed && 'lg:w-[220px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-2 border-b border-forest-mid/30 shrink-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 focus:outline-none min-w-0"
        >
          <span className="text-gold-light text-xl shrink-0">🐉</span>
          <span
            className={cn(
              'font-cinzel font-bold text-parchment text-sm whitespace-nowrap overflow-hidden',
              sidebarCollapsed ? 'hidden' : 'hidden lg:block'
            )}
          >
            D&D Sistem
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-thin">
        {items.map((item) => (
          <NavItem key={item.to} {...item} collapsed={sidebarCollapsed} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-forest-mid/30 p-1 space-y-0.5 shrink-0">
        {/* Dark mode */}
        <div className="relative group px-1 my-0.5">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center w-full h-9 rounded-md px-2 transition-colors text-parchment/60 hover:text-parchment hover:bg-forest-mid/30"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 shrink-0" />
            ) : (
              <Moon className="h-5 w-5 shrink-0" />
            )}
            <span
              className={cn(
                'ml-3 text-sm font-medium whitespace-nowrap overflow-hidden',
                sidebarCollapsed ? 'hidden' : 'hidden lg:block'
              )}
            >
              {darkMode ? 'Mode Terang' : 'Mode Gelap'}
            </span>
          </button>
          <div
            className={cn(
              'absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1',
              'bg-midnight text-parchment text-xs rounded shadow-lg',
              'opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-150',
              !sidebarCollapsed && 'lg:hidden'
            )}
          >
            {darkMode ? 'Mode Terang' : 'Mode Gelap'}
          </div>
        </div>

        {/* Settings */}
        <div className="relative group px-1 my-0.5">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center w-full h-9 rounded-md px-2 transition-colors text-parchment/60 hover:text-parchment hover:bg-forest-mid/30"
          >
            <Settings className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                'ml-3 text-sm font-medium whitespace-nowrap overflow-hidden',
                sidebarCollapsed ? 'hidden' : 'hidden lg:block'
              )}
            >
              Pengaturan
            </span>
          </button>
          <div
            className={cn(
              'absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1',
              'bg-midnight text-parchment text-xs rounded shadow-lg',
              'opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-150',
              !sidebarCollapsed && 'lg:hidden'
            )}
          >
            Pengaturan
          </div>
        </div>

        {/* User info */}
        {nickname && (
          <div className="relative group px-1 my-0.5">
            <div className="flex items-center h-9 px-2 gap-2 min-w-0">
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarFallback className={`${avatarColor(nickname)} text-[9px]`}>
                  {getInitials(nickname)}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'overflow-hidden min-w-0',
                  sidebarCollapsed ? 'hidden' : 'hidden lg:block'
                )}
              >
                <p className="text-parchment text-xs font-medium truncate leading-none">
                  {nickname}
                </p>
                {role && (
                  <Badge
                    variant={role === 'dm' ? 'dm' : 'player'}
                    className="text-[9px] px-1 py-0 h-auto mt-0.5"
                  >
                    {role === 'dm' ? 'DM' : 'Player'}
                  </Badge>
                )}
              </div>
            </div>
            <div
              className={cn(
                'absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1',
                'bg-midnight text-parchment text-xs rounded shadow-lg',
                'opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-150',
                !sidebarCollapsed && 'lg:hidden'
              )}
            >
              {nickname} · {role === 'dm' ? 'DM' : 'Player'}
            </div>
          </div>
        )}

        {/* Collapse toggle - desktop only */}
        <div className="hidden lg:block px-1 my-0.5">
          <button
            onClick={toggleSidebarCollapsed}
            className="flex items-center w-full h-9 rounded-md px-2 transition-colors text-parchment/40 hover:text-parchment hover:bg-forest-mid/30"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5 shrink-0" />
            ) : (
              <ChevronLeft className="h-5 w-5 shrink-0" />
            )}
            <span
              className={cn(
                'ml-3 text-xs whitespace-nowrap overflow-hidden',
                sidebarCollapsed ? 'hidden' : 'block'
              )}
            >
              Perkecil
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
