import { createAdAction } from '@/actions/ads/create-ad.action'

export async function createAdController(body: unknown, userId: string) {
  return createAdAction(body, userId)
}
