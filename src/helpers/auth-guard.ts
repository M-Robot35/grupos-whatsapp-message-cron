import { auth } from '@/lib/auth'
import { fail } from './http'
import { headers } from 'next/headers'

/**
 * Valida a sessão do usuário autenticado para ser API routes (não UI redirects).
 * Lança uma resposta 401 se não houver sessão válida.
 */
export async function requireApiSession() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
        return { session: null, response: fail('Não autenticado. Faça login para continuar.', 401) }
    }

    return { session, response: null }
}

/**
 * Valida que o usuário é admin em API routes.
 * Lança resposta 403 se não for admin.
 */
export async function requireApiAdmin() {
    const { session, response } = await requireApiSession()
    if (response) return { session: null, response }

    const role = (session!.user as any).role
    if (role !== 'admin') {
        return { session: null, response: fail('Acesso negado. Apenas admins podem realizar esta ação.', 403) }
    }

    return { session, response: null }
}

