import { updateDefaultLimitsController } from '@/controllers/admin/update-default-limits.controller'
import { handleRouteError, ok } from '@/helpers/http'
import { NextRequest } from 'next/server'

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await updateDefaultLimitsController(body)
    return ok(data)
  } catch (error) {
    return handleRouteError(error)
  }
}
