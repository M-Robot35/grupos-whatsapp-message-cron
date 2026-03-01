import { createAuthClient } from 'better-auth/react'

/**
 * Client-side auth instance do Better Auth.
 * Use este objeto em componentes 'use client' para login, cadastro e logout.
 */
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
})

export type Session = typeof authClient.$Infer.Session
