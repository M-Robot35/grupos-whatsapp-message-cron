import { prisma } from '@/lib/prisma'
import { createAdWithItemsSchema, updateAdWithItemsSchema } from '@/validations/ads'
import { parseOrThrow } from '@/helpers/validation'
import { withLog } from '@/helpers/with-log'

export const AdModel = {
    /**
     * Conta os anúncios de um workspace
     */
    async countByWorkspace(workspaceId: string): Promise<number> {
        return withLog('AdModel.countByWorkspace', () =>
            prisma.ad.count({ where: { workspaceId } })
            , { workspaceId })
    },

    /**
     * Lista os anúncios de um workspace com seus itens
     */
    async listByWorkspace(workspaceId: string) {
        return withLog('AdModel.listByWorkspace', () =>
            prisma.ad.findMany({
                where: { workspaceId },
                include: { items: { orderBy: { position: 'asc' } } },
                orderBy: { createdAt: 'desc' },
            })
            , { workspaceId })
    },

    /**
     * Cria um anúncio com seus itens (imagens + legendas) em uma transaction
     */
    async createWithItems(data: unknown) {
        return withLog('AdModel.createWithItems', async () => {
            const parsed = parseOrThrow(createAdWithItemsSchema, data)
            return prisma.ad.create({
                data: {
                    id: parsed.id,
                    workspaceId: parsed.workspaceId,
                    title: parsed.title,
                    text: parsed.text,
                    items: parsed.items ? {
                        create: parsed.items.map((item) => ({
                            imageUrl: item.imageUrl,
                            text: item.caption,
                            position: item.position,
                        })),
                    } : undefined,
                },
                include: { items: { orderBy: { position: 'asc' } } },
            })
        }, { workspaceId: (data as any)?.workspaceId })
    },

    /**
     * Adiciona itens a um anúncio existente (útil após criá-lo sem imagens)
     */
    async addItems(adId: string, items: { imageUrl: string, caption?: string, position: number }[]) {
        return withLog('AdModel.addItems', async () => {
            return prisma.$transaction(
                items.map(item =>
                    prisma.adItem.create({
                        data: {
                            adId,
                            imageUrl: item.imageUrl,
                            text: item.caption,
                            position: item.position
                        }
                    })
                )
            )
        }, { adId, count: items.length })
    },

    /**
     * Exclui um anúncio (cascata deleta os AdItems no banco)
     */
    async deleteById(id: string) {
        return withLog('AdModel.deleteById', () =>
            prisma.ad.delete({ where: { id } })
            , { id })
    },

    /**
     * Alterna o status ativo do anúncio
     */
    async toggleStatus(id: string, active: boolean) {
        return withLog('AdModel.toggleStatus', () =>
            prisma.ad.update({
                where: { id },
                data: { active },
            })
            , { id, active })
    },

    /**
     * Atualiza um anúncio com seus itens. Estratégia simples:
     * Deleta os itens atuais e recria com a nova ordem/imagens.
     */
    async updateWithItems(adId: string, data: unknown) {
        return withLog('AdModel.updateWithItems', async () => {
            const parsed = parseOrThrow(updateAdWithItemsSchema, data)

            // Garantir que o Ad pertence ao Workspace do usuário chamador
            // não é feito aqui, espera-se validação no controller/action

            return prisma.$transaction(async (tx) => {
                // Remove itens antigos
                await tx.adItem.deleteMany({ where: { adId } })

                // Atualiza o Ad base e insere novos itens
                return tx.ad.update({
                    where: { id: adId },
                    data: {
                        title: parsed.title,
                        text: parsed.text,
                        items: {
                            create: parsed.items.map((item) => ({
                                imageUrl: item.imageUrl,
                                text: item.caption,
                                position: item.position,
                            })),
                        },
                    },
                    include: { items: { orderBy: { position: 'asc' } } },
                })
            })
        }, { adId })
    },
}
