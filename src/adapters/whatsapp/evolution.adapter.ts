import { log } from '@/helpers/logger'
import { SendMediaParams, SendTextParams } from '@/types/domain'
import { WhatsAppProvider } from './types'

/**
 * Adapter inicial para Evolution API.
 * Aqui ficam os detalhes específicos do provider, isolados do resto do sistema.
 */
export class EvolutionWhatsAppAdapter implements WhatsAppProvider {
  async connect(instanceId: string): Promise<void> {
    log('info', 'Conectando instância na Evolution', { instanceId })
  }

  async getGroups(instanceId: string): Promise<Array<{ id: string; name: string }>> {
    log('info', 'Buscando grupos da instância na Evolution', { instanceId })
    return []
  }

  async sendText(params: SendTextParams): Promise<{ messageId: string }> {
    log('info', 'Enviando mensagem de texto via Evolution', params)
    return { messageId: crypto.randomUUID() }
  }

  async sendMedia(params: SendMediaParams): Promise<{ messageId: string }> {
    log('info', 'Enviando mídia via Evolution', params)
    return { messageId: crypto.randomUUID() }
  }
}
