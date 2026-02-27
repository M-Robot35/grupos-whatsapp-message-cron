import { prisma } from '@/lib/prisma'
import { AppLimits } from '@/types/domain'

export async function getEffectiveLimits(userId: string, workspaceId: string): Promise<AppLimits> {
  const [defaults, userLimit] = await Promise.all([
    prisma.systemSetting.findFirst(),
    prisma.userLimit.findUnique({ where: { userId_workspaceId: { userId, workspaceId } } })
  ])

  return {
    maxInstances: userLimit?.maxInstances ?? defaults?.defaultMaxInstancesPerUser ?? 1,
    maxAds: userLimit?.maxAds ?? defaults?.defaultMaxAdsPerUser ?? 10,
    maxSchedules: userLimit?.maxSchedules ?? defaults?.defaultMaxSchedulesPerUser ?? 10,
    maxGroupsPerSchedule:
      userLimit?.maxGroupsPerSchedule ?? defaults?.defaultMaxGroupsPerSchedule ?? 50
  }
}
