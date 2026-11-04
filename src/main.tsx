import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { applyTheme, getThemeById } from '@/lib/themes'
import { registerSW } from 'virtual:pwa-register'
import { toast } from 'sonner'

// Apply persisted theme before first render to avoid flash
try {
  const stored = JSON.parse(localStorage.getItem('dnd-app') ?? '{}')
  const themeId: string = stored?.state?.themeId ?? 'forest'
  applyTheme(getThemeById(themeId).colors)
} catch {
  // fallback to default theme from @theme CSS
}

const updateSW = registerSW({
  onNeedRefresh() {
    toast('Versi baru tersedia', {
      duration: Infinity,
      action: { label: 'Muat ulang', onClick: () => void updateSW(true) },
    })
  },
  onOfflineReady() {
    toast.success('Siap dipakai offline')
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
