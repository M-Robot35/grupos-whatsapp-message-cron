import { parseOrThrow } from '@/helpers/validation'
import { prisma } from '@/lib/prisma'
import { updateDefaultLimitsSchema } from '@/validations/admin'

export async function updateDefaultLimitsAction(payload: unknown) {
  const data = parseOrThrow(updateDefaultLimitsSchema, payload)

  const existing = await prisma.systemSetting.findFirst()

  if (!existing) {
    return prisma.systemSetting.create({ data })
  }

  return prisma.systemSetting.update({
    where: { id: existing.id },
    data
  })
}
