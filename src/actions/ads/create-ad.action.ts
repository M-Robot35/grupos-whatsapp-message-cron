'use server'

import { AdModel } from '@/models/ad.model'
import { withLog } from '@/helpers/with-log'
import { getEffectiveLimits } from '@/services/limits.service'
import { getSessionAction } from '@/actions/auth/auth.actions'
import { LocalStorageAdapter } from '@/adapters/storage/local.adapter'
import { getOrCreateWorkspace } from '@/helpers/get-or-create-workspace'

const storage = new LocalStorageAdapter()

/**
 * Cria um anúncio com imagens via FormData.
 * FormData esperado:
 *   - title: string
 *   - text?: string
 *   - images: File[] (1 ou mais)
 *   - captions[{index}]: string? (legenda opcional por imagem)
 */
export async function createAdAction(formData: FormData) {
  const session = await getSessionAction()
  if (!session?.user) throw new Error('Não autenticado.')

  return withLog('createAdAction', async () => {
    const workspace = await getOrCreateWorkspace(session.user.id, session.user.name)

    const limits = await getEffectiveLimits(session.user.id, workspace.id)
    const count = await AdModel.countByWorkspace(workspace.id)
    if (count >= limits.maxAds) {
      throw new Error('Você atingiu o limite de anúncios do seu plano.')
    }

    const title = formData.get('title') as string
    const text = (formData.get('text') as string) || undefined
    const imageFiles = formData.getAll('images') as File[]

    if (!imageFiles.length) throw new Error('Adicione pelo menos uma imagem.')

    // 1. Cria o anúncio base (sem itens) para obter o ID real do banco (CUID)
    const ad = await AdModel.createWithItems({
      workspaceId: workspace.id,
      title,
      text,
      items: [], // Inicialmente vazio
    })

    const adId = ad.id

    // 2. Faz upload de cada imagem na pasta com o ID real
    const items = await Promise.all(
      imageFiles.map(async (file, index) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
        const safeName = originalName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
        const ext = file.name.split('.').pop() ?? 'jpg'
        const filename = `${safeName}_${Date.now()}.${ext}`
        const { url } = await storage.upload(buffer, `ads/${session.user.id}/${adId}/${filename}`)

        const caption = (formData.get(`captions[${index}]`) as string) || undefined

        return { imageUrl: url, caption, position: index }
      })
    )

    // 3. Cadastra os itens (AdItem) atrelados ao Anúncio recém-criado
    await AdModel.addItems(adId, items)

    return ad
  }, { userId: session.user.id })
}
