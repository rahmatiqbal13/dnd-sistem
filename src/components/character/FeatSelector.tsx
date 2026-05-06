import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Check, AlertCircle, Sparkles } from 'lucide-react'
import type { Feat2024 } from '@/data/dnd2024/feats'
import { cn } from '@/lib/utils'

interface FeatSelectorProps {
  feats: Feat2024[]
  selectedId?: string
  onSelect: (feat: Feat2024 | null) => void
}

export function FeatSelector({ feats, selectedId, onSelect }: FeatSelectorProps) {
  const [search, setSearch] = useState('')
  const [selectedFeat, setSelectedFeat] = useState<Feat2024 | null>(null)
  
  const filteredFeats = useMemo(() => {
    if (!search) return feats
    const q = search.toLowerCase()
    return feats.filter(feat => 
      feat.name.toLowerCase().includes(q) ||
      feat.description.toLowerCase().includes(q)
    )
  }, [feats, search])
  
  const handleSelect = (feat: Feat2024) => {
    if (selectedId === feat.id) {
      onSelect(null)
    } else {
      onSelect(feat)
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-light" />
        <Input
          placeholder="Search feats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {filteredFeats.length === 0 ? (
            <div className="text-center py-8 text-forest-light">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No feats found</p>
            </div>
          ) : (
            filteredFeats.map(feat => (
              <Card
                key={feat.id}
                className={cn(
                  'cursor-pointer transition-all',
                  selectedId === feat.id 
                    ? 'border-gold bg-gold/10' 
                    : 'hover:border-forest-mid/50'
                )}
                onClick={() => handleSelect(feat)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                      selectedId === feat.id
                        ? 'bg-gold border-gold'
                        : 'border-forest-deep/30'
                    )}>
                      {selectedId === feat.id && <Check className="h-3 w-3 text-midnight" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm">{feat.name}</h4>
                        <Badge variant="outline" className="text-[10px]">
                          {feat.category}
                        </Badge>
                        {feat.asi && feat.asi.length > 0 && (
                          <Badge variant="outline" className="text-[10px] bg-gold/20 text-gold border-gold/50">
                            <Sparkles className="h-3 w-3 mr-1" />
                            +ASI
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-forest-light mt-1 line-clamp-2">
                        {feat.description}
                      </p>
                      
                      {feat.prerequisite && (
                        <p className="text-[10px] text-crimson mt-1">
                          Prerequisite: {feat.prerequisite}
                        </p>
                      )}
                      
                      {feat.asi && feat.asi.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {feat.asi.map((asi, i) => (
                            <Badge key={i} variant="outline" className="text-[10px]">
                              {asi.ability.toUpperCase()} +{asi.bonus}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
      
      {selectedId && (
        <Button 
          variant="outline" 
          onClick={() => onSelect(null)}
          className="w-full"
        >
          Clear Selection
        </Button>
      )}
    </div>
  )
}
