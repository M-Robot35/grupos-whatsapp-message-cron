import { log } from './logger'

type LoggerContext = Record<string, unknown>

/** Remove campos sensíveis conhecidos do contexto antes de persistir em log */
const SENSITIVE_KEYS = ['password', 'senha', 'token', 'secret', 'payload', 'body', 'card', 'cvv']

function sanitizeContext(ctx?: LoggerContext): LoggerContext {
    if (!ctx) return {}
    return Object.fromEntries(
        Object.entries(ctx).filter(([key]) =>
            !SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s))
        )
    )
}

/**
 * Decorator (wrapper) para adicionar logs uniformes na execução de funções,
 * facilitando a observabilidade e auditoria (sucesso, tempo de execução, falha).
 *
 * SEGURANÇA: O contexto passado é logado — nunca passe dados sensíveis como
 * senhas, tokens ou informações de cartão. Passe apenas IDs e operationName.
 */
export async function withLog<T>(
    operationName: string,
    fn: () => Promise<T> | T,
    context?: LoggerContext
): Promise<T> {
    const safeContext = sanitizeContext(context)
    const start = performance.now()
    try {
        const result = await fn()
        const ms = Math.round(performance.now() - start)

        log('info', `[SUCCESS] ${operationName}`, {
            ...safeContext,
            executionTimeMs: ms
        })

        return result
    } catch (error) {
        const ms = Math.round(performance.now() - start)
        const errMessage = error instanceof Error ? error.message : 'Erro desconhecido'

        log('error', `[ERROR] ${operationName}`, {
            ...safeContext,
            executionTimeMs: ms,
            error: errMessage,
        })

        throw error
    }
}
