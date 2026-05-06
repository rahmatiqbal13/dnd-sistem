import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  ChevronUp, 
  Sparkles, 
  Sword, 
  Shield, 
  Heart,
  Dices,
  Check,
  AlertCircle
} from 'lucide-react'
import type { Character, CharacterFeat, SelectedSubclass, AbilityScores } from '@/types'
import { 
  getLevelUpRequirements, 
  getFeaturesAtLevel, 
  getRecommendedHpIncrease,
  rollHpIncrease,
  isASILevel,
  getAvailableSubclasses,
  getAvailableFeats,
  createCharacterFeat,
  createSelectedSubclass,
  validateASI,
  ASI_LEVELS,
} from '@/lib/levelUp'
import { getClass2024 } from '@/data/dnd2024/classes'
import { formatModifier, abilityModifier } from '@/lib/utils'
import { FeatSelector } from './FeatSelector'
import { SubclassSelector } from './SubclassSelector'

interface LevelUpDialogProps {
  open: boolean
  onClose: () => void
  character: Character
  onLevelUp: (options: {
    hpIncrease: number
    feat?: CharacterFeat
    subclass?: SelectedSubclass
    asi?: Partial<AbilityScores>
  }) => void
}

type HpMethod = 'average' | 'roll' | 'manual'

export function LevelUpDialog({ open, onClose, character, onLevelUp }: LevelUpDialogProps) {
  const requirements = useMemo(() => getLevelUpRequirements(character), [character])
  const cls = useMemo(() => getClass2024(character.class), [character.class])
  
  const [hpMethod, setHpMethod] = useState<HpMethod>('average')
  const [hpValue, setHpValue] = useState(getRecommendedHpIncrease(character))
  const [rolledHp, setRolledHp] = useState<number | null>(null)
  
  const [selectedFeat, setSelectedFeat] = useState<CharacterFeat | null>(null)
  const [selectedSubclass, setSelectedSubclass] = useState<SelectedSubclass | null>(null)
  const [asiSelection, setAsiSelection] = useState<Partial<AbilityScores>>({})
  
  const [activeTab, setActiveTab] = useState('hp')
  
  const conMod = abilityModifier(character.abilityScores.con)
  const hitDie = cls?.hitDie ?? 8
  
  const newFeatures = useMemo(() => {
    return getFeaturesAtLevel(character.class, requirements.nextLevel)
  }, [character.class, requirements.nextLevel])
  
  const availableSubclasses = useMemo(() => {
    if (!requirements.requiresSubclassSelection) return []
    return getAvailableSubclasses(character.class)
  }, [character.class, requirements.requiresSubclassSelection])
  
  const availableFeats = useMemo(() => {
    if (!requirements.requiresASIOrFeat) return []
    return getAvailableFeats(character)
  }, [character, requirements.requiresASIOrFeat])
  
  const canConfirm = useMemo(() => {
    if (requirements.requiresSubclassSelection && !selectedSubclass) return false
    if (requirements.requiresASIOrFeat && !selectedFeat && Object.keys(asiSelection).length === 0) return false
    return true
  }, [requirements, selectedSubclass, selectedFeat, asiSelection])
  
  const handleRollHp = () => {
    const roll = rollHpIncrease(hitDie, conMod)
    setRolledHp(roll)
    setHpValue(roll)
    setHpMethod('roll')
  }
  
  const handleSelectAverage = () => {
    setHpValue(getRecommendedHpIncrease(character))
    setHpMethod('average')
    setRolledHp(null)
  }
  
  const handleManualHpChange = (value: number) => {
    setHpValue(Math.max(1, value))
    setHpMethod('manual')
    setRolledHp(null)
  }
  
  const handleASISelection = (ability: keyof AbilityScores, increase: number) => {
    setAsiSelection(prev => {
      const newSelection = { ...prev }
      if (increase === 0) {
        delete newSelection[ability]
      } else {
        newSelection[ability] = increase
      }
      return newSelection
    })
    setSelectedFeat(null)
  }
  
  const handleFeatSelection = (feat: CharacterFeat | null) => {
    setSelectedFeat(feat)
    if (feat) {
      setAsiSelection({})
    }
  }
  
  const handleConfirm = () => {
    if (!canConfirm) {
      toast.error('Please complete all required selections')
      return
    }
    
    // Validate ASI if selected
    if (Object.keys(asiSelection).length > 0) {
      const validation = validateASI(character.abilityScores, asiSelection)
      if (!validation.valid) {
        toast.error(validation.error)
        return
      }
    }
    
    onLevelUp({
      hpIncrease: hpValue,
      feat: selectedFeat ?? undefined,
      subclass: selectedSubclass ?? undefined,
      asi: Object.keys(asiSelection).length > 0 ? asiSelection : undefined,
    })
    
    toast.success(`Level up complete! ${character.name} is now level ${requirements.nextLevel}!`)
    onClose()
  }
  
  const totalAsiPoints = Object.values(asiSelection).reduce((a, b) => (a || 0) + (b || 0), 0)
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChevronUp className="h-5 w-5 text-gold" />
            Level Up: {character.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Level Progression */}
          <Card className="bg-forest-deep/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-forest-light">Current</p>
                  <p className="text-2xl font-bold">{requirements.currentLevel}</p>
                </div>
                <div className="text-forest-light">
                  <ChevronUp className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-gold">New Level</p>
                  <p className="text-3xl font-bold text-gold">{requirements.nextLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* New Features Preview */}
          {newFeatures.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-gold" />
                  New Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {newFeatures.map(feature => (
                    <Badge key={feature} variant="outline" className="bg-gold/10">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="hp">
                <Heart className="h-4 w-4 mr-1" />
                HP
              </TabsTrigger>
              {requirements.requiresSubclassSelection && (
                <TabsTrigger value="subclass">
                  <Sword className="h-4 w-4 mr-1" />
                  Subclass
                </TabsTrigger>
              )}
              {requirements.requiresASIOrFeat && (
                <TabsTrigger value="feat">
                  <Shield className="h-4 w-4 mr-1" />
                  ASI/Feat
                </TabsTrigger>
              )}
            </TabsList>
            
            {/* HP Selection */}
            <TabsContent value="hp" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Hit Points Increase</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-forest-light">
                    Hit Die: d{hitDie} | CON Mod: {formatModifier(conMod)}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={hpMethod === 'average' ? 'default' : 'outline'}
                      onClick={handleSelectAverage}
                      className="flex flex-col items-center py-4"
                    >
                      <span className="text-xs opacity-70">Average</span>
                      <span className="text-lg font-bold">+{getRecommendedHpIncrease(character)}</span>
                    </Button>
                    
                    <Button
                      variant={hpMethod === 'roll' ? 'default' : 'outline'}
                      onClick={handleRollHp}
                      className="flex flex-col items-center py-4"
                    >
                      <span className="text-xs opacity-70 flex items-center gap-1">
                        <Dices className="h-3 w-3" />
                        Roll
                      </span>
                      <span className="text-lg font-bold">
                        {rolledHp ? `+${rolledHp}` : 'Roll'}
                      </span>
                    </Button>
                    
                    <div className={`flex flex-col items-center py-2 px-2 rounded-md border ${hpMethod === 'manual' ? 'bg-forest-deep text-parchment' : 'border-forest-deep/20'}`}>
                      <span className="text-xs opacity-70">Manual</span>
                      <input
                        type="number"
                        min={1}
                        max={hitDie + conMod}
                        value={hpValue}
                        onChange={(e) => handleManualHpChange(parseInt(e.target.value) || 1)}
                        className="w-16 text-center bg-transparent border-b border-current text-lg font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <p className="text-xs text-forest-light text-center">
                    New Max HP: {character.maxHp} → {character.maxHp + hpValue}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Subclass Selection */}
            {requirements.requiresSubclassSelection && (
              <TabsContent value="subclass">
                <SubclassSelector
                  subclasses={availableSubclasses}
                  selectedId={selectedSubclass?.subclassId}
                  onSelect={(subclass) => {
                    if (subclass) {
                      setSelectedSubclass(createSelectedSubclass(
                        subclass.id,
                        subclass.name,
                        subclass.classId,
                        requirements.nextLevel
                      ))
                    } else {
                      setSelectedSubclass(null)
                    }
                  }}
                />
              </TabsContent>
            )}
            
            {/* ASI/Feat Selection */}
            {requirements.requiresASIOrFeat && (
              <TabsContent value="feat" className="space-y-4">
                <Tabs defaultValue="asi">
                  <TabsList className="w-full">
                    <TabsTrigger value="asi" className="flex-1">
                      Ability Score Improvement
                    </TabsTrigger>
                    <TabsTrigger value="feat" className="flex-1">
                      Select Feat
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="asi" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">
                          Distribute 2 Points (max 20)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map(ability => {
                            const current = character.abilityScores[ability]
                            const increase = asiSelection[ability] || 0
                            const newValue = current + increase
                            const canIncrease = newValue < 20 && totalAsiPoints < 2
                            const canDecrease = increase > 0
                            
                            return (
                              <div key={ability} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                  <span className="text-xs uppercase font-bold">{ability}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">{current}</span>
                                    {increase > 0 && (
                                      <>
                                        <span className="text-gold">→</span>
                                        <span className="text-gold font-bold">{newValue}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleASISelection(ability, Math.max(0, increase - 1))}
                                    disabled={!canDecrease}
                                  >
                                    -
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleASISelection(ability, increase + 1)}
                                    disabled={!canIncrease}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <p className="text-xs text-center mt-4 text-forest-light">
                          Points remaining: {2 - totalAsiPoints}
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="feat" className="pt-4">
                    <FeatSelector
                      feats={availableFeats}
                      selectedId={selectedFeat?.featId}
                      onSelect={(feat) => {
                        if (feat) {
                          handleFeatSelection(createCharacterFeat(feat, requirements.nextLevel, 'asi'))
                        } else {
                          handleFeatSelection(null)
                        }
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        <DialogFooter className="gap-2">
          {!canConfirm && (
            <div className="flex items-center gap-2 text-xs text-crimson">
              <AlertCircle className="h-4 w-4" />
              {requirements.requiresSubclassSelection && !selectedSubclass && 'Select a subclass'}
              {requirements.requiresASIOrFeat && !selectedFeat && totalAsiPoints === 0 && 'Choose ASI or Feat'}
            </div>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="bg-gold text-midnight hover:bg-gold/90"
          >
            <Check className="h-4 w-4 mr-1" />
            Level Up to {requirements.nextLevel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
