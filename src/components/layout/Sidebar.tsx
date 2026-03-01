'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Smartphone, Megaphone, Settings, Zap, CalendarClock, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const SIDEBAR_ITEMS = [
    {
        label: 'Principal',
        items: [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { title: 'Instâncias', href: '/instancias', icon: Smartphone },
            { title: 'Anúncios', href: '/ads', icon: Megaphone },
        ],
    },
    {
        label: 'Gestão',
        items: [
            { title: 'Agendamentos', href: '/schedules', icon: CalendarClock },
            { title: 'Relatórios', href: '/reports', icon: BarChart2 },
        ],
    },
    {
        label: 'Sistema',
        items: [
            { title: 'Configurações', href: '/settings', icon: Settings },
        ],
    },
]

// Flat list for the mobile sheet
export const SIDEBAR_FLAT = SIDEBAR_ITEMS.flatMap((g) => g.items)

export function Sidebar() {
    const pathname = usePathname()

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + '/')

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-border bg-card/50 backdrop-blur-xl">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b border-border shrink-0">
                <Link href={"/" as any} className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg">
                        <Zap className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-extrabold tracking-tight gradient-text">ZapCron</span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                {SIDEBAR_ITEMS.map((group) => (
                    <div key={group.label}>
                        <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                            {group.label}
                        </p>
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const active = isActive(item.href)
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href as any}
                                        className={cn(
                                            'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                                            active
                                                ? 'bg-primary/15 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.2)]'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                'h-4 w-4 shrink-0 transition-colors',
                                                active ? 'text-primary' : 'text-muted-foreground/70 group-hover:text-foreground'
                                            )}
                                        />
                                        {item.title}
                                        {active && (
                                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_2px_hsl(var(--primary)/0.5)]" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer badge */}
            <div className="px-4 py-4 border-t border-border">
                <div className="rounded-lg bg-gradient-to-r from-blue-600/10 to-violet-600/10 border border-primary/20 p-3 text-xs text-muted-foreground text-center">
                    <span className="text-primary font-semibold">ZapCron</span> · Plano Pro
                </div>
            </div>
        </aside>
    )
}
