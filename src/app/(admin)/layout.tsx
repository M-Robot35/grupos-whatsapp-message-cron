import { ReactNode } from 'react'
import { requireAuthAction } from '@/actions/auth/auth.actions'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export default async function AdminLayout({ children }: { children: ReactNode }) {
    // Essa Action garante que o usuário está autenticado.
    // Se não estiver, ela mesma dá o redirect para /login ANTES de renderizar.
    const session = await requireAuthAction()

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr]">
            <Sidebar />
            <div className="flex flex-col h-screen overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-muted/10">
                    <div className="mx-auto w-full max-w-6xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
