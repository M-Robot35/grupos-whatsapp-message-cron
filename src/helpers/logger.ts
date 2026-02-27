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

  if (level === 'error') {
    console.error(JSON.stringify(payload))
    return
  }

  if (level === 'warn') {
    console.warn(JSON.stringify(payload))
    return
  }

  console.log(JSON.stringify(payload))
}
