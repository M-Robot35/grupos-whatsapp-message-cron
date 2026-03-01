import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError } from '@/types/api'
import { log } from './logger'
import { normalizeZodIssues } from './validation'

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function fail(message: string, status = 400, issues?: ApiError['issues']) {
  return NextResponse.json({ success: false, message, issues }, { status })
}

export function handleRouteError(error: unknown) {
  if (error instanceof z.ZodError) {
    const issues = normalizeZodIssues(error)
    log('warn', 'Falha de validação na requisição', { issues })
    return fail('Dados inválidos. Verifique os campos informados.', 422, issues)
  }

  if (error instanceof Error) {
    // Não expõe mensagens internas de erro de infra/banco ao cliente
    log('error', 'Erro na rota', { message: error.message })
    return fail('Erro ao processar a requisição. Tente novamente.', 500)
  }

  log('error', 'Erro inesperado na rota')
  return fail('Erro inesperado ao processar solicitação.', 500)
}
