'use server'

import { AdModel } from '@/models/ad.model'
import { getSessionAction } from '@/actions/auth/auth.actions'
import { prisma } from '@/lib/prisma'
import path from 'node:path'
import fs from 'node:fs/promises'
import { withLog } from '@/helpers/with-log'

/**
 * Exclui um anúncio e remove as imagens físicas do disco.
 */
export async function deleteAdAction(adId: string) {
    const session = await getSessionAction()
    if (!session?.user) throw new Error('Não autenticado.')

    return withLog('deleteAdAction', async () => {
        // Busca os itens para saber quais arquivos apagar
        const ad = await prisma.ad.findUnique({
            where: { id: adId },
            include: { items: true },
        })

        if (!ad) throw new Error('Anúncio não encontrado.')

        // Remove arquivos físicos da pasta do usuário
        const adDir = path.resolve(process.cwd(), 'storage', 'ads', session.user.id, adId)
        await fs.rm(adDir, { recursive: true, force: true })

        // Deleta do banco (cascade deleta AdItems)
        await AdModel.deleteById(adId)
    }, { adId, userId: session.user.id })
}
