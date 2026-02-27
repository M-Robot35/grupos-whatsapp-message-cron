import { log } from '@/helpers/logger'
import { makeWhatsAppProvider } from '@/lib/providers'
import { parseOrThrow } from '@/helpers/validation'
import { z } from 'zod'

const sendWhatsAppMessageSchema = z.object({
  instanceId: z.string().min(1, 'Instância é obrigatória.'),
  groupId: z.string().min(1, 'Grupo é obrigatório.'),
  text: z.string().trim().min(1, 'Texto é obrigatório.')
})

/**
 * Action responsável por enviar mensagem de texto para um grupo WhatsApp.
 * Usa provider com decorator de retry para reduzir falhas temporárias.
 */
export async function sendWhatsAppMessageAction(payload: unknown) {
  const data = parseOrThrow(sendWhatsAppMessageSchema, payload)
  const provider = makeWhatsAppProvider()

  log('info', 'Iniciando envio de mensagem WhatsApp', {
    instanceId: data.instanceId,
    groupId: data.groupId
  })

  const result = await provider.sendText(data)

  log('info', 'Mensagem WhatsApp enviada com sucesso', {
    instanceId: data.instanceId,
    groupId: data.groupId,
    messageId: result.messageId
  })

  return result
}
