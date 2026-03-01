import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

/**
 * Rota catch-all do Better Auth.
 * Responde por todas as chamadas HTTP do cliente Better Auth:
 *   POST /api/auth/sign-in/email
 *   POST /api/auth/sign-up/email
 *   POST /api/auth/sign-out
 *   GET  /api/auth/get-session
 *   ... etc
 */
export const { GET, POST } = toNextJsHandler(auth)
