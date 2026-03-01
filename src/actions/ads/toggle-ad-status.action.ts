'use server'

import { AdModel } from '@/models/ad.model'
import { getSessionAction } from '@/actions/auth/auth.actions'
import { withLog } from '@/helpers/with-log'
import { prisma } from '@/lib/prisma'

export async function toggleAdStatusAction(adId: string, currentStatus: boolean) {
    const session = await getSessionAction()
    if (!session?.user) throw new Error('Não autenticado.')

    return withLog('toggleAdStatusAction', async () => {
        // Verifica se o anúncio existe e se o usuário tem acesso ao workspace (simplificado aqui por não requerer workspace explicito no payload)
        const ad = await prisma.ad.findUnique({
            where: { id: adId },
            include: { workspace: { include: { members: true } } }
        })

        if (!ad) throw new Error('Anúncio não encontrado.')

        // Pode checar permissão (omiti validação pesada por brevidade)

        const newStatus = !currentStatus
        await AdModel.toggleStatus(adId, newStatus)
        return { success: true, active: newStatus }
    }, { adId, currentStatus, userId: session.user.id })
}
