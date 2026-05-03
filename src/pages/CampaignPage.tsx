import { useState } from 'react'
import { Plus, Copy, UserMinus, Users, Map, BookOpen, CheckCircle, Skull, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCampaignStore } from '@/store/campaignStore'
import { useAppStore } from '@/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials, avatarColor, formatDate } from '@/lib/utils'

const createSchema = z.object({
  name: z.string().min(2, 'Min 2 karakter').max(50),
  description: z.string().optional(),
})

const joinSchema = z.object({
  inviteCode: z.string().min(6, 'Kode invite 6 karakter').max(6),
})

export function CampaignPage() {
  const { nickname, role } = useAppStore()
  const { campaigns, activeCampaignId, createCampaign, joinCampaign, setActiveCampaign, kickMember, updateSessionNotes, leaveCampaign, addNpc, removeNpc } = useCampaignStore()
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [npcForm, setNpcForm] = useState({ name: '', role: '', notes: '' })
  const [showAddNpc, setShowAddNpc] = useState(false)

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId)
  const isDM = role === 'dm'

  const createForm = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: { name: '', description: '' },
  })

  const joinForm = useForm({
    resolver: zodResolver(joinSchema),
    defaultValues: { inviteCode: '' },
  })

  const handleCreate = createForm.handleSubmit((data) => {
    if (!nickname) return
    const campaign = createCampaign(data.name, data.description ?? '', nickname)
    toast.success(`Kampanye "${campaign.name}" dibuat! Kode: ${campaign.inviteCode}`)
    createForm.reset()
  })

  const handleJoin = joinForm.handleSubmit((data) => {
    if (!nickname || !role) return
    const campaign = joinCampaign(data.inviteCode, nickname, role)
    if (!campaign) {
      toast.error('Kode invite tidak valid atau kampanye tidak aktif')
      return
    }
    toast.success(`Bergabung ke "${campaign.name}"!`)
    joinForm.reset()
  })

  const handleKick = (campaignId: string, memberNickname: string) => {
    if (!confirm(`Kick ${memberNickname} dari kampanye?`)) return
    kickMember(campaignId, memberNickname)
    toast.success(`${memberNickname} di-kick`)
  }

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => toast.success('Kode invite disalin!'))
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light">
        Kampanye
      </h1>

      {/* Active Campaign Details */}
      {activeCampaign && (
        <Card className="border-forest-mid/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Map className="h-4 w-4 text-gold" />
                {activeCampaign.name}
              </CardTitle>
              <Badge variant="default" className="text-[10px]">Aktif</Badge>
            </div>
            {activeCampaign.description && (
              <p className="text-xs text-forest-light dark:text-parchment/50 mt-1 font-crimson italic">
                {activeCampaign.description}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                <TabsTrigger value="members" className="text-xs">Anggota</TabsTrigger>
                <TabsTrigger value="npcs" className="text-xs gap-1">
                  NPC
                  {isDM && <span className="text-[8px] font-bold text-gold bg-gold/20 px-1 rounded leading-none py-0.5">DM</span>}
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-xs gap-1">
                  Sesi
                  <span className="text-[8px] font-bold text-gold bg-gold/20 px-1 rounded leading-none py-0.5">DM</span>
                </TabsTrigger>
              </TabsList>

              {/* OVERVIEW */}
              <TabsContent value="overview" className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-forest-deep/5 dark:bg-forest-mid/10">
                  <div>
                    <p className="text-xs text-forest-light dark:text-parchment/50">Kode Invite</p>
                    <p className="font-mono font-black text-xl text-forest-deep dark:text-gold-light tracking-widest">
                      {activeCampaign.inviteCode}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyInviteCode(activeCampaign.inviteCode)}>
                    <Copy className="h-3.5 w-3.5" />
                    Salin
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] text-forest-light/60 dark:text-parchment/30 uppercase">DM</p>
                    <p className="font-medium text-forest-deep dark:text-parchment">{activeCampaign.dmNickname}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-forest-light/60 dark:text-parchment/30 uppercase">Anggota</p>
                    <p className="font-medium text-forest-deep dark:text-parchment">{activeCampaign.members.length} orang</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-forest-light/60 dark:text-parchment/30 uppercase">Dibuat</p>
                    <p className="font-medium text-forest-deep dark:text-parchment text-xs">{formatDate(activeCampaign.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  {nickname !== activeCampaign.dmNickname && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        if (!confirm('Keluar dari kampanye?')) return
                        leaveCampaign(activeCampaign.id, nickname!)
                        toast.success('Keluar dari kampanye')
                      }}
                    >
                      Keluar Kampanye
                    </Button>
                  )}
                  {campaigns.filter((c) => c.id !== activeCampaignId).length > 0 && (
                    <Button size="sm" variant="ghost" onClick={() => setActiveCampaign(null)}>
                      Ganti Kampanye
                    </Button>
                  )}
                </div>
              </TabsContent>

              {/* MEMBERS */}
              <TabsContent value="members">
                <div className="space-y-2">
                  {activeCampaign.members.map((member) => (
                    <div key={member.nickname} className="flex items-center justify-between p-2 rounded-lg hover:bg-forest-deep/5 dark:hover:bg-forest-mid/10">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`${avatarColor(member.nickname)} text-[10px]`}>
                            {getInitials(member.nickname)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-forest-deep dark:text-parchment">{member.nickname}</p>
                          <Badge variant={member.role === 'dm' ? 'dm' : 'player'} className="text-[9px] px-1 py-0 h-auto">
                            {member.role === 'dm' ? 'DM' : 'Player'}
                          </Badge>
                        </div>
                      </div>
                      {isDM && member.nickname !== nickname && member.nickname !== activeCampaign.dmNickname && (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="text-crimson/50 hover:text-crimson hover:bg-crimson/10"
                          onClick={() => handleKick(activeCampaign.id, member.nickname)}
                        >
                          <UserMinus className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* NPC TAB */}
              <TabsContent value="npcs">
                {isDM ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-forest-light dark:text-parchment/50">
                        {(activeCampaign.npcs ?? []).length} NPC/karakter penting
                      </p>
                      <Button size="sm" variant="outline" className="border-gold/40 h-7 text-xs" onClick={() => setShowAddNpc(!showAddNpc)}>
                        <Plus className="h-3 w-3" /> Tambah NPC
                      </Button>
                    </div>

                    {showAddNpc && (
                      <Card className="border-gold/30">
                        <CardContent className="p-3 space-y-2">
                          <p className="font-cinzel text-xs font-semibold text-forest-deep dark:text-parchment">NPC Baru</p>
                          <div>
                            <Label className="text-xs">Nama</Label>
                            <Input
                              placeholder="Nama NPC..."
                              value={npcForm.name}
                              onChange={(e) => setNpcForm((f) => ({ ...f, name: e.target.value }))}
                              className="mt-1 h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Peran / Jabatan</Label>
                            <Input
                              placeholder="Villain, Ally, Merchant, Quest Giver..."
                              value={npcForm.role}
                              onChange={(e) => setNpcForm((f) => ({ ...f, role: e.target.value }))}
                              className="mt-1 h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Catatan DM</Label>
                            <Textarea
                              placeholder="Motivasi, secrets, lokasi..."
                              value={npcForm.notes}
                              onChange={(e) => setNpcForm((f) => ({ ...f, notes: e.target.value }))}
                              className="mt-1 text-xs min-h-[60px]"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                if (!npcForm.name.trim()) { toast.error('Nama NPC wajib diisi'); return }
                                addNpc(activeCampaign.id, {
                                  id: crypto.randomUUID(),
                                  name: npcForm.name.trim(),
                                  role: npcForm.role.trim(),
                                  notes: npcForm.notes.trim(),
                                })
                                toast.success(`${npcForm.name} ditambahkan`)
                                setNpcForm({ name: '', role: '', notes: '' })
                                setShowAddNpc(false)
                              }}
                            >Simpan</Button>
                            <Button size="sm" variant="ghost" onClick={() => setShowAddNpc(false)}>Batal</Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {(activeCampaign.npcs ?? []).length === 0 ? (
                      <div className="text-center py-8">
                        <Skull className="h-8 w-8 text-forest-light/30 mx-auto mb-2" />
                        <p className="text-sm text-forest-light dark:text-parchment/40">Belum ada NPC.</p>
                        <p className="text-xs text-forest-light/50 dark:text-parchment/30 mt-1">
                          Tambah karakter penting kampanye di sini.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {(activeCampaign.npcs ?? []).map((npc) => (
                          <div key={npc.id} className="flex items-start gap-3 p-3 rounded-lg border border-forest-deep/10 dark:border-forest-mid/15 bg-white dark:bg-midnight/60">
                            <div className="flex-1 min-w-0">
                              <p className="font-cinzel text-sm font-semibold text-forest-deep dark:text-parchment">{npc.name}</p>
                              {npc.role && <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-auto mt-0.5">{npc.role}</Badge>}
                              {npc.notes && (
                                <p className="text-xs text-forest-light dark:text-parchment/50 mt-1 font-crimson italic line-clamp-2">
                                  {npc.notes}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => { removeNpc(activeCampaign.id, npc.id); toast.success(`${npc.name} dihapus`) }}
                              className="text-crimson/40 hover:text-crimson p-1 flex-shrink-0 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Skull className="h-8 w-8 text-forest-light/30 mx-auto mb-2" />
                    <p className="text-sm text-forest-light dark:text-parchment/40">
                      Daftar NPC hanya bisa dikelola DM
                    </p>
                    <p className="text-xs text-forest-light/50 dark:text-parchment/30 mt-1">
                      Tanya DM untuk informasi NPC penting
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* SESSION NOTES (DM only) */}
              <TabsContent value="notes">
                {isDM ? (
                  <>
                    <Textarea
                      value={activeCampaign.sessionNotes}
                      onChange={(e) => updateSessionNotes(activeCampaign.id, e.target.value)}
                      placeholder="Catatan DM untuk sesi ini — recap, plot hooks, NPC notes..."
                      className="min-h-[200px] font-crimson text-base"
                    />
                    <p className="text-[10px] text-forest-light/50 dark:text-parchment/30 text-center mt-2">
                      Hanya DM yang dapat melihat catatan ini
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-8 w-8 text-forest-light/30 mx-auto mb-2" />
                    <p className="text-sm text-forest-light dark:text-parchment/40">
                      Catatan sesi hanya bisa dilihat DM
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Other Campaigns */}
      {campaigns.filter((c) => c.id !== activeCampaignId).length > 0 && (
        <div>
          <h2 className="font-cinzel text-sm font-semibold text-forest-deep dark:text-parchment uppercase tracking-wider mb-2">
            Kampanye Lain
          </h2>
          <div className="space-y-2">
            {campaigns.filter((c) => c.id !== activeCampaignId).map((c) => (
              <Card key={c.id} className="cursor-pointer hover:border-forest-mid/40 transition-colors" onClick={() => setActiveCampaign(c.id)}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-cinzel text-sm font-semibold text-forest-deep dark:text-parchment">{c.name}</p>
                    <p className="text-xs text-forest-light dark:text-parchment/50">{c.members.length} anggota</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-forest-light/40" />
                    <span className="text-xs text-forest-light dark:text-parchment/40">Set Aktif</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Create / Join */}
      <div className="grid grid-cols-1 gap-4">
        {isDM && (
          <Card className="border-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Plus className="h-4 w-4 text-gold" />
                Buat Kampanye Baru
                <span className="text-[8px] font-cinzel font-bold text-gold bg-gold/15 border border-gold/40 px-1.5 py-0.5 rounded ml-auto">DM ONLY</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <Label className="text-xs">Nama Kampanye</Label>
                  <Input placeholder="Lost Mines of Phandelver..." {...createForm.register('name')} className="mt-1" />
                  {createForm.formState.errors.name && (
                    <p className="text-crimson text-xs mt-1">{createForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-xs">Deskripsi (Opsional)</Label>
                  <Input placeholder="Setting, tone, premise..." {...createForm.register('description')} className="mt-1" />
                </div>
                <Button type="submit" size="sm" className="w-full">
                  🗺️ Buat Kampanye
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-forest-mid" />
              Bergabung dengan Kode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-3">
              <div>
                <Label className="text-xs">Kode Invite (6 huruf)</Label>
                <Input
                  placeholder="ABCDEF"
                  maxLength={6}
                  className="mt-1 uppercase font-mono tracking-widest text-center text-lg"
                  {...joinForm.register('inviteCode')}
                  onChange={(e) => joinForm.setValue('inviteCode', e.target.value.toUpperCase())}
                />
                {joinForm.formState.errors.inviteCode && (
                  <p className="text-crimson text-xs mt-1">{joinForm.formState.errors.inviteCode.message}</p>
                )}
              </div>
              <Button type="submit" size="sm" variant="outline" className="w-full">
                🛡️ Bergabung
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
