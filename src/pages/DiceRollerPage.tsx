import { useState, useRef } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useDiceStore } from '@/store/diceStore'
import { useAppStore } from '@/store/appStore'
import { rollDice, DICE_TYPES, resultLabel } from '@/lib/dice'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn, formatDate } from '@/lib/utils'
import type { DiceType } from '@/types'

const DICE_ICONS: Record<DiceType, string> = {
  4: '△', 6: '□', 8: '◇', 10: '⬟', 12: '⬠', 20: '⬡', 100: '%',
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

  const handleRoll = () => {
    if (isRolling) return
    const result = rollDice(count, selectedDice, modifier, advantage, disadvantage, nickname ?? 'Adventurer')
    addRoll(result)

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
          if (result.total === 20 && selectedDice === 20) toast.success('🎉 NATURAL 20!')
          else if (result.total === 1 && selectedDice === 20) toast.error('💀 CRITICAL FAIL!')
        }
      }, 50)
    } else {
      setDisplayResult(result.total)
      if (result.total === 20 && selectedDice === 20) toast.success('🎉 NATURAL 20!')
      else if (result.total === 1 && selectedDice === 20) toast.error('💀 CRITICAL FAIL!')
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

  const latestRoll = rollLog[0]

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light mb-5">
        Dice Roller
      </h1>

      {/* Dice Result Display */}
      <div className="flex flex-col items-center py-8 mb-5 rounded-xl bg-forest-deep dark:bg-midnight/80 border border-forest-mid/30">
        <div
          className={cn(
            'text-7xl font-cinzel font-black text-gold-light mb-2 transition-all',
            isRolling && 'animate-dice opacity-80'
          )}
        >
          {displayResult !== null ? displayResult : '?'}
        </div>
        {latestRoll && displayResult === latestRoll.total && !isRolling && (
          <div className="text-parchment/60 text-sm font-mono text-center px-4">
            <p>{resultLabel(latestRoll)}</p>
            {latestRoll.count > 1 && (
              <p className="text-parchment/40 text-xs mt-1">
                [{latestRoll.rolls.join(', ')}] {modifier !== 0 ? `+ ${modifier}` : ''}
              </p>
            )}
          </div>
        )}
        {!displayResult && (
          <p className="text-parchment/40 text-sm">Pilih dadu dan tekan Roll</p>
        )}
      </div>

      {/* Dice Selector */}
      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {DICE_TYPES.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDice(d)}
            className={cn(
              'flex flex-col items-center justify-center py-2 rounded-lg border-2 transition-all font-cinzel font-bold text-xs min-h-[52px]',
              selectedDice === d
                ? 'border-gold bg-gold/20 text-gold dark:bg-gold/30 dark:text-gold-light'
                : 'border-forest-deep/15 dark:border-forest-mid/20 text-forest-deep dark:text-parchment/70 hover:border-forest-mid/40'
            )}
          >
            <span className="text-lg leading-none">{DICE_ICONS[d]}</span>
            <span className="mt-0.5 text-[9px]">D{d}</span>
          </button>
        ))}
      </div>

      {/* Count & Modifier */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <Label className="text-xs mb-1 block">Jumlah Dadu</Label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              className="h-9 w-9 rounded-md border border-forest-deep/20 flex items-center justify-center text-forest-deep dark:text-parchment hover:bg-forest-deep/5 font-bold"
            >-</button>
            <span className="font-mono font-bold text-forest-deep dark:text-parchment flex-1 text-center text-lg">{count}</span>
            <button
              onClick={() => setCount((c) => Math.min(20, c + 1))}
              className="h-9 w-9 rounded-md border border-forest-deep/20 flex items-center justify-center text-forest-deep dark:text-parchment hover:bg-forest-deep/5 font-bold"
            >+</button>
          </div>
        </div>
        <div>
          <Label className="text-xs mb-1 block">Modifier</Label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModifier((m) => m - 1)}
              className="h-9 w-9 rounded-md border border-forest-deep/20 flex items-center justify-center text-forest-deep dark:text-parchment hover:bg-forest-deep/5 font-bold"
            >-</button>
            <span className={cn('font-mono font-bold flex-1 text-center text-lg', modifier > 0 ? 'text-forest-mid dark:text-gold-light' : modifier < 0 ? 'text-crimson' : 'text-forest-deep dark:text-parchment')}>
              {modifier > 0 ? `+${modifier}` : modifier}
            </span>
            <button
              onClick={() => setModifier((m) => m + 1)}
              className="h-9 w-9 rounded-md border border-forest-deep/20 flex items-center justify-center text-forest-deep dark:text-parchment hover:bg-forest-deep/5 font-bold"
            >+</button>
          </div>
        </div>
      </div>

      {/* Advantage / Disadvantage (D20 only) */}
      {selectedDice === 20 && count === 1 && (
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Switch id="adv" checked={advantage} onCheckedChange={toggleAdvantage} />
            <Label htmlFor="adv" className="text-sm cursor-pointer text-forest-mid dark:text-gold-light">Advantage</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="dis" checked={disadvantage} onCheckedChange={toggleDisadvantage} />
            <Label htmlFor="dis" className="text-sm cursor-pointer text-crimson">Disadvantage</Label>
          </div>
        </div>
      )}

      {/* Roll Button */}
      <Button
        className="w-full h-14 text-base font-cinzel"
        variant="gold"
        onClick={handleRoll}
        disabled={isRolling}
      >
        {isRolling ? 'Rolling...' : `🎲 Roll ${count}D${selectedDice}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`}
      </Button>

      {/* Roll Log */}
      {rollLog.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-cinzel text-sm font-semibold text-forest-deep dark:text-parchment uppercase tracking-wider">
              Roll Log
            </h2>
            <Button size="sm" variant="ghost" onClick={clearLog} className="text-xs h-7">
              <Trash2 className="h-3 w-3" />
              Hapus
            </Button>
          </div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {rollLog.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-midnight/60 border border-forest-deep/10 dark:border-forest-mid/15"
              >
                <div>
                  <span className="text-xs text-forest-deep dark:text-parchment font-mono font-medium">
                    {resultLabel(r)}
                  </span>
                  <span className="text-[10px] text-forest-light/60 dark:text-parchment/30 ml-2">
                    by {r.rolledBy}
                  </span>
                </div>
                <span className={cn(
                  'font-mono font-black text-base',
                  r.dice === 20 && r.total === 20 ? 'text-gold' :
                  r.dice === 20 && r.total === 1 ? 'text-crimson' :
                  'text-forest-deep dark:text-parchment'
                )}>
                  {r.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
