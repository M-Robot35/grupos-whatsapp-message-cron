import { log } from './logger'

export type RetryOptions = {
  retries: number
  baseDelayMs: number
  maxDelayMs: number
  factor: number
  operationName: string
}

const defaultOptions: RetryOptions = {
  retries: 3,
  baseDelayMs: 300,
  maxDelayMs: 3000,
  factor: 2,
  operationName: 'operation'
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Executa uma função com retentativa exponencial.
 * Útil para integrações externas (ex.: provedores WhatsApp).
 */
export async function withRetry<T>(fn: () => Promise<T>, options?: Partial<RetryOptions>): Promise<T> {
  const config = { ...defaultOptions, ...options }
  let attempt = 0

  while (attempt <= config.retries) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === config.retries) {
        log('error', 'Retry esgotado', {
          operationName: config.operationName,
          attempt,
          error: error instanceof Error ? error.message : 'unknown'
        })
        throw error
      }

      const delay = Math.min(config.baseDelayMs * config.factor ** attempt, config.maxDelayMs)

      log('warn', 'Tentativa falhou, executando retry', {
        operationName: config.operationName,
        attempt,
        nextDelayMs: delay,
        error: error instanceof Error ? error.message : 'unknown'
      })

      await sleep(delay)
      attempt += 1
    }
  }

  throw new Error('Retry finalizado sem retorno.')
}
