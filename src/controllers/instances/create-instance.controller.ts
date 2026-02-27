import { createInstanceAction } from '@/actions/instances/create-instance.action'

export async function createInstanceController(body: unknown, userId: string) {
  return createInstanceAction(body, userId)
}
