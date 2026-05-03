import { FileText, Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/appStore'
import { useCampaignStore } from '@/store/campaignStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export function MyNotesPage() {
  const { personalNotes, setPersonalNote } = useAppStore()
  const { campaigns, activeCampaignId } = useCampaignStore()

  const campaign = campaigns.find((c) => c.id === activeCampaignId)
  const campaignId = campaign?.id ?? '__global__'
  const [draft, setDraft] = useState(personalNotes[campaignId] ?? '')

  useEffect(() => {
    setDraft(personalNotes[campaignId] ?? '')
  }, [campaignId, personalNotes])

  const handleSave = () => {
    setPersonalNote(campaignId, draft)
    toast.success('Catatan disimpan')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-forest-mid" />
        <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light">
          Catatan Pribadi
        </h1>
        {campaign && (
          <Badge variant="outline" className="ml-auto text-xs border-forest-mid/40 text-forest-mid dark:text-parchment/60">
            {campaign.name}
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-forest-deep dark:text-parchment/80">
            {campaign ? `Catatan — ${campaign.name}` : 'Catatan Umum'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Tulis catatan pribadimu di sini... Hanya kamu yang bisa melihatnya."
            className="w-full min-h-[320px] resize-y rounded-md border border-forest-deep/15 dark:border-parchment/10 bg-white dark:bg-forest-deep/20 px-3 py-2 text-sm text-forest-deep dark:text-parchment placeholder:text-forest-light/40 dark:placeholder:text-parchment/30 focus:outline-none focus:ring-2 focus:ring-forest-mid/40"
          />
          <Button onClick={handleSave} className="w-full" variant="default">
            <Save className="h-4 w-4" />
            Simpan Catatan
          </Button>
        </CardContent>
      </Card>

      {campaigns.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Kampanye Lain</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {campaigns
              .filter((c) => c.id !== campaignId)
              .map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-forest-deep dark:text-parchment">{c.name}</span>
                  <span className="text-forest-light dark:text-parchment/40 text-xs">
                    {personalNotes[c.id]
                      ? `${personalNotes[c.id].length} karakter`
                      : 'Kosong'}
                  </span>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
