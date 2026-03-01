/**
 * Next.js Instrumentation Hook
 * Executa uma *única vez* por runtime (borda, nodejs) para iniciar processos de background.
 */
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { startWorkers } = await import('./workers')
        await startWorkers()
    }
}
