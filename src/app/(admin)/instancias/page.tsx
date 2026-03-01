'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Smartphone, Plus, Zap, Wifi, WifiOff, Users, ChevronRight,
    QrCode, RefreshCw, MoreVertical, Trash2, Power,
} from 'lucide-react'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'


const INSTANCES = [
    {
        id: 'inst-1',
        name: 'WhatsApp Principal',
        status: 'connected',
        phone: '+55 11 99999-1234',
        groups: 68,
        lastSeen: 'Agora',
    },
    {
        id: 'inst-2',
        name: 'WhatsApp Secundário',
        status: 'connected',
        phone: '+55 11 98888-5678',
        groups: 77,
        lastSeen: '2 min atrás',
    },
    {
        id: 'inst-3',
        name: 'WhatsApp Vendas',
        status: 'disconnected',
        phone: null,
        groups: 0,
        lastSeen: 'Desconectado',
    },
]

const statusMap = {
    connected: {
        label: 'Conectado',
        icon: Wifi,
        dot: 'bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.5)]',
        badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    },
    disconnected: {
        label: 'Desconectado',
        icon: WifiOff,
        dot: 'bg-red-500',
        badge: 'text-red-400 bg-red-400/10 border-red-400/20',
    },
    pending: {
        label: 'Aguardando QR',
        icon: QrCode,
        dot: 'bg-amber-400 animate-pulse',
        badge: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    },
}

export default function InstanciasPage() {
    const [openDialog, setOpenDialog] = useState(false)
    const [qrInstance, setQrInstance] = useState<string | null>(null)

    const connected = INSTANCES.filter((i) => i.status === 'connected').length

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Instâncias WhatsApp</h1>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                        Conecte e gerencie seus números de WhatsApp.
                    </p>
                </div>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0 shadow-lg shadow-blue-900/30 text-white gap-2">
                            <Plus className="h-4 w-4" />
                            Nova Instância
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md border-border bg-card">
                        <DialogHeader>
                            <DialogTitle className="text-base">Nova Instância WhatsApp</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-1.5">
                                <Label className="text-sm text-muted-foreground">Nome da Instância</Label>
                                <Input
                                    placeholder="Ex: WhatsApp Principal"
                                    className="bg-muted/30 border-border/60"
                                />
                            </div>
                            <div className="rounded-xl border border-border bg-muted/20 p-6 flex flex-col items-center gap-3 text-center">
                                <div className="w-32 h-32 rounded-xl bg-background border border-border flex items-center justify-center">
                                    <QrCode className="h-16 w-16 text-muted-foreground/30" />
                                </div>
                                <p className="text-xs text-muted-foreground max-w-xs">
                                    Após criar, o QR Code aparecerá aqui. Abra o WhatsApp → Dispositivos Vinculados → Vincular dispositivo.
                                </p>
                                <Button size="sm" variant="outline" className="gap-2 border-border text-muted-foreground">
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    Gerar QR Code
                                </Button>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setOpenDialog(false)} className="border-border">Cancelar</Button>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0"
                                onClick={() => setOpenDialog(false)}
                            >
                                Criar e Mostrar QR
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Summary stats */}
            <div className="grid gap-3 sm:grid-cols-3">
                {[
                    { label: 'Total de Instâncias', value: INSTANCES.length, icon: Smartphone, color: 'text-violet-400', glow: 'from-violet-600/10 to-violet-600/5', border: 'border-violet-600/20' },
                    { label: 'Conectadas', value: connected, icon: Wifi, color: 'text-emerald-400', glow: 'from-emerald-600/10 to-emerald-600/5', border: 'border-emerald-600/20' },
                    { label: 'Grupos Ativos', value: INSTANCES.reduce((a, i) => a + i.groups, 0), icon: Users, color: 'text-blue-400', glow: 'from-blue-600/10 to-blue-600/5', border: 'border-blue-600/20' },
                ].map((s) => (
                    <Card key={s.label} className={`bg-gradient-to-br ${s.glow} border ${s.border}`}>
                        <CardContent className="flex items-center gap-4 p-4">
                            <s.icon className={`h-7 w-7 ${s.color}`} />
                            <div>
                                <p className="text-2xl font-bold">{s.value}</p>
                                <p className="text-xs text-muted-foreground">{s.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Instances list */}
            <div className="space-y-3">
                {INSTANCES.map((inst) => {
                    const s = statusMap[inst.status as keyof typeof statusMap]
                    return (
                        <Card
                            key={inst.id}
                            className={cn(
                                'border-border transition-all',
                                inst.status === 'connected' && 'hover:border-primary/30 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.1)]'
                            )}
                        >
                            <CardContent className="flex items-center gap-4 p-5">
                                {/* Icon + status dot */}
                                <div className="relative shrink-0">
                                    <div className={cn(
                                        'flex items-center justify-center w-12 h-12 rounded-xl border',
                                        inst.status === 'connected'
                                            ? 'bg-gradient-to-br from-blue-600/20 to-violet-600/20 border-primary/20'
                                            : 'bg-muted/40 border-border'
                                    )}>
                                        <Smartphone className={cn('h-6 w-6', inst.status === 'connected' ? 'text-primary' : 'text-muted-foreground/40')} />
                                    </div>
                                    <span className={cn('absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background', s.dot)} />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-sm font-semibold">{inst.name}</p>
                                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 border ${s.badge}`}>
                                            {s.label}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {inst.phone ?? 'Sem número vinculado'} · {inst.lastSeen}
                                    </p>
                                    {inst.status === 'connected' && (
                                        <p className="text-xs text-blue-400 mt-1 flex items-center gap-1 font-medium">
                                            <Users className="h-3 w-3" />
                                            {inst.groups} grupos sincronizados
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {inst.status === 'connected' ? (
                                        <Button
                                            asChild
                                            size="sm"
                                            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 gap-2"
                                        >
                                            <Link href={`/instancias/${inst.id}/grupos` as any}>
                                                Ver Grupos
                                                <ChevronRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-amber-400/30 text-amber-400 hover:bg-amber-400/10 gap-2"
                                            onClick={() => setQrInstance(inst.id)}
                                        >
                                            <QrCode className="h-3.5 w-3.5" />
                                            Conectar
                                        </Button>
                                    )}

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="border-border">
                                            <DropdownMenuItem className="gap-2 text-xs">
                                                <Power className="h-3.5 w-3.5" />
                                                {inst.status === 'connected' ? 'Desconectar' : 'Reconectar'}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="gap-2 text-xs text-destructive focus:text-destructive">
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Excluir Instância
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* QR Dialog for disconnected instances */}
            <Dialog open={!!qrInstance} onOpenChange={() => setQrInstance(null)}>
                <DialogContent className="sm:max-w-sm border-border bg-card">
                    <DialogHeader>
                        <DialogTitle className="text-base">Conectar WhatsApp</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-2 text-center">
                        <div className="w-40 h-40 rounded-xl bg-background border border-border flex items-center justify-center">
                            <QrCode className="h-20 w-20 text-muted-foreground/20" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Escaneie com seu WhatsApp</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Abra WhatsApp → Dispositivos Vinculados → Vincular dispositivo
                            </p>
                        </div>
                        <Button size="sm" variant="outline" className="gap-2 border-border w-full">
                            <RefreshCw className="h-3.5 w-3.5" />
                            Gerar novo QR Code
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
