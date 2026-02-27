import { withRetry } from '@/helpers/retry'
import { WhatsAppProvider } from '../types'

/**
 * Decorator para aplicar retry em qualquer provider WhatsApp.
 * Permite "encaixar" rapidamente em novos adapters sem duplicar lógica.
 */
export class RetryableWhatsAppAdapter implements WhatsAppProvider {
  constructor(private readonly provider: WhatsAppProvider) {}

  async connect(instanceId: string): Promise<void> {
    return withRetry(() => this.provider.connect(instanceId), {
      operationName: 'whatsapp.connect'
    })
  }

  async getGroups(instanceId: string): Promise<Array<{ id: string; name: string }>> {
    return withRetry(() => this.provider.getGroups(instanceId), {
      operationName: 'whatsapp.getGroups'
    })
  }

  async sendText(params: { instanceId: string; groupId: string; text: string }): Promise<{ messageId: string }> {
    return withRetry(() => this.provider.sendText(params), {
      operationName: 'whatsapp.sendText'
    })
  }

  async sendMedia(params: {
    instanceId: string
    groupId: string
    text?: string
    mediaUrl: string
    mediaType: 'image'
  }): Promise<{ messageId: string }> {
    return withRetry(() => this.provider.sendMedia(params), {
      operationName: 'whatsapp.sendMedia'
    })
  }
}
