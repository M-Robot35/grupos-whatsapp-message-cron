import { WhatsAppProvider } from './types'

export class MetaWhatsAppAdapter implements WhatsAppProvider {
  async connect(): Promise<void> {
    throw new Error('Meta adapter not implemented yet.')
  }

  async getGroups(): Promise<Array<{ id: string; name: string }>> {
    return []
  }

  async sendText(): Promise<{ messageId: string }> {
    throw new Error('Meta adapter not implemented yet.')
  }

  async sendMedia(): Promise<{ messageId: string }> {
    throw new Error('Meta adapter not implemented yet.')
  }
}
