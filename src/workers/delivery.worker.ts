import { prisma } from '@/lib/prisma'
import { makeWhatsAppProvider } from '@/lib/providers'
import { log } from '@/helpers/logger'

const BATCH_SIZE = 10
let isRunning = false

export async function processBackgroundDeliveries() {
    // Flag p/ garantir que o setInterval não atropela execuções demoradas
    if (isRunning) return
    isRunning = true

    try {
        // 1. Busca envios pendentes garantindo que já deram o horário
        // E marca imediatamente como PENDING -> PROCESSING via transaction atomic lock
        const pendingDeliveries = await prisma.$transaction(async (tx: any) => {
            const deliveries = await tx.delivery.findMany({
                where: {
                    status: 'PENDING',
                    scheduledAt: {
                        lte: new Date(), // Só envia se o tempo já der! O "agora" é maior ou igual ao instante programado.
                    },
                    schedule: {
                        // Em aplicação real checariamos "NextRun" pela timezone, Rrule etc.
                        // Para fim deste escopo, busca apenas os habilitados em ACTIVE.
                        status: 'ACTIVE',
                    }
                },
                include: {
                    schedule: {
                        include: { ad: { include: { items: true } } }
                    }
                },
                take: BATCH_SIZE,
            })

            if (deliveries.length === 0) return []

            // Lock atômico (evita que multithreads peguem as mesmas mensagens)
            // e sinaliza para interface e usuários que já estamos processando ("SENDING")
            await tx.delivery.updateMany({
                where: { id: { in: deliveries.map((d: any) => d.id) } },
                data: { status: 'SENDING', updatedAt: new Date() }
            })

            return deliveries
        })

        if (pendingDeliveries.length === 0) {
            isRunning = false
            return
        }

        log('info', `[WORKER] Iniciando envio de ${pendingDeliveries.length} agendamentos...`)

        const provider = makeWhatsAppProvider()

        // 2. Dispara cada uma com o WhatsApp Adapter
        for (const delivery of pendingDeliveries) {
            try {
                const adItems = delivery.schedule.ad.items

                // Pega apenas a 1ª mensagem do Ad (poderia ter um loop para adItems)
                const firstItem = adItems[0]

                if (!firstItem) {
                    throw new Error('Anúncio sem itens configurados.')
                }

                if (firstItem.imageUrl && firstItem.imageUrl.length > 5) {
                    await provider.sendMedia({
                        instanceId: 'instance_xyz_hardcoded_or_from_db', // O schema do App não ligou Schedule á Instance diretamente. Ligamos via Workspace.
                        groupId: delivery.groupId,
                        mediaUrl: firstItem.imageUrl,
                        mediaType: 'image',
                        text: firstItem.text || undefined,
                    })
                } else {
                    await provider.sendText({
                        instanceId: 'instance_xyz_hardcoded_or_from_db',
                        groupId: delivery.groupId,
                        text: firstItem.text || 'Mensagem sem texto',
                    })
                }

                // Sucesso (Atualiza para SENT)
                await prisma.delivery.update({
                    where: { id: delivery.id },
                    data: { status: 'SENT' }
                })

                await prisma.deliveryAttempt.create({
                    data: { deliveryId: delivery.id, success: true }
                })
            } catch (error: any) {
                log('error', `[WORKER] Falha no Envio. ID: ${delivery.id}`, { erro: error.message })

                // Falha (Atualiza Retry. Se > 3, Marca FAILED)
                const nextRetry = delivery.retryCount + 1

                await prisma.delivery.update({
                    where: { id: delivery.id },
                    data: {
                        status: nextRetry >= 3 ? 'FAILED' : 'PENDING',
                        retryCount: nextRetry,
                        lastError: error.message
                    }
                })

                await prisma.deliveryAttempt.create({
                    data: { deliveryId: delivery.id, success: false, error: error.message }
                })
            }
        }
    } catch (error: any) {
        log('error', '[WORKER] Falha crítica de loop', { error: error.message })
    } finally {
        isRunning = false
    }
}
