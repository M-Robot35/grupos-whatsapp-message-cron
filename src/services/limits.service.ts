import { prisma } from '@/lib/prisma'
import { AppLimits } from '@/types/domain'
import { SystemSettingModel } from '@/models/system-setting.model'
import { withLog } from '@/helpers/with-log'

export async function getEffectiveLimits(userId: string, workspaceId: string): Promise<AppLimits> {
  return withLog('getEffectiveLimits', async () => {
    const [defaults, userLimit] = await Promise.all([
      SystemSettingModel.getFirst(),
      prisma.userLimit.findUnique({ where: { userId_workspaceId: { userId, workspaceId } } })
    ])

    return {
      maxInstances: userLimit?.maxInstances ?? defaults?.defaultMaxInstancesPerUser ?? 1,
      maxAds: userLimit?.maxAds ?? defaults?.defaultMaxAdsPerUser ?? 10,
      maxSchedules: userLimit?.maxSchedules ?? defaults?.defaultMaxSchedulesPerUser ?? 10,
      maxGroupsPerSchedule:
        userLimit?.maxGroupsPerSchedule ?? defaults?.defaultMaxGroupsPerSchedule ?? 50
    }
  }, { userId, workspaceId })
}
