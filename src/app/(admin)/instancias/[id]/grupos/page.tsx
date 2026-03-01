'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import {
    Search, Users, Zap, Check, CheckSquare, Square, ChevronLeft,
    Megaphone, Clock, Calendar, Send, CalendarClock, RefreshCw, Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Mock data (will come from API) ──────────────────────────────────────────
const INSTANCES: Record<string, { name: string; phone: string }> = {
    'inst-1': { name: 'WhatsApp Principal', phone: '+55 11 99999-1234' },
    'inst-2': { name: 'WhatsApp Secundário', phone: '+55 11 98888-5678' },
}

const INSTANCE_GROUPS: Record<string, { id: string; name: string; members: number; category: string }[]> = {
    'inst-1': [
        { id: 'g1', name: 'Achadinhos VIP 1', members: 254, category: 'Shopee' },
        { id: 'g2', name: 'Achadinhos VIP 2', members: 189, category: 'Shopee' },
        { id: 'g3', name: 'Promoções Gold', members: 342, category: 'Geral' },
        { id: 'g4', name: 'Cupons Exclusivos', members: 512, category: 'Shopee' },
        { id: 'g5', name: 'Afiliados Top BR', members: 98, category: 'Afiliados' },
        { id: 'g6', name: 'Flash Sales', members: 401, category: 'Geral' },
        { id: 'g7', name: 'Mercado Livre VIP', members: 277, category: 'ML' },
        { id: 'g8', name: 'Lista Semanal', members: 130, category: 'Geral' },
    ],
    'inst-2': [
        { id: 'g9', name: 'VIP Master Club', members: 625, category: 'Afiliados' },
        { id: 'g10', name: 'Shopee Deals', members: 310, category: 'Shopee' },
        { id: 'g11', name: 'Amazon Prime Offers', members: 198, category: 'Amazon' },
        { id: 'g12', name: 'Negócios Digitais', members: 88, category: 'Geral' },
    ],
}

const ADS = [
    { id: 'ad-1', title: 'Black Friday Shopee', preview: 'Aproveite os descontos imperdíveis da Black Friday...' },
    { id: 'ad-2', title: 'Promoção Relâmpago ML', preview: 'Oferta relâmpago no Mercado Livre! Hasta 60% de desconto...' },
    { id: 'ad-3', title: 'Cupons Amazon Prime', preview: 'Cupons exclusivos para membros Prime. Economize em eletrônicos...' },
    { id: 'ad-4', title: 'Newsletter Semanal', preview: 'Sua seleção semanal dos melhores achados da internet...' },
]

const CATEGORIES = ['Todos', 'Shopee', 'ML', 'Amazon', 'Afiliados', 'Geral']

// ── Page ───────────────────────────────────────────────────────────────────
export default function InstanciaGruposPage() {
    const params = useParams()
    const instanceId = params.id as string

    const instance = INSTANCES[instanceId]
    const allGroups = INSTANCE_GROUPS[instanceId] ?? []

    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Todos')
    const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set())
    const [sheetOpen, setSheetOpen] = useState(false)

    // Schedule form state
    const [selectedAd, setSelectedAd] = useState('')
    const [scheduleTime, setScheduleTime] = useState('09:00')
    const [repeat, setRepeat] = useState(true)
    const [days, setDays] = useState<string[]>(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])

    const filteredGroups = allGroups.filter((g) => {
        const matchSearch = g.name.toLowerCase().includes(search.toLowerCase())
        const matchCategory = selectedCategory === 'Todos' || g.category === selectedCategory
        return matchSearch && matchCategory
    })

    const allVisible = filteredGroups.length > 0 && filteredGroups.every((g) => selectedGroups.has(g.id))

    const toggleGroup = (id: string) => {
        setSelectedGroups((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const toggleAll = () => {
        if (allVisible) {
            setSelectedGroups((prev) => {
                const next = new Set(prev)
                filteredGroups.forEach((g) => next.delete(g.id))
                return next
            })
        } else {
            setSelectedGroups((prev) => {
                const next = new Set(prev)
                filteredGroups.forEach((g) => next.add(g.id))
                return next
            })
        }
    }

    const toggleDay = (day: string) => {
        setDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        )
    }

    const DAY_LABELS = [
        { key: 'sun', label: 'D' },
        { key: 'mon', label: 'S' },
        { key: 'tue', label: 'T' },
        { key: 'wed', label: 'Q' },
        { key: 'thu', label: 'Q' },
        { key: 'fri', label: 'S' },
        { key: 'sat', label: 'S' },
    ]

    if (!instance) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
                <Zap className="h-12 w-12 opacity-20" />
                <p>Instância não encontrada.</p>
                <Button asChild variant="outline" size="sm">
                    <Link href={"/instancias" as any}>Voltar</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Breadcrumb header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link
                            href={"/instancias" as any}
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            Instâncias
                        </Link>
                        <span className="text-muted-foreground/40 text-xs">/</span>
                        <span className="text-xs text-foreground font-medium">{instance.name}</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Grupos</h1>
                    <p className="text-muted-foreground mt-0.5 text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.5)]" />
                        {instance.name} · {instance.phone}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-2 border-border text-muted-foreground">
                        <RefreshCw className="h-3.5 w-3.5" />
                        Sincronizar
                    </Button>
                    {selectedGroups.size > 0 && (
                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 shadow-lg gap-2"
                            onClick={() => setSheetOpen(true)}
                        >
                            <CalendarClock className="h-4 w-4" />
                            Agendar Envio ({selectedGroups.size})
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats strip */}
            <div className="flex items-center gap-6 px-4 py-3 rounded-xl bg-muted/20 border border-border">
                <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="font-semibold">{allGroups.length}</span>
                    <span className="text-muted-foreground">grupos</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">{selectedGroups.size}</span>
                    <span className="text-muted-foreground">selecionados</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-emerald-400" />
                    <span className="font-semibold">
                        {allGroups
                            .filter((g) => selectedGroups.has(g.id))
                            .reduce((a, g) => a + g.members, 0)
                            .toLocaleString('pt-BR')}
                    </span>
                    <span className="text-muted-foreground">membros alcançados</span>
                </div>
            </div>

            {/* Group selection card */}
            <Card className="border-border">
                <CardHeader className="border-b border-border pb-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[180px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar grupos…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-muted/30 border-border/60 h-9"
                            />
                        </div>

                        {/* Categories */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                                        selectedCategory === cat
                                            ? 'border-primary/40 bg-primary/15 text-primary'
                                            : 'border-border/50 bg-muted/30 text-muted-foreground hover:border-border hover:text-foreground'
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleAll}
                            className="gap-2 border-border text-muted-foreground hover:text-foreground ml-auto shrink-0"
                        >
                            {allVisible
                                ? <CheckSquare className="h-4 w-4 text-primary" />
                                : <Square className="h-4 w-4" />}
                            {allVisible ? 'Desmarcar' : 'Selecionar todos'}
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <ScrollArea className="h-[400px]">
                        {filteredGroups.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                                <Users className="h-10 w-10 opacity-20" />
                                <p className="text-sm">Nenhum grupo encontrado.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {filteredGroups.map((group) => {
                                    const selected = selectedGroups.has(group.id)
                                    return (
                                        <div
                                            key={group.id}
                                            onClick={() => toggleGroup(group.id)}
                                            className={cn(
                                                'flex items-center gap-4 px-6 py-3.5 cursor-pointer transition-colors',
                                                selected ? 'bg-primary/5' : 'hover:bg-muted/30'
                                            )}
                                        >
                                            <Checkbox
                                                checked={selected}
                                                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                onClick={(e) => e.stopPropagation()}
                                                onCheckedChange={() => toggleGroup(group.id)}
                                            />
                                            <div className={cn(
                                                'flex items-center justify-center w-9 h-9 rounded-lg text-xs font-bold shrink-0',
                                                selected ? 'bg-primary/20 text-primary' : 'bg-muted/60 text-muted-foreground'
                                            )}>
                                                {group.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{group.name}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Users className="h-3 w-3" />
                                                    {group.members.toLocaleString('pt-BR')} membros
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Badge variant="outline" className="text-[10px] px-2 border-border/50 text-muted-foreground">
                                                    {group.category}
                                                </Badge>
                                                {selected && <Check className="h-4 w-4 text-primary" />}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Floating CTA if groups selected */}
            {selectedGroups.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3.5 rounded-2xl border border-primary/30 bg-card/90 shadow-xl shadow-black/40 backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-300">
                    <p className="text-sm whitespace-nowrap">
                        <span className="font-bold text-primary">{selectedGroups.size}</span>
                        <span className="text-muted-foreground"> grupos · </span>
                        <span className="font-semibold">
                            {allGroups.filter((g) => selectedGroups.has(g.id)).reduce((a, g) => a + g.members, 0).toLocaleString('pt-BR')}
                        </span>
                        <span className="text-muted-foreground"> membros</span>
                    </p>
                    <Separator orientation="vertical" className="h-5" />
                    <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 shadow-md gap-2"
                        onClick={() => setSheetOpen(true)}
                    >
                        <Send className="h-3.5 w-3.5" />
                        Agendar Envio
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedGroups(new Set())}
                        className="text-muted-foreground"
                    >
                        Limpar
                    </Button>
                </div>
            )}

            {/* ── Schedule Side Sheet ───────────────────────────────────────────── */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side="right" className="w-full sm:w-[420px] border-border bg-card flex flex-col p-0">
                    <SheetHeader className="px-6 py-5 border-b border-border">
                        <SheetTitle className="text-base font-semibold flex items-center gap-2">
                            <CalendarClock className="h-4 w-4 text-primary" />
                            Configurar Agendamento
                        </SheetTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {selectedGroups.size} grupos selecionados
                        </p>
                    </SheetHeader>

                    <ScrollArea className="flex-1">
                        <div className="px-6 py-5 space-y-6">

                            {/* Selected groups preview */}
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                                    Grupos Selecionados
                                </Label>
                                <div className="flex flex-wrap gap-1.5">
                                    {allGroups
                                        .filter((g) => selectedGroups.has(g.id))
                                        .map((g) => (
                                            <Badge
                                                key={g.id}
                                                variant="outline"
                                                className="text-xs border-primary/30 text-primary bg-primary/5"
                                            >
                                                {g.name}
                                            </Badge>
                                        ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Ad selection */}
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                                    <Megaphone className="h-3.5 w-3.5" />
                                    Anúncio a Enviar
                                </Label>
                                <Select value={selectedAd} onValueChange={setSelectedAd}>
                                    <SelectTrigger className="bg-muted/30 border-border/60 h-10">
                                        <SelectValue placeholder="Selecione um anúncio…" />
                                    </SelectTrigger>
                                    <SelectContent className="border-border bg-card">
                                        {ADS.map((ad) => (
                                            <SelectItem key={ad.id} value={ad.id} className="cursor-pointer">
                                                <div>
                                                    <p className="font-medium text-sm">{ad.title}</p>
                                                    <p className="text-xs text-muted-foreground truncate max-w-[280px]">
                                                        {ad.preview}
                                                    </p>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedAd && (
                                    <div className="rounded-lg bg-muted/20 border border-border p-3">
                                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                            {ADS.find((a) => a.id === selectedAd)?.preview}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Time */}
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    Horário de Envio
                                </Label>
                                <Input
                                    type="time"
                                    value={scheduleTime}
                                    onChange={(e) => setScheduleTime(e.target.value)}
                                    className="bg-muted/30 border-border/60 h-10 w-36 font-mono text-base"
                                />
                            </div>

                            <Separator />

                            {/* Repeat */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                                        <RefreshCw className="h-3.5 w-3.5" />
                                        Repetir
                                    </Label>
                                    <Switch
                                        checked={repeat}
                                        onCheckedChange={setRepeat}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>

                                {repeat ? (
                                    <div className="space-y-2">
                                        <p className="text-xs text-muted-foreground">Dias da semana:</p>
                                        <div className="flex gap-1.5">
                                            {DAY_LABELS.map((d) => (
                                                <button
                                                    key={d.key}
                                                    onClick={() => toggleDay(d.key)}
                                                    className={cn(
                                                        'w-8 h-8 rounded-full text-xs font-bold transition-all border',
                                                        days.includes(d.key)
                                                            ? 'bg-primary/20 border-primary/40 text-primary'
                                                            : 'border-border bg-muted/30 text-muted-foreground hover:border-border/80'
                                                    )}
                                                >
                                                    {d.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-xs text-muted-foreground">Data única:</p>
                                        <Input
                                            type="date"
                                            className="bg-muted/30 border-border/60 h-10 w-44"
                                        />
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Summary */}
                            <div className="rounded-xl bg-gradient-to-br from-blue-600/10 to-violet-600/5 border border-primary/20 p-4 space-y-2">
                                <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                                    <Info className="h-3.5 w-3.5" />
                                    Resumo do Agendamento
                                </p>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <p>📱 <span className="text-foreground font-medium">{selectedGroups.size}</span> grupos · {allGroups.filter((g) => selectedGroups.has(g.id)).reduce((a, g) => a + g.members, 0).toLocaleString('pt-BR')} membros</p>
                                    <p>📢 Anúncio: <span className="text-foreground font-medium">{selectedAd ? ADS.find((a) => a.id === selectedAd)?.title : '—'}</span></p>
                                    <p>🕐 Horário: <span className="text-foreground font-medium">{scheduleTime}</span></p>
                                    <p>🔁 Repetição: <span className="text-foreground font-medium">{repeat ? `Dias: ${days.length === 7 ? 'Todos' : days.join(', ')}` : 'Apenas 1 vez'}</span></p>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <SheetFooter className="px-6 py-4 border-t border-border gap-2">
                        <Button variant="outline" onClick={() => setSheetOpen(false)} className="border-border flex-1">
                            Cancelar
                        </Button>
                        <Button
                            disabled={!selectedAd || selectedGroups.size === 0}
                            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 shadow-lg flex-1 gap-2 disabled:opacity-40"
                            onClick={() => {
                                // TODO: persist to server
                                setSheetOpen(false)
                            }}
                        >
                            <Send className="h-4 w-4" />
                            Confirmar Agendamento
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}
