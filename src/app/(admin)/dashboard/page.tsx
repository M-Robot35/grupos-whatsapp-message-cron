import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Activity, Users, Zap, CalendarClock, TrendingUp, ArrowUpRight,
  CheckCircle2, Clock, AlertCircle, Plus
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard | ZapCron',
}

const statCards = [
  {
    title: 'Instâncias Ativas',
    value: '2',
    change: '+1 este mês',
    trend: 'up',
    icon: Zap,
    color: 'text-emerald-400',
    bg: 'from-emerald-600/10 to-emerald-600/5',
    border: 'border-emerald-600/20',
  },
  {
    title: 'Grupos Conectados',
    value: '145',
    change: '+12 esta semana',
    trend: 'up',
    icon: Users,
    color: 'text-blue-400',
    bg: 'from-blue-600/10 to-blue-600/5',
    border: 'border-blue-600/20',
  },
  {
    title: 'Disparos Agendados',
    value: '8',
    change: 'Próximo às 14:00',
    trend: 'neutral',
    icon: CalendarClock,
    color: 'text-amber-400',
    bg: 'from-amber-600/10 to-amber-600/5',
    border: 'border-amber-600/20',
  },
  {
    title: 'Mensagens Enviadas',
    value: '12.234',
    change: '+19% vs mês anterior',
    trend: 'up',
    icon: Activity,
    color: 'text-violet-400',
    bg: 'from-violet-600/10 to-violet-600/5',
    border: 'border-violet-600/20',
  },
]

const recentDeliveries = [
  { campaign: 'Black Friday Shopee', group: 'Achadinhos VIP 1', time: '09:00', status: 'sent' },
  { campaign: 'Promo Relâmpago ML', group: 'VIP Master', time: '12:30', status: 'sent' },
  { campaign: 'Oferta da Tarde', group: 'Promoções Grupo B', time: '17:00', status: 'pending' },
  { campaign: 'Flash Sale Noturno', group: 'Achadinhos Gold', time: '20:00', status: 'scheduled' },
  { campaign: 'Newsletter Semanal', group: 'Lista Geral', time: '21:00', status: 'scheduled' },
]

const upcomingSchedules = [
  { time: '14:00', title: 'Ofertas da Tarde', group: 'Achadinhos VIP 1', groups: 12 },
  { time: '17:30', title: 'Cupons Exclusivos', group: 'Promoções Grupo B', groups: 8 },
  { time: '20:00', title: 'Flash Sale Noturno', group: 'VIP Master', groups: 22 },
]

const statusConfig = {
  sent: { label: 'Enviada', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  pending: { label: 'Enviando', icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  scheduled: { label: 'Agendada', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Visão geral das suas automações ZapCron.
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0 shadow-lg shadow-blue-900/30 text-white">
          <Link href={"/schedules/new" as any}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className={`bg-gradient-to-br ${card.bg} border ${card.border} glow-card`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className={`text-xs mt-1 flex items-center gap-1 ${card.trend === 'up' ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                {card.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                {card.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Recent Deliveries */}
        <Card className="lg:col-span-4 border-border">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Últimas Entregas</CardTitle>
                <CardDescription className="text-xs mt-0.5">Histórico dos disparos recentes</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">
                Ver tudo <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentDeliveries.map((item, i) => {
                const s = statusConfig[item.status as keyof typeof statusConfig]
                return (
                  <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30 transition-colors">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${s.bg} shrink-0`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.campaign}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.group}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-4 border-0 ${s.bg} ${s.color}`}
                      >
                        {s.label}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Schedules */}
        <Card className="lg:col-span-3 border-border">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Próximos Envios</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Você tem {upcomingSchedules.length} campanhas agendadas para hoje
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {upcomingSchedules.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-primary/15 text-primary font-bold px-2.5 py-1.5 rounded-lg text-xs w-16 text-center border border-primary/20">
                    {item.time}
                  </div>
                  {i < upcomingSchedules.length - 1 && (
                    <div className="w-px h-6 bg-border mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-1">
                  <p className="text-sm font-semibold leading-none">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1.5">{item.group}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Users className="h-3 w-3 text-muted-foreground/60" />
                    <span className="text-[10px] text-muted-foreground">{item.groups} grupos</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
