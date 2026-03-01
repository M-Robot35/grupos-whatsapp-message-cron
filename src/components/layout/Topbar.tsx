'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, User, Zap, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { SIDEBAR_FLAT, SIDEBAR_ITEMS } from './Sidebar'
import { authClient } from '@/lib/auth-client'

export function Topbar() {
    const pathname = usePathname()

    // Find current page title
    const currentItem = SIDEBAR_FLAT.find(
        (item) => pathname === item.href || pathname.startsWith(item.href + '/')
    )

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: { onSuccess: () => { window.location.href = '/' } },
        })
    }

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 lg:px-6">
            {/* Mobile hamburger */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 flex flex-col p-0 bg-card border-border">
                    <SheetTitle className="sr-only">Navegação</SheetTitle>
                    <div className="flex h-16 items-center px-6 border-b border-border shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg">
                                <Zap className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-lg font-extrabold tracking-tight gradient-text">ZapCron</span>
                        </Link>
                    </div>
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                        {SIDEBAR_ITEMS.map((group) => (
                            <div key={group.label}>
                                <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                                    {group.label}
                                </p>
                                <div className="space-y-0.5">
                                    {group.items.map((item) => {
                                        const active = pathname === item.href || pathname.startsWith(item.href + '/')
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                                    active
                                                        ? 'bg-primary/15 text-primary'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                                )}
                                            >
                                                <item.icon className={cn('h-4 w-4 shrink-0', active ? 'text-primary' : '')} />
                                                {item.title}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
                <span className="hidden sm:inline">ZapCron</span>
                {currentItem && (
                    <>
                        <ChevronRight className="h-3.5 w-3.5 hidden sm:inline shrink-0" />
                        <span className="text-foreground font-medium truncate">{currentItem.title}</span>
                    </>
                )}
            </div>

            <div className="flex-1" />

            {/* User menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full border border-border bg-muted/40 hover:bg-muted/80"
                    >
                        <User className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="font-normal">
                        <p className="text-xs text-muted-foreground">Logado como</p>
                        <p className="text-sm font-semibold truncate">Usuário</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/settings">Configurações</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Suporte</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-destructive focus:text-destructive font-medium"
                    >
                        Sair da conta
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
