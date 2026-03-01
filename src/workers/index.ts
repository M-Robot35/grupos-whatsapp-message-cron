import { processBackgroundDeliveries } from './delivery.worker'
import { log } from '@/helpers/logger'

export async function startWorkers() {
    log('info', '[WORKER] Iniciando Motor de Envios em Background...')

    // Executa uma vez na inicialização para pegar pendentes
    await processBackgroundDeliveries()

    // Define o loop de 30 em 30 segundos
    setInterval(() => {
        processBackgroundDeliveries().catch((err) => {
            log('error', '[WORKER] Erro no loop de background', { err: err?.message })
        })
    }, 30000)
}
