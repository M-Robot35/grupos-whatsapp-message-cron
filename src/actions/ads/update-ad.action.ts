'use server'

import { AdModel } from '@/models/ad.model'
import { withLog } from '@/helpers/with-log'
import { getSessionAction } from '@/actions/auth/auth.actions'
import { getOrCreateWorkspace } from '@/helpers/get-or-create-workspace'
import { LocalStorageAdapter } from '@/adapters/storage/local.adapter'
import { prisma } from '@/lib/prisma'
import fs from 'node:fs/promises'
import path from 'node:path'

const storage = new LocalStorageAdapter()

/**
 * Atualiza um anúncio e suas imagens via FormData.
 * FormData esperado:
 *   - id: string (Ad ID)
 *   - title: string
 *   - text?: string
 *   - items[{index}].type: 'existing' | 'new'
 *   - Se 'existing':
 *       - items[{index}].url: string
 *       - items[{index}].caption?: string
 *   - Se 'new':
 *       - items[{index}].file: File
 *       - items[{index}].caption?: string
 */
export async function updateAdAction(formData: FormData) {
    const session = await getSessionAction()
    if (!session?.user) throw new Error('Não autenticado.')

    return withLog('updateAdAction', async () => {
        const workspace = await getOrCreateWorkspace(session.user.id, session.user.name)

        const adId = formData.get('id') as string
        if (!adId) throw new Error('ID do anúncio é obrigatório.')

        // Verifica se o anúncio pertence ao workspace do usuário
        const existingAd = await prisma.ad.findFirst({
            where: { id: adId, workspaceId: workspace.id },
            include: { items: true },
        })
        if (!existingAd) throw new Error('Anúncio não encontrado ou sem permissão.')

        const title = formData.get('title') as string
        const text = (formData.get('text') as string) || undefined

        const itemsLength = Number(formData.get('itemsLength') || '0')
        if (itemsLength === 0) throw new Error('Adicione pelo menos uma imagem.')

        const newItems: { imageUrl: string; caption?: string; position: number }[] = []
        const keptUrls = new Set<string>()

        // Processa cada item do FormData
        for (let i = 0; i < itemsLength; i++) {
            const type = formData.get(`items[${i}].type`)
            const caption = (formData.get(`items[${i}].caption`) as string) || undefined

            if (type === 'existing') {
                const url = formData.get(`items[${i}].url`) as string
                keptUrls.add(url)
                newItems.push({ imageUrl: url, caption, position: i })
            } else if (type === 'new') {
                const file = formData.get(`items[${i}].file`) as File
                if (!file) throw new Error(`Arquivo da imagem ${i} não encontrado.`)

                const buffer = Buffer.from(await file.arrayBuffer())
                const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
                const safeName = originalName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
                const ext = file.name.split('.').pop() ?? 'jpg'
                const filename = `${safeName}_${Date.now()}.${ext}`
                const { url } = await storage.upload(buffer, `ads/${session.user.id}/${adId}/${filename}`)

                keptUrls.add(url)
                newItems.push({ imageUrl: url, caption, position: i })
            }
        }

        // Deleta as imagens antigas físicas que não foram mantidas
        const adDir = path.resolve(process.cwd(), 'storage', 'ads', session.user.id, adId)
        try {
            const files = await fs.readdir(adDir)
            // keptUrls tem formato tipo 'http://localhost/storage/userId/ads/adId/123.jpg' ou absoluto Next.
            // Para garantir a comparação exata local, comparamos só o nome do arquivo final
            const keptFilenames = Array.from(keptUrls).map(url => url.split('/').pop())

            for (const file of files) {
                if (!keptFilenames.includes(file)) {
                    await fs.unlink(path.join(adDir, file)).catch(() => { })
                }
            }
        } catch (e) {
            // Diretório não existe ou erro ao ler, ignorar
        }

        return AdModel.updateWithItems(adId, {
            id: adId,
            workspaceId: workspace.id,
            title,
            text,
            items: newItems,
        })
    }, { userId: session.user.id })
}
