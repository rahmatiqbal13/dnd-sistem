import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { CharacterListPage } from '@/pages/CharacterListPage'
import { CharacterBuilderPage } from '@/pages/CharacterBuilderPage'
import { CharacterSheetPage } from '@/pages/CharacterSheetPage'
import { DiceRollerPage } from '@/pages/DiceRollerPage'
import { CombatPage } from '@/pages/CombatPage'
import { CampaignPage } from '@/pages/CampaignPage'
import { CompendiumPage } from '@/pages/CompendiumPage'
import { PartyPage } from '@/pages/PartyPage'
import { MyNotesPage } from '@/pages/MyNotesPage'
import { SessionsPage } from '@/pages/SessionsPage'
import { HomebrewPage } from '@/pages/HomebrewPage'
import { DmToolsPage } from '@/pages/DmToolsPage'
import { useAppStore } from '@/store/appStore'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const nickname = useAppStore((s) => s.nickname)
  if (!nickname) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/characters" element={<CharacterListPage />} />
          <Route path="/characters/new" element={<CharacterBuilderPage />} />
          <Route path="/characters/:id" element={<CharacterSheetPage />} />
          <Route path="/dice" element={<DiceRollerPage />} />
          <Route path="/combat" element={<CombatPage />} />
          <Route path="/campaign" element={<CampaignPage />} />
          <Route path="/compendium" element={<CompendiumPage />} />
          <Route path="/party" element={<PartyPage />} />
          <Route path="/notes" element={<MyNotesPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/homebrew" element={<HomebrewPage />} />
          <Route path="/dm-tools" element={<DmToolsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
