import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Wand2, ChevronRight } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Role } from '@/types'

const schema = z.object({
  nickname: z.string().min(2, 'Minimal 2 karakter').max(20, 'Maksimal 20 karakter'),
})

type FormValues = z.infer<typeof schema>

export function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const { setProfile } = useAppStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormValues) => {
    if (!selectedRole) return
    setProfile(data.nickname, selectedRole)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-forest-deep dark:bg-midnight flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🐉</div>
        <h1 className="font-cinzel text-4xl font-black text-parchment mb-2 tracking-wide">
          D&D Sistem
        </h1>
        <p className="text-parchment/60 text-sm font-crimson">
          Sistem Digital Dungeons &amp; Dragons
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-parchment dark:bg-midnight/80 rounded-xl border border-gold/30 shadow-2xl p-6">
        <h2 className="font-cinzel text-xl font-semibold text-forest-deep dark:text-gold-light mb-1">
          Selamat Datang
        </h2>
        <p className="text-sm text-forest-light dark:text-parchment/60 mb-6">
          Masukkan nickname dan pilih peranmu untuk memulai petualangan.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Nickname */}
          <div className="space-y-1.5">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              placeholder="Nama adventurermu..."
              {...register('nickname')}
            />
            {errors.nickname && (
              <p className="text-crimson text-xs mt-1">{errors.nickname.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label>Pilih Peran</Label>
            <div className="grid grid-cols-2 gap-3">
              <RoleCard
                role="dm"
                icon={<Wand2 className="h-6 w-6" />}
                title="Dungeon Master"
                description="Buat & kelola kampanye"
                selected={selectedRole === 'dm'}
                onClick={() => setSelectedRole('dm')}
              />
              <RoleCard
                role="player"
                icon={<Shield className="h-6 w-6" />}
                title="Player"
                description="Bergabung & bertualang"
                selected={selectedRole === 'player'}
                onClick={() => setSelectedRole('player')}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            variant="gold"
            disabled={!selectedRole}
          >
            Mulai Petualangan
            <ChevronRight className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Decorative */}
      <p className="text-parchment/30 text-xs mt-8 font-crimson italic text-center">
        "Not all those who wander are lost." — J.R.R. Tolkien
      </p>
    </div>
  )
}

function RoleCard({
  role, icon, title, description, selected, onClick,
}: {
  role: Role; icon: React.ReactNode; title: string; description: string
  selected: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all text-center ${
        selected
          ? 'border-gold bg-gold/10 dark:bg-gold/20'
          : 'border-forest-deep/20 bg-forest-deep/5 dark:bg-forest-deep/20 hover:border-forest-mid/50'
      }`}
    >
      <span className={selected ? 'text-gold' : 'text-forest-deep dark:text-parchment/60'}>
        {icon}
      </span>
      <div>
        <p className={`font-cinzel text-xs font-semibold ${selected ? 'text-gold' : 'text-forest-deep dark:text-parchment'}`}>
          {title}
        </p>
        <p className="text-[10px] text-forest-light dark:text-parchment/50 mt-0.5">{description}</p>
      </div>
    </button>
  )
}
