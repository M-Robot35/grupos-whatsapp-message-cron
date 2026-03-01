import { createAdAction } from '@/actions/ads/create-ad.action'

export async function createAdController(formData: FormData) {
  return createAdAction(formData)
}
