import { prisma } from '@/lib/prisma'
import { createInstanceSchema } from '@/validations/instances'
import { parseOrThrow } from '@/helpers/validation'
import { withLog } from '@/helpers/with-log'

export const WaInstanceModel = {
    /**
     * Conta as instâncias de um workspace
     */
    async countByWorkspace(workspaceId: string): Promise<number> {
        return withLog('WaInstanceModel.countByWorkspace', () =>
            prisma.waInstance.count({ where: { workspaceId } })
            , { workspaceId })
    },

    /**
     * Cria uma instância validando o schema
     */
    async create(data: unknown) {
        return withLog('WaInstanceModel.create', () => {
            const parsed = parseOrThrow(createInstanceSchema, data)
            return prisma.waInstance.create({
                data: {
                    workspaceId: parsed.workspaceId,
                    name: parsed.name,
                    status: 'PENDING'
                }
            })
        }, { workspaceId: (data as any)?.workspaceId })
    }
}
