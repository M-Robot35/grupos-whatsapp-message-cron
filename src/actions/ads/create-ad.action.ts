import { parseOrThrow } from '@/helpers/validation'
import { prisma } from '@/lib/prisma'
import { getEffectiveLimits } from '@/services/limits.service'
import { createAdSchema } from '@/validations/ads'

/**
 * Cria anúncio dentro do workspace respeitando limite de plano do usuário.
 */
export async function createAdAction(payload: unknown, userId: string) {
  const data = parseOrThrow(createAdSchema, payload)
  const limits = await getEffectiveLimits(userId, data.workspaceId)

  const count = await prisma.ad.count({ where: { workspaceId: data.workspaceId } })
  if (count >= limits.maxAds) {
    throw new Error('Você atingiu o limite de anúncios do seu plano. Fale com o admin.')
  }

  return prisma.ad.create({
    data: {
      workspaceId: data.workspaceId,
      title: data.title,
      text: data.text
    }
  })
}
