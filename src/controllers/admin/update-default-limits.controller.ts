import { updateDefaultLimitsAction } from '@/actions/admin/update-default-limits.action'

export async function updateDefaultLimitsController(body: unknown) {
  return updateDefaultLimitsAction(body)
}
