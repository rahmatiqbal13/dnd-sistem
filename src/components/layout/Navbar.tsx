import { Moon, Sun, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials, avatarColor } from '@/lib/utils'

export function Navbar() {
  const { nickname, role, darkMode, toggleDarkMode } = useAppStore()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between px-4 bg-forest-deep dark:bg-midnight border-b border-forest-mid/30 shadow-sm md:hidden">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 focus:outline-none"
      >
        <span className="text-gold-light text-xl">🐉</span>
        <span className="font-cinzel font-bold text-parchment text-base hidden sm:block tracking-wide">
          D&D Sistem
        </span>
      </button>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleDarkMode}
          className="text-parchment/80 hover:text-parchment hover:bg-forest-mid/40"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate('/settings')}
          className="text-parchment/80 hover:text-parchment hover:bg-forest-mid/40"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>

        {nickname && (
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 focus:outline-none"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className={`${avatarColor(nickname)} text-[10px]`}>
                {getInitials(nickname)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-parchment text-xs font-medium leading-none">{nickname}</span>
              {role && (
                <Badge
                  variant={role === 'dm' ? 'dm' : 'player'}
                  className="text-[9px] px-1 py-0 mt-0.5 h-auto"
                >
                  {role === 'dm' ? 'DM' : 'Player'}
                </Badge>
              )}
            </div>
          </button>
        )}
      </div>
    </header>
  )
}
