import { parseOrThrow } from '@/helpers/validation'
import { prisma } from '@/lib/prisma'
import { getEffectiveLimits } from '@/services/limits.service'
import { createInstanceSchema } from '@/validations/instances'

/**
 * Cria uma nova instância WhatsApp respeitando limites do usuário/workspace.
 */
export async function createInstanceAction(payload: unknown, userId: string) {
  const data = parseOrThrow(createInstanceSchema, payload)
  const limits = await getEffectiveLimits(userId, data.workspaceId)

  const count = await prisma.waInstance.count({ where: { workspaceId: data.workspaceId } })
  if (count >= limits.maxInstances) {
    throw new Error('Você atingiu o limite de instâncias do seu plano. Fale com o admin.')
  }

  return prisma.waInstance.create({
    data: {
      workspaceId: data.workspaceId,
      name: data.name
    }
  })
}
