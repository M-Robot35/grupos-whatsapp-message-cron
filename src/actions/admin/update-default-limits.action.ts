import { SystemSettingModel } from '@/models/system-setting.model'
import { withLog } from '@/helpers/with-log'

export async function updateDefaultLimitsAction(payload: unknown) {
  return withLog('updateDefaultLimitsAction', () =>
    SystemSettingModel.upsert(payload)
  )
}
