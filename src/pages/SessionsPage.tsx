import { CalendarDays, Plus, Trash2, ChevronDown, ChevronUp, Star } from 'lucide-react'
import { useState } from 'react'
import { useCampaignStore } from '@/store/campaignStore'
import { useAppStore } from '@/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import type { CampaignSession } from '@/types'

const emptyForm = { title: '', date: '', summary: '', xpAwarded: '' }

export function SessionsPage() {
  const { role } = useAppStore()
  const { campaigns, activeCampaignId, addSession, removeSession } = useCampaignStore()
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const campaign = campaigns.find((c) => c.id === activeCampaignId)
  const sessions = [...(campaign?.sessions ?? [])].sort((a, b) => b.createdAt - a.createdAt)

  const handleAdd = () => {
    if (!campaign) { toast.error('Pilih kampanye terlebih dahulu'); return }
    if (!form.title.trim()) { toast.error('Judul sesi wajib diisi'); return }
    const session: CampaignSession = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      date: form.date || new Date().toISOString().slice(0, 10),
      summary: form.summary.trim(),
      xpAwarded: parseInt(form.xpAwarded) || 0,
      createdAt: Date.now(),
    }
    addSession(campaign.id, session)
    toast.success(`Sesi "${session.title}" ditambahkan`)
    setForm(emptyForm)
    setShowForm(false)
  }

  const isDm = role === 'dm'

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-3">
        <CalendarDays className="h-6 w-6 text-forest-mid" />
        <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light">
          Log Sesi
        </h1>
        {campaign && (
          <Badge variant="outline" className="ml-auto text-xs border-forest-mid/40 text-forest-mid dark:text-parchment/60">
            {campaign.name}
          </Badge>
        )}
      </div>

      {!campaign ? (
        <div className="text-center py-16">
          <CalendarDays className="h-12 w-12 text-forest-deep/20 dark:text-parchment/20 mx-auto mb-2" />
          <p className="text-forest-light dark:text-parchment/40 text-sm">
            Belum ada kampanye aktif
          </p>
        </div>
      ) : (
        <>
          {isDm && (
            <div>
              {showForm ? (
                <Card className="border-gold/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span className="text-[9px] font-cinzel font-bold text-gold bg-gold/15 border border-gold/40 px-1.5 py-0.5 rounded">
                        DM ONLY
                      </span>
                      Tambah Sesi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-forest-deep dark:text-parchment/80 mb-1 block">
                        Judul Sesi *
                      </label>
                      <input
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Sesi 1: Pertemuan di Tavern"
                        className="w-full rounded-md border border-forest-deep/15 dark:border-parchment/10 bg-white dark:bg-forest-deep/20 px-3 py-2 text-sm text-forest-deep dark:text-parchment placeholder:text-forest-light/40 focus:outline-none focus:ring-2 focus:ring-forest-mid/40"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-forest-deep dark:text-parchment/80 mb-1 block">
                          Tanggal
                        </label>
                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="w-full rounded-md border border-forest-deep/15 dark:border-parchment/10 bg-white dark:bg-forest-deep/20 px-3 py-2 text-sm text-forest-deep dark:text-parchment focus:outline-none focus:ring-2 focus:ring-forest-mid/40"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-forest-deep dark:text-parchment/80 mb-1 block">
                          XP Diberikan
                        </label>
                        <input
                          type="number"
                          value={form.xpAwarded}
                          onChange={(e) => setForm({ ...form, xpAwarded: e.target.value })}
                          placeholder="0"
                          min="0"
                          className="w-full rounded-md border border-forest-deep/15 dark:border-parchment/10 bg-white dark:bg-forest-deep/20 px-3 py-2 text-sm text-forest-deep dark:text-parchment placeholder:text-forest-light/40 focus:outline-none focus:ring-2 focus:ring-forest-mid/40"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-forest-deep dark:text-parchment/80 mb-1 block">
                        Ringkasan
                      </label>
                      <textarea
                        value={form.summary}
                        onChange={(e) => setForm({ ...form, summary: e.target.value })}
                        placeholder="Apa yang terjadi di sesi ini..."
                        rows={3}
                        className="w-full rounded-md border border-forest-deep/15 dark:border-parchment/10 bg-white dark:bg-forest-deep/20 px-3 py-2 text-sm text-forest-deep dark:text-parchment placeholder:text-forest-light/40 resize-none focus:outline-none focus:ring-2 focus:ring-forest-mid/40"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAdd} size="sm" className="flex-1">
                        Simpan Sesi
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setShowForm(false); setForm(emptyForm) }}
                      >
                        Batal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Button onClick={() => setShowForm(true)} variant="outline" className="w-full border-dashed border-forest-deep/20 text-forest-deep dark:text-parchment hover:border-gold/50">
                  <Plus className="h-4 w-4" />
                  Tambah Sesi Baru
                </Button>
              )}
            </div>
          )}

          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="h-10 w-10 text-forest-deep/20 dark:text-parchment/20 mx-auto mb-2" />
              <p className="text-forest-light dark:text-parchment/40 text-sm">
                Belum ada sesi dicatat
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session, i) => (
                <Card key={session.id} className="overflow-hidden">
                  <button
                    onClick={() => setExpanded(expanded === session.id ? null : session.id)}
                    className="w-full text-left"
                  >
                    <CardHeader className="pb-2 pt-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-cinzel text-gold font-bold shrink-0">
                          S{sessions.length - i}
                        </span>
                        <p className="font-semibold text-sm text-forest-deep dark:text-parchment flex-1">
                          {session.title}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          {session.xpAwarded > 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] text-gold">
                              <Star className="h-3 w-3" />
                              {session.xpAwarded} XP
                            </span>
                          )}
                          <span className="text-xs text-forest-light dark:text-parchment/40">
                            {session.date}
                          </span>
                          {expanded === session.id ? (
                            <ChevronUp className="h-4 w-4 text-forest-light dark:text-parchment/40" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-forest-light dark:text-parchment/40" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </button>

                  {expanded === session.id && (
                    <>
                      <Separator />
                      <CardContent className="px-4 py-3 space-y-3">
                        {session.summary ? (
                          <p className="text-sm text-forest-deep dark:text-parchment/80 whitespace-pre-wrap">
                            {session.summary}
                          </p>
                        ) : (
                          <p className="text-sm text-forest-light dark:text-parchment/30 italic">
                            Tidak ada ringkasan
                          </p>
                        )}
                        {isDm && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-crimson hover:text-crimson hover:bg-crimson/10 h-7 px-2"
                            onClick={() => {
                              removeSession(campaign.id, session.id)
                              toast.success('Sesi dihapus')
                              setExpanded(null)
                            }}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Hapus Sesi
                          </Button>
                        )}
                      </CardContent>
                    </>
                  )}
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
