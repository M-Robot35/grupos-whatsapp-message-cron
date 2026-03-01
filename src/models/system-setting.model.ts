import { prisma } from '@/lib/prisma'
import { updateDefaultLimitsSchema } from '@/validations/admin'
import { parseOrThrow } from '@/helpers/validation'
import { withLog } from '@/helpers/with-log'

export const SystemSettingModel = {
    /**
     * Busca a primeira (e única) linha de settings do sistema
     */
    async getFirst() {
        return withLog('SystemSettingModel.getFirst', () =>
            prisma.systemSetting.findFirst()
        )
    },

    /**
     * Cria ou atualiza as configurações do sistema
     */
    async upsert(data: unknown) {
        return withLog('SystemSettingModel.upsert', async () => {
            const parsed = parseOrThrow(updateDefaultLimitsSchema, data)
            const current = await prisma.systemSetting.findFirst()

            if (current) {
                return prisma.systemSetting.update({
                    where: { id: current.id },
                    data: parsed
                })
            }

            return prisma.systemSetting.create({ data: parsed })
        })
    }
}
