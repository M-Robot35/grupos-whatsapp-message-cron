import { z } from 'zod'

export const updateDefaultLimitsSchema = z.object({
  defaultMaxInstancesPerUser: z.number().int().min(1, 'Mínimo de 1 instância por usuário.'),
  defaultMaxAdsPerUser: z.number().int().min(1, 'Mínimo de 1 anúncio por usuário.'),
  defaultMaxSchedulesPerUser: z.number().int().min(1, 'Mínimo de 1 agendamento por usuário.'),
  defaultMaxGroupsPerSchedule: z
    .number()
    .int()
    .min(1, 'Mínimo de 1 grupo por agendamento.')
})
