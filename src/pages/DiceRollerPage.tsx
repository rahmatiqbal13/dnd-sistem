import { useState, useRef } from 'react'
import { Trash2, Dices, Sparkles, Skull, RotateCcw, History } from 'lucide-react'
import { toast } from 'sonner'
import { useDiceStore } from '@/store/diceStore'
import { useAppStore } from '@/store/appStore'
import { rollDice, DICE_TYPES, resultLabel, enrichDiceRoll } from '@/lib/dice'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatDate } from '@/lib/utils'
import type { DiceType, RollMode } from '@/types'

const DICE_ICONS: Record<DiceType, string> = {
  4: '△', 6: '□', 8: '◇', 10: '⬟', 12: '⬠', 20: '⬡', 100: '%',
}

const DICE_COLORS: Record<DiceType, string> = {
  4: 'from-red-500 to-red-600',
  6: 'from-blue-500 to-blue-600',
  8: 'from-green-500 to-green-600',
  10: 'from-purple-500 to-purple-600',
  12: 'from-orange-500 to-orange-600',
  20: 'from-gold to-amber-600',
  100: 'from-crimson to-red-700',
}

export function DiceRollerPage() {
  const { nickname, diceAnimations } = useAppStore()
  const { rollLog, addRoll, clearLog } = useDiceStore()

  const [selectedDice, setSelectedDice] = useState<DiceType>(20)
  const [count, setCount] = useState(1)
  const [modifier, setModifier] = useState(0)
  const [advantage, setAdvantage] = useState(false)
  const [disadvantage, setDisadvantage] = useState(false)
  const [isRolling, setIsRolling] = useState(false)
  const [displayResult, setDisplayResult] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const rollMode: RollMode = advantage ? 'advantage' : disadvantage ? 'disadvantage' : 'normal'

  const handleRoll = () => {
    if (isRolling) return
    const result = rollDice(count, selectedDice, modifier, rollMode, nickname ?? 'Adventurer')
    addRoll(result)

    const natCheck = result.chosenD20 ?? (result.rolls[0] ?? result.total)

    if (diceAnimations) {
      setIsRolling(true)
      setDisplayResult(null)
      let ticks = 0
      const maxTicks = 12
      intervalRef.current = setInterval(() => {
        setDisplayResult(Math.floor(Math.random() * selectedDice) + 1)
        ticks++
        if (ticks >= maxTicks) {
          clearInterval(intervalRef.current!)
          setDisplayResult(result.total)
          setIsRolling(false)
          if (selectedDice === 20 && natCheck === 20) toast.success('🎉 NATURAL 20! Critical Success!')
          else if (selectedDice === 20 && natCheck === 1) toast.error('💀 NATURAL 1! Critical Fail!')
        }
      }, 50)
    } else {
      setDisplayResult(result.total)
      if (selectedDice === 20 && natCheck === 20) toast.success('🎉 NATURAL 20! Critical Success!')
      else if (selectedDice === 20 && natCheck === 1) toast.error('💀 NATURAL 1! Critical Fail!')
    }
  }

  const toggleAdvantage = () => {
    setAdvantage((v) => !v)
    if (!advantage) setDisadvantage(false)
  }

  const toggleDisadvantage = () => {
    setDisadvantage((v) => !v)
    if (!disadvantage) setAdvantage(false)
  }

  const latestRoll = rollLog[0] ? enrichDiceRoll(rollLog[0]) : null
  const pair = latestRoll?.d20Pair
  const chosen = latestRoll?.chosenD20
  const discarded = latestRoll?.discardedD20

  return (
    <div className="container-responsive py-6 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <h1 className="font-cinzel text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <Dices className="h-8 w-8 text-gold" />
            Dice Roller
          </h1>
          <p className="text-white/60 text-sm mt-2">
            Roll dice for your D&D 5e adventures
          </p>
        </div>
      </div>

      {/* Main Result Display */}
      <Card className="border-2 border-gold/30 shadow-xl shadow-gold/10 overflow-hidden">
        <CardContent className="p-6">
          {/* Advantage/Disadvantage Display */}
          {pair && chosen != null && discarded != null && displayResult === latestRoll?.total && !isRolling && (
            <div className="flex items-center justify-center gap-4 mb-6">
              <div
                className={cn(
                  'flex flex-col items-center rounded-2xl border-3 px-6 py-4 min-w-[100px]',
                  chosen === pair[0]
                    ? 'border-gold bg-gold/20 shadow-lg shadow-gold/30'
                    : 'border-gray-400/30 bg-gray-500/10 opacity-50'
                )}
              >
                <span className="text-xs uppercase tracking-wider text-gold-light/70 mb-1">
                  {chosen === pair[0] ? 'Kept' : 'Discarded'}
                </span>
                <span className="text-5xl font-cinzel font-black text-gold-light">{pair[0]}</span>
              </div>
              <div className="text-2xl text-gold/50 font-bold">vs</div>
              <div
                className={cn(
                  'flex flex-col items-center rounded-2xl border-3 px-6 py-4 min-w-[100px]',
                  chosen === pair[1]
                    ? 'border-gold bg-gold/20 shadow-lg shadow-gold/30'
                    : 'border-gray-400/30 bg-gray-500/10 opacity-50'
                )}
              >
                <span className="text-xs uppercase tracking-wider text-gold-light/70 mb-1">
                  {chosen === pair[1] ? 'Kept' : 'Discarded'}
                </span>
                <span className="text-5xl font-cinzel font-black text-gold-light">{pair[1]}</span>
              </div>
            </div>
          )}

          {/* Main Result */}
          <div className="text-center">
            <div
              className={cn(
                'text-8xl md:text-9xl font-cinzel font-black text-gold mb-4 transition-all',
                isRolling && 'animate-dice'
              )}
            >
              {displayResult !== null ? displayResult : '?'}
            </div>

            {latestRoll && displayResult === latestRoll.total && !isRolling && (
              <div className="space-y-2">
                <Badge className="bg-forest-deep text-parchment px-4 py-1 text-sm">
                  {resultLabel(latestRoll)}
                </Badge>
                {latestRoll.detailLabel && (
                  <p className="text-forest-light text-sm font-mono">{latestRoll.detailLabel}</p>
                )}
              </div>
            )}

            {!displayResult && !isRolling && (
              <p className="text-forest-light/50 text-lg">Select dice and roll</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dice Selector */}
      <div>
        <label className="text-sm font-medium text-forest-deep dark:text-parchment mb-3 block">
          Select Dice
        </label>
        <div className="grid grid-cols-7 gap-2">
          {DICE_TYPES.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDice(d)}
              className={cn(
                'flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all font-cinzel font-bold',
                selectedDice === d
                  ? 'border-gold bg-gradient-to-br shadow-lg scale-105 ' + DICE_COLORS[d]
                  : 'border-forest-deep/20 dark:border-forest-mid/30 hover:border-forest-mid/50 bg-white dark:bg-midnight/60'
              )}
            >
              <span className={cn(
                'text-xl leading-none',
                selectedDice === d ? 'text-white' : 'text-forest-deep dark:text-parchment'
              )}>
                {DICE_ICONS[d]}
              </span>
              <span className={cn(
                'mt-1 text-[10px]',
                selectedDice === d ? 'text-white/90' : 'text-forest-light'
              )}>
                D{d}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        {/* Count */}
        <Card>
          <CardContent className="p-4">
            <Label className="text-xs text-forest-light mb-2 block uppercase tracking-wider">Count</Label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCount((c) => Math.max(1, c - 1))}
                className="w-10 h-10 rounded-lg border-2 border-forest-deep/20 flex items-center justify-center text-xl font-bold hover:bg-forest-deep/5 transition-colors"
              >
                -
              </button>
              <span className="font-mono font-bold text-2xl flex-1 text-center text-forest-deep dark:text-parchment">
                {count}
              </span>
              <button
                onClick={() => setCount((c) => Math.min(20, c + 1))}
                className="w-10 h-10 rounded-lg border-2 border-forest-deep/20 flex items-center justify-center text-xl font-bold hover:bg-forest-deep/5 transition-colors"
              >
                +
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Modifier */}
        <Card>
          <CardContent className="p-4">
            <Label className="text-xs text-forest-light mb-2 block uppercase tracking-wider">Modifier</Label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setModifier((m) => m - 1)}
                className="w-10 h-10 rounded-lg border-2 border-forest-deep/20 flex items-center justify-center text-xl font-bold hover:bg-forest-deep/5 transition-colors"
              >
                -
              </button>
              <span
                className={cn(
                  'font-mono font-bold text-2xl flex-1 text-center',
                  modifier > 0
                    ? 'text-green-600 dark:text-green-400'
                    : modifier < 0
                      ? 'text-crimson'
                      : 'text-forest-deep dark:text-parchment'
                )}
              >
                {modifier > 0 ? `+${modifier}` : modifier}
              </span>
              <button
                onClick={() => setModifier((m) => m + 1)}
                className="w-10 h-10 rounded-lg border-2 border-forest-deep/20 flex items-center justify-center text-xl font-bold hover:bg-forest-deep/5 transition-colors"
              >
                +
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advantage / Disadvantage */}
      {selectedDice === 20 && count === 1 && (
        <Card className="bg-gradient-to-r from-forest-deep/5 to-crimson/5 border-forest-deep/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch id="adv" checked={advantage} onCheckedChange={toggleAdvantage} />
                  <Label htmlFor="adv" className="text-sm cursor-pointer flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-gold" />
                    Advantage
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="dis" checked={disadvantage} onCheckedChange={toggleDisadvantage} />
                  <Label htmlFor="dis" className="text-sm cursor-pointer flex items-center gap-1">
                    <Skull className="h-4 w-4 text-crimson" />
                    Disadvantage
                  </Label>
                </div>
              </div>
              {(advantage || disadvantage) && (
                <Button variant="ghost" size="sm" onClick={() => { setAdvantage(false); setDisadvantage(false) }}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Roll Button */}
      <Button
        className="w-full h-16 text-xl font-cinzel bg-gradient-to-r from-gold to-amber-500 text-midnight hover:from-gold-light hover:to-amber-400 shadow-lg shadow-gold/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        onClick={handleRoll}
        disabled={isRolling}
      >
        <Dices className="h-6 w-6 mr-2" />
        {isRolling
          ? 'Rolling...'
          : `Roll ${count}D${selectedDice}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : `${modifier}`) : ''}`}
      </Button>

      {/* Roll Log */}
      {rollLog.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-cinzel font-bold text-forest-deep dark:text-parchment flex items-center gap-2">
                <History className="h-5 w-5 text-gold" />
                Roll History
              </h2>
              <Button size="sm" variant="ghost" onClick={clearLog} className="text-crimson hover:text-crimson hover:bg-crimson/10">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {rollLog.map((raw) => {
                const r = enrichDiceRoll(raw)
                const isNat20 = r.dice === 20 && (r.chosenD20 ?? r.rolls[0]) === 20
                const isNat1 = r.dice === 20 && (r.chosenD20 ?? r.rolls[0]) === 1
                
                return (
                  <div
                    key={r.id}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl border transition-colors",
                      isNat20 
                        ? "bg-gold/10 border-gold/50" 
                        : isNat1 
                          ? "bg-crimson/10 border-crimson/50"
                          : "bg-forest-deep/5 border-forest-deep/10 dark:border-forest-mid/20"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-mono font-medium text-forest-deep dark:text-parchment">
                        {resultLabel(r)}
                      </span>
                      {r.detailLabel && (
                        <span className="text-xs text-forest-light font-mono">{r.detailLabel}</span>
                      )}
                      <span className="text-[10px] text-forest-light/60">
                        {r.rolledBy} · {formatDate(r.timestamp)}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'font-cinzel font-black text-2xl',
                        isNat20 ? 'text-gold' : isNat1 ? 'text-crimson' : 'text-forest-deep dark:text-parchment'
                      )}
                    >
                      {r.total}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
