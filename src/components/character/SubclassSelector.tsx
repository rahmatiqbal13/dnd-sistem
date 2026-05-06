import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Check, Sword, Sparkles, AlertCircle } from 'lucide-react'
import type { Subclass2024 } from '@/data/dnd2024/subclasses'
import { cn } from '@/lib/utils'

interface SubclassSelectorProps {
  subclasses: Subclass2024[]
  selectedId?: string
  onSelect: (subclass: Subclass2024 | null) => void
}

export function SubclassSelector({ subclasses, selectedId, onSelect }: SubclassSelectorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const handleSelect = (subclass: Subclass2024) => {
    if (selectedId === subclass.id) {
      onSelect(null)
    } else {
      onSelect(subclass)
    }
  }
  
  if (subclasses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-forest-light" />
          <p className="text-forest-light">No subclasses available</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-3">
        {subclasses.map(subclass => {
          const isSelected = selectedId === subclass.id
          const isExpanded = expandedId === subclass.id
          
          return (
            <Card
              key={subclass.id}
              className={cn(
                'transition-all',
                isSelected 
                  ? 'border-gold bg-gold/10' 
                  : 'hover:border-forest-mid/50'
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleSelect(subclass)}
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                      isSelected
                        ? 'bg-gold border-gold'
                        : 'border-forest-deep/30 hover:border-forest-mid'
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 text-midnight" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{subclass.name}</h4>
                      {subclass.spellcasting && (
                        <Badge variant="outline" className="text-[10px] bg-purple-100 text-purple-700 border-purple-300">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Spellcasting
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-forest-light mt-1">
                      {subclass.description}
                    </p>
                    
                    {/* Features Preview */}
                    <div className="mt-3">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : subclass.id)}
                        className="text-xs text-gold hover:underline"
                      >
                        {isExpanded ? 'Hide' : 'Show'} Features ({subclass.features.length})
                      </button>
                      
                      {isExpanded && (
                        <div className="mt-2 space-y-2">
                          {subclass.features.map((feature, i) => (
                            <div 
                              key={i} 
                              className="text-sm p-2 bg-forest-deep/5 rounded"
                            >
                              <div className="flex items-center gap-2">
                                <Sword className="h-3 w-3 text-gold" />
                                <span className="font-medium">{feature.name}</span>
                                <Badge variant="outline" className="text-[10px]">
                                  Lv {feature.level}
                                </Badge>
                              </div>
                              <p className="text-xs text-forest-light mt-1">
                                {feature.description}
                              </p>
                              {feature.uses && (
                                <p className="text-[10px] text-forest-light mt-1">
                                  Uses: {feature.uses} / {feature.restType} rest
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </ScrollArea>
  )
}
