import { createAdController } from '@/controllers/ads/create-ad.controller'
import { handleRouteError, ok } from '@/helpers/http'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const userId = req.headers.get('x-user-id') ?? 'demo-user'
    const data = await createAdController(body, userId)
    return ok(data, 201)
  } catch (error) {
    return handleRouteError(error)
  }
}
