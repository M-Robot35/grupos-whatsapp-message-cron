import { ok } from '@/helpers/http'

export async function GET() {
  return ok({ ok: true, service: 'grupos-whatsapp-message-cron' })
}
