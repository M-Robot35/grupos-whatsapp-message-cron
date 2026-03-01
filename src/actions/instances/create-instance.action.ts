import { WaInstanceModel } from '@/models/instance.model'
import { withLog } from '@/helpers/with-log'
import { parseOrThrow } from '@/helpers/validation'
import { getEffectiveLimits } from '@/services/limits.service'
import { createInstanceSchema } from '@/validations/instances'

/**
 * Cria uma nova instância WhatsApp respeitando limites do usuário/workspace.
 */
export async function createInstanceAction(payload: unknown, userId: string) {
  return withLog('createInstanceAction', async () => {
    const data = parseOrThrow(createInstanceSchema, payload)
    const limits = await getEffectiveLimits(userId, data.workspaceId)

    const count = await WaInstanceModel.countByWorkspace(data.workspaceId)
    if (count >= limits.maxInstances) {
      throw new Error('Você atingiu o limite de instâncias do seu plano. Fale com o admin.')
    }

    return WaInstanceModel.create(data)
  }, { userId })
}
