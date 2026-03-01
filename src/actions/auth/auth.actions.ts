'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Retorna a sessão atual ou redireciona para o login se não estiver logado.
 * Ideal para usar em Layouts e Pages Server-Side para proteger a rota.
 */
export async function requireAuthAction() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        redirect('/login')
    }

    return session
}

/**
 * Retorna a sessão se o usuário for Admin.
 * Redireciona para o login (ou unauthorized) se não for admin.
 */
export async function requireAdminAction() {
    const session = await requireAuthAction()

    if ((session.user as any).role !== 'admin') {
        // Pode redirecionar para um /403 ou de volta pro login/dashboard
        redirect('/dashboard?error=AcessoNegadoAdmin')
    }

    return session
}

/**
 * Exemplo prático de validação de plano "Premium".
 * Redireciona para tela de upgrade se não for premium.
 */
export async function requirePremiumAction() {
    const session = await requireAuthAction()

    // Neste exemplo, vamos checar um campo `plan` ou similar 
    // que você pode adicionar depois no schema `User`.
    // Por enquanto, checamos via custom attributes ou metadados da sessão.
    const isPremium = (session.user as any).plan === 'premium'

    if (!isPremium) {
        redirect('/dashboard?error=AcessoNegadoPremium')
    }

    return session
}

/**
 * Helper apenas para obter a sessão atual (sem redirecionar).
 * Útil para Server Actions de negócio (ex: criar anúncio) em que
 * você prefere retornar um Error string e não dar redirect.
 */
export async function getSessionAction() {
    return auth.api.getSession({
        headers: await headers()
    })
}
