import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronLeft, 
  Database, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Layers,
  Swords,
  Sparkles,
  Users,
  BookOpen,
  Activity,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ALL_FEATS } from '@/data/dnd2024/feats'
import { ALL_SUBCLASSES } from '@/data/dnd2024/subclasses'
import { CLASSES_2024 } from '@/data/dnd2024/classes'
import { RACES_DATA_2024 } from '@/data/dnd2024/races'
import { BACKGROUNDS_2024 } from '@/data/dnd2024/backgrounds'
import { COMPENDIUM_DATA } from '@/data/compendium'
import { useCharacterStore } from '@/store/characterStore'
import { useCampaignStore } from '@/store/campaignStore'
import { useCombatStore } from '@/store/combatStore'
import { useAppStore } from '@/store/appStore'

interface SystemCheck {
  name: string
  status: 'ok' | 'error' | 'warning'
  count?: number
  message: string
}

function StatusIcon({ status }: { status: 'ok' | 'error' | 'warning' }) {
  if (status === 'ok') return <CheckCircle2 className="h-5 w-5 text-green-500" />
  if (status === 'error') return <XCircle className="h-5 w-5 text-red-500" />
  return <AlertTriangle className="h-5 w-5 text-yellow-500" />
}

export function SystemCheckPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  // Check all data
  const checks: SystemCheck[] = [
    {
      name: 'Feats Database',
      status: ALL_FEATS.length > 0 ? 'ok' : 'error',
      count: ALL_FEATS.length,
      message: ALL_FEATS.length > 0 ? `${ALL_FEATS.length} feats loaded` : 'No feats found'
    },
    {
      name: 'Subclasses Database',
      status: ALL_SUBCLASSES.length > 0 ? 'ok' : 'error',
      count: ALL_SUBCLASSES.length,
      message: ALL_SUBCLASSES.length > 0 ? `${ALL_SUBCLASSES.length} subclasses loaded` : 'No subclasses found'
    },
    {
      name: 'Classes Database',
      status: CLASSES_2024.length > 0 ? 'ok' : 'error',
      count: CLASSES_2024.length,
      message: `${CLASSES_2024.length} classes loaded`
    },
    {
      name: 'Races Database',
      status: RACES_DATA_2024.length > 0 ? 'ok' : 'error',
      count: RACES_DATA_2024.length,
      message: `${RACES_DATA_2024.length} races loaded`
    },
    {
      name: 'Backgrounds Database',
      status: BACKGROUNDS_2024.length > 0 ? 'ok' : 'error',
      count: BACKGROUNDS_2024.length,
      message: `${BACKGROUNDS_2024.length} backgrounds loaded`
    },
    {
      name: 'Compendium Data',
      status: COMPENDIUM_DATA.length > 0 ? 'ok' : 'warning',
      count: COMPENDIUM_DATA.length,
      message: COMPENDIUM_DATA.length > 0 ? `${COMPENDIUM_DATA.length} entries` : 'Run: npm run fetch:compendium'
    }
  ]

  const characters = useCharacterStore(s => s.characters)
  const campaigns = useCampaignStore(s => s.campaigns)
  const combatants = useCombatStore(s => s.combatants)
  const { nickname, role } = useAppStore()

  const storeChecks: SystemCheck[] = [
    {
      name: 'Character Store',
      status: 'ok',
      count: characters.length,
      message: `${characters.length} characters stored`
    },
    {
      name: 'Campaign Store',
      status: 'ok',
      count: campaigns.length,
      message: `${campaigns.length} campaigns stored`
    },
    {
      name: 'Combat Store',
      status: 'ok',
      count: combatants.length,
      message: `${combatants.length} combatants active`
    },
    {
      name: 'App Store',
      status: nickname ? 'ok' : 'warning',
      message: nickname ? `User: ${nickname} (${role})` : 'No user profile set'
    }
  ]

  const originFeats = ALL_FEATS.filter(f => f.category === 'origin')
  const generalFeats = ALL_FEATS.filter(f => f.category === 'general')

  const subclassesByClass = CLASSES_2024.map(cls => ({
    class: cls.id,
    count: ALL_SUBCLASSES.filter(s => s.classId === cls.id).length
  }))

  const compendiumByCategory = {
    spell: COMPENDIUM_DATA.filter(e => e.category === 'spell').length,
    monster: COMPENDIUM_DATA.filter(e => e.category === 'monster').length,
    condition: COMPENDIUM_DATA.filter(e => e.category === 'condition').length,
    class: COMPENDIUM_DATA.filter(e => e.category === 'class').length,
    equipment: COMPENDIUM_DATA.filter(e => e.category === 'equipment').length,
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light">
          System Check
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="overview" className="flex-1">
            <Activity className="h-4 w-4 mr-1" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="feats" className="flex-1">
            <Sparkles className="h-4 w-4 mr-1" />
            Feats
          </TabsTrigger>
          <TabsTrigger value="subclasses" className="flex-1">
            <Swords className="h-4 w-4 mr-1" />
            Subclasses
          </TabsTrigger>
          <TabsTrigger value="compendium" className="flex-1">
            <BookOpen className="h-4 w-4 mr-1" />
            Compendium
          </TabsTrigger>
          <TabsTrigger value="stores" className="flex-1">
            <Database className="h-4 w-4 mr-1" />
            Stores
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-gold" />
                Data Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...checks, ...storeChecks].map((check, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-forest-deep/5">
                  <StatusIcon status={check.status} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{check.name}</span>
                      {check.count !== undefined && (
                        <Badge variant="outline" className="text-[10px]">
                          {check.count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-forest-light">{check.message}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/characters/new')}
              >
                <Users className="h-4 w-4 mr-2" />
                Create Test Character
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.reload()}
              >
                <Activity className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-crimson hover:text-crimson"
                onClick={() => {
                  if (confirm('WARNING: This will delete ALL characters, campaigns, and data! Continue?')) {
                    localStorage.clear()
                    window.location.reload()
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feats Tab */}
        <TabsContent value="feats" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Origin Feats</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gold">{originFeats.length}</p>
                <p className="text-xs text-forest-light">Level 1 background feats</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">General Feats</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gold">{generalFeats.length}</p>
                <p className="text-xs text-forest-light">ASI level feats</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Feats ({ALL_FEATS.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                {ALL_FEATS.map(feat => (
                  <div 
                    key={feat.id} 
                    className="p-2 rounded border border-forest-deep/10 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{feat.name}</span>
                      <Badge variant="outline" className="text-[9px]">
                        {feat.category}
                      </Badge>
                      {feat.asi && feat.asi.length > 0 && (
                        <Badge variant="outline" className="text-[9px] bg-gold/20 text-gold">
                          +ASI
                        </Badge>
                      )}
                    </div>
                    {feat.prerequisite && (
                      <p className="text-[10px] text-forest-light mt-1">
                        Req: {feat.prerequisite}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subclasses Tab */}
        <TabsContent value="subclasses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subclasses by Class</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subclassesByClass.map(({ class: cls, count }) => (
                  <div 
                    key={cls} 
                    className="p-3 rounded-lg bg-forest-deep/5 text-center"
                  >
                    <p className="font-medium">{cls}</p>
                    <p className="text-2xl font-bold text-gold">{count}</p>
                    <p className="text-xs text-forest-light">subclasses</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Subclasses ({ALL_SUBCLASSES.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {ALL_SUBCLASSES.map(subclass => (
                  <div 
                    key={subclass.id} 
                    className="p-3 rounded border border-forest-deep/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{subclass.name}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {subclass.classId}
                      </Badge>
                      {subclass.spellcasting && (
                        <Badge variant="outline" className="text-[10px] bg-purple-100 text-purple-700">
                          Spellcasting
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-forest-light mt-1">
                      {subclass.features.length} features
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compendium Tab */}
        <TabsContent value="compendium" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(compendiumByCategory).map(([category, count]) => (
              <Card key={category}>
                <CardContent className="p-4 text-center">
                  <p className="text-xs uppercase text-forest-light">{category}</p>
                  <p className="text-2xl font-bold text-gold">{count}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compendium Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {COMPENDIUM_DATA.length === 0 ? (
                <div className="p-4 text-center bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-sm">Compendium data is empty</p>
                  <p className="text-xs text-forest-light mt-1">
                    Run: npm run fetch:compendium
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm">
                    Total entries: <strong>{COMPENDIUM_DATA.length}</strong>
                  </p>
                  <div className="max-h-[300px] overflow-y-auto space-y-1">
                    {COMPENDIUM_DATA.slice(0, 50).map(entry => (
                      <div 
                        key={entry.id} 
                        className="p-2 text-sm rounded bg-forest-deep/5 flex justify-between"
                      >
                        <span>{entry.name}</span>
                        <Badge variant="outline" className="text-[9px]">
                          {entry.category}
                        </Badge>
                      </div>
                    ))}
                    {COMPENDIUM_DATA.length > 50 && (
                      <p className="text-center text-xs text-forest-light">
                        ... and {COMPENDIUM_DATA.length - 50} more
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stores Tab */}
        <TabsContent value="stores" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-forest-mid" />
                <p className="text-2xl font-bold">{characters.length}</p>
                <p className="text-xs text-forest-light">Characters</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Layers className="h-6 w-6 mx-auto mb-2 text-forest-mid" />
                <p className="text-2xl font-bold">{campaigns.length}</p>
                <p className="text-xs text-forest-light">Campaigns</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Swords className="h-6 w-6 mx-auto mb-2 text-forest-mid" />
                <p className="text-2xl font-bold">{combatants.length}</p>
                <p className="text-xs text-forest-light">Combatants</p>
              </CardContent>
            </Card>
          </div>

          {characters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Stored Characters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {characters.map(char => (
                    <div 
                      key={char.id} 
                      className="p-3 rounded border border-forest-deep/10 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{char.name}</p>
                        <p className="text-sm text-forest-light">
                          Level {char.level} {char.race} {char.class}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/characters/${char.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
