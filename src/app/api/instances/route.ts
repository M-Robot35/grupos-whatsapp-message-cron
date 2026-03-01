import { createInstanceController } from '@/controllers/instances/create-instance.controller'
import { handleRouteError, ok } from '@/helpers/http'
import { requireApiSession } from '@/helpers/auth-guard'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { session, response } = await requireApiSession()
    if (response) return response

    const body = await req.json()
    const data = await createInstanceController(body, session!.user.id)
    return ok(data, 201)
  } catch (error) {
    return handleRouteError(error)
  }
}
