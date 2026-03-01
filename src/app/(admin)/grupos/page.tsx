'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Search, Users, Zap, RefreshCw, Check, Filter, SlidersHorizontal, CheckSquare, Square
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Sample data — will come from server/API in real implementation
const INSTANCES = [
    { id: 'inst-1', name: 'WhatsApp Principal', status: 'connected', groups: 68 },
    { id: 'inst-2', name: 'WhatsApp Secundário', status: 'connected', groups: 77 },
    { id: 'inst-3', name: 'WhatsApp Vendas', status: 'disconnected', groups: 0 },
]

const GROUPS = [
    { id: 'g1', instanceId: 'inst-1', name: 'Achadinhos VIP 1', members: 254, category: 'Shopee' },
    { id: 'g2', instanceId: 'inst-1', name: 'Achadinhos VIP 2', members: 189, category: 'Shopee' },
    { id: 'g3', instanceId: 'inst-1', name: 'Promoções Gold', members: 342, category: 'Geral' },
    { id: 'g4', instanceId: 'inst-1', name: 'Cupons Exclusivos', members: 512, category: 'Shopee' },
    { id: 'g5', instanceId: 'inst-1', name: 'Afiliados Top BR', members: 98, category: 'Afiliados' },
    { id: 'g6', instanceId: 'inst-1', name: 'Flash Sales', members: 401, category: 'Geral' },
    { id: 'g7', instanceId: 'inst-1', name: 'Mercado Livre VIP', members: 277, category: 'ML' },
    { id: 'g8', instanceId: 'inst-1', name: 'Lista Semanal', members: 130, category: 'Geral' },
    { id: 'g9', instanceId: 'inst-2', name: 'VIP Master Club', members: 625, category: 'Afiliados' },
    { id: 'g10', instanceId: 'inst-2', name: 'Shopee Deals', members: 310, category: 'Shopee' },
    { id: 'g11', instanceId: 'inst-2', name: 'Amazon Prime Offers', members: 198, category: 'Amazon' },
    { id: 'g12', instanceId: 'inst-2', name: 'Negócios Digitais', members: 88, category: 'Geral' },
]

const CATEGORIES = ['Todos', 'Shopee', 'ML', 'Amazon', 'Afiliados', 'Geral']

export default function GruposPage() {
    const [selectedInstance, setSelectedInstance] = useState<string>('all')
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Todos')
    const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set())

    const filteredGroups = GROUPS.filter((g) => {
        const matchInstance = selectedInstance === 'all' || g.instanceId === selectedInstance
        const matchSearch = g.name.toLowerCase().includes(search.toLowerCase())
        const matchCategory = selectedCategory === 'Todos' || g.category === selectedCategory
        return matchInstance && matchSearch && matchCategory
    })

    const allVisible = filteredGroups.length > 0 && filteredGroups.every((g) => selectedGroups.has(g.id))
    const someVisible = filteredGroups.some((g) => selectedGroups.has(g.id))

    const toggleGroup = (id: string) => {
        setSelectedGroups((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
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

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Grupos</h1>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                        Selecione os grupos que receberão os disparos.
                    </p>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0 shadow-lg shadow-blue-900/30 text-white gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Sincronizar Grupos
                </Button>
            </div>

            {/* Instance Stats */}
            <div className="grid gap-3 sm:grid-cols-3">
                {INSTANCES.map((inst) => (
                    <button
                        key={inst.id}
                        onClick={() => setSelectedInstance(selectedInstance === inst.id ? 'all' : inst.id)}
                        className={cn(
                            'text-left p-4 rounded-xl border transition-all duration-150',
                            inst.status === 'disconnected' && 'opacity-50 cursor-not-allowed pointer-events-none',
                            selectedInstance === inst.id
                                ? 'border-primary/50 bg-primary/10 shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]'
                                : 'border-border bg-card/60 hover:border-border/80 hover:bg-muted/40',
                        )}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                <span className="text-sm font-semibold truncate">{inst.name}</span>
                            </div>
                            <span
                                className={cn(
                                    'h-2 w-2 rounded-full shrink-0',
                                    inst.status === 'connected' ? 'bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.5)]' : 'bg-red-500'
                                )}
                            />
                        </div>
                        <p className="text-2xl font-bold">{inst.groups}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">grupos sincronizados</p>
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <Card className="border-border flex-1">
                <CardHeader className="border-b border-border pb-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar grupos…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-muted/30 border-border/60 h-9"
                            />
                        </div>

                        {/* Category filter */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                                        selectedCategory === cat
                                            ? 'border-primary/40 bg-primary/15 text-primary'
                                            : 'border-border/50 bg-muted/30 text-muted-foreground hover:text-foreground hover:border-border'
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Select all */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleAll}
                            className="gap-2 border-border text-muted-foreground hover:text-foreground ml-auto"
                        >
                            {allVisible ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
                            {allVisible ? 'Desmarcar todos' : 'Selecionar todos'}
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="flex items-center gap-2 px-6 py-2.5 border-b border-border bg-muted/20 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>
                            <strong className="text-foreground">{filteredGroups.length}</strong> grupos encontrados ·{' '}
                            <strong className="text-primary">{selectedGroups.size}</strong> selecionados
                        </span>
                    </div>

                    <ScrollArea className="h-[420px]">
                        <div className="divide-y divide-border">
                            {filteredGroups.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                    <Users className="h-10 w-10 mb-3 opacity-30" />
                                    <p className="text-sm font-medium">Nenhum grupo encontrado</p>
                                    <p className="text-xs mt-1">Tente ajustar os filtros ou sincronize novamente.</p>
                                </div>
                            ) : (
                                filteredGroups.map((group) => {
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
                                                onCheckedChange={() => toggleGroup(group.id)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <div className={cn(
                                                'flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold shrink-0',
                                                selected
                                                    ? 'bg-primary/20 text-primary'
                                                    : 'bg-muted/60 text-muted-foreground'
                                            )}>
                                                {group.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn('text-sm font-medium truncate', selected ? 'text-foreground' : '')}>
                                                    {group.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {group.members.toLocaleString('pt-BR')} membros
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px] px-2 border-border/50 text-muted-foreground"
                                                >
                                                    {group.category}
                                                </Badge>
                                                {selected && <Check className="h-4 w-4 text-primary" />}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Action Bar */}
            {selectedGroups.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3.5 rounded-2xl bg-card border border-primary/30 shadow-lg shadow-black/40 backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-300">
                    <div className="text-sm">
                        <span className="font-bold text-primary">{selectedGroups.size}</span>
                        <span className="text-muted-foreground"> grupos selecionados</span>
                    </div>
                    <Separator orientation="vertical" className="h-5" />
                    <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 shadow-md"
                    >
                        Usar no Agendamento →
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
        </div>
    )
}
