type LogLevel = 'info' | 'warn' | 'error' | 'debug'

/**
 * Logger simples em JSON para facilitar busca e observabilidade.
 * Mantém padrão único para logs das rotas, actions e adapters.
 */
export function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context
  }

  const logString = JSON.stringify(payload)

  if (level === 'error') {
    console.error(`\x1b[31m${logString}\x1b[0m`) // Red
    return
  }

  if (level === 'warn') {
    console.warn(`\x1b[33m${logString}\x1b[0m`) // Yellow
    return
  }

  if (level === 'info') {
    console.log(`\x1b[32m${logString}\x1b[0m`) // Green
    return
  }

  console.log(logString)
}
