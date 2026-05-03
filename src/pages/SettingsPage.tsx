import { Moon, Sun, Dice6, Shield, Wand2, LogOut, User, Palette, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppStore } from '@/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials, avatarColor } from '@/lib/utils'
import { THEMES, applyTheme, getThemeById } from '@/lib/themes'
import { cn } from '@/lib/utils'
import type { Role } from '@/types'

export function SettingsPage() {
  const {
    nickname, role, darkMode, diceAnimations,
    setDarkMode, toggleDiceAnimations, setRole,
    themeId, setTheme, reset,
  } = useAppStore()
  const navigate = useNavigate()

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole)
    toast.success(`Role diubah ke ${newRole === 'dm' ? 'Dungeon Master' : 'Player'}`)
  }

  const handleThemeChange = (id: string) => {
    setTheme(id)
    applyTheme(getThemeById(id).colors)
    toast.success(`Tema "${getThemeById(id).name}" diterapkan`)
  }

  const handleLogout = () => {
    reset()
    navigate('/')
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light">
        Pengaturan
      </h1>

      {/* Profile */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="h-4 w-4 text-gold" />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {nickname && (
              <Avatar className="h-12 w-12">
                <AvatarFallback className={`${avatarColor(nickname)} text-sm`}>
                  {getInitials(nickname)}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <p className="font-cinzel font-semibold text-forest-deep dark:text-parchment text-lg">
                {nickname}
              </p>
              <Badge variant={role === 'dm' ? 'dm' : 'player'}>
                {role === 'dm' ? 'Dungeon Master' : 'Player'}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Role Toggle */}
          <div>
            <p className="text-sm font-medium text-forest-deep dark:text-parchment mb-2">Ganti Peran</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleRoleChange('dm')}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  role === 'dm'
                    ? 'border-gold bg-gold/10 dark:bg-gold/20'
                    : 'border-forest-deep/15 hover:border-forest-mid/40'
                }`}
              >
                <Wand2 className={`h-4 w-4 ${role === 'dm' ? 'text-gold' : 'text-forest-deep dark:text-parchment/60'}`} />
                <span className={`text-xs font-cinzel font-semibold ${role === 'dm' ? 'text-gold' : 'text-forest-deep dark:text-parchment'}`}>
                  Dungeon Master
                </span>
              </button>
              <button
                onClick={() => handleRoleChange('player')}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  role === 'player'
                    ? 'border-forest-mid bg-forest-deep/10 dark:bg-forest-mid/20'
                    : 'border-forest-deep/15 hover:border-forest-mid/40'
                }`}
              >
                <Shield className={`h-4 w-4 ${role === 'player' ? 'text-forest-mid' : 'text-forest-deep dark:text-parchment/60'}`} />
                <span className={`text-xs font-cinzel font-semibold ${role === 'player' ? 'text-forest-mid dark:text-gold-light' : 'text-forest-deep dark:text-parchment'}`}>
                  Player
                </span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Picker */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="h-4 w-4 text-gold" />
            Tema Warna
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {THEMES.map((theme) => {
              const isActive = themeId === theme.id
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={cn(
                    'relative flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all',
                    isActive
                      ? 'border-gold shadow-md scale-[1.03]'
                      : 'border-forest-deep/10 hover:border-forest-mid/30 hover:scale-[1.02]'
                  )}
                >
                  {/* Color swatch */}
                  <div className="flex gap-0.5 rounded-lg overflow-hidden w-full h-8">
                    <div className="flex-1" style={{ backgroundColor: theme.primary }} />
                    <div className="flex-1" style={{ backgroundColor: theme.accent }} />
                    <div className="w-3" style={{ backgroundColor: theme.bg }} />
                  </div>
                  <span className="text-[10px] font-medium text-forest-deep dark:text-parchment leading-tight text-center">
                    {theme.name}
                  </span>
                  {isActive && (
                    <div className="absolute top-1 right-1 bg-gold rounded-full p-0.5">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Preferensi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="h-4 w-4 text-gold" /> : <Sun className="h-4 w-4 text-gold" />}
              <div>
                <p className="text-sm font-medium text-forest-deep dark:text-parchment">Dark Mode</p>
                <p className="text-xs text-forest-light dark:text-parchment/50">
                  {darkMode ? 'Mode gelap aktif' : 'Mode terang aktif'}
                </p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dice6 className="h-4 w-4 text-forest-mid" />
              <div>
                <p className="text-sm font-medium text-forest-deep dark:text-parchment">Animasi Dadu</p>
                <p className="text-xs text-forest-light dark:text-parchment/50">
                  Efek animasi saat melempar dadu
                </p>
              </div>
            </div>
            <Switch checked={diceAnimations} onCheckedChange={toggleDiceAnimations} />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardContent className="p-4 text-center">
          <p className="font-cinzel text-forest-deep dark:text-gold-light font-semibold">D&D Sistem</p>
          <p className="text-xs text-forest-light dark:text-parchment/40 mt-1">
            Mobile-First Digital D&D · v1.9.0
          </p>
          <p className="text-xs text-forest-light dark:text-parchment/30 mt-0.5">
            8 Tema Warna · Tailwind v4 + shadcn/ui
          </p>
        </CardContent>
      </Card>

      {/* Logout */}
      <Button
        variant="destructive"
        className="w-full"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Keluar &amp; Reset Profil
      </Button>
    </div>
  )
}
