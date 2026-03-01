import { log } from '@/helpers/logger'
import { SendMediaParams, SendTextParams } from '@/types/domain'
import { WhatsAppProvider } from './types'
import { env } from '@/lib/env'
import { httpClient } from '@/lib/http-client'
import { HttpRequestOptions } from '@/adapters/http/types'

/**
 * Adapter inicial para Evolution API.
 * Aqui ficam os detalhes específicos do provider, isolados do resto do sistema.
 */
export class EvolutionWhatsAppAdapter implements WhatsAppProvider {
  private readonly baseUrl = env.EVOLUTION_API_URL
  private readonly apiKey = env.EVOLUTION_API_KEY

  private async fetchApi<T>(endpoint: string, options?: HttpRequestOptions): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

    try {
      const response = await httpClient.request<T>(url, {
        ...options,
        apiKey: this.apiKey, // Injetado automagicamente na abstração do Axios/Fetch
      })

      return response.data
    } catch (error: any) {
      const status = error.response?.status
      const body = error.response?.data
      log('error', `Falha na requisição Evolution: ${status}`, { url, body, status })
      throw new Error(`Evolution API Error: ${status || 'Unknown'} - falha na requisição`)
    }
  }

  async connect(instanceId: string): Promise<void> {
    log('info', 'Solicitando status/conexão da instância', { instanceId })
    // Idealmente você faz um GET /instance/connectionState/:instance
    // Em Evolution se a instância não estiver conectada você gera um QRCode
    await this.fetchApi(`/instance/connectionState/${instanceId}`)
  }

  async getGroups(instanceId: string): Promise<Array<{ id: string; name: string }>> {
    log('info', 'Buscando grupos da instância na Evolution', { instanceId })
    // Evolution API v2 Retorna todos os grupos: GET /group/fetchAllGroups/{instance}?getParticipants=false
    const result = await this.fetchApi<any[]>(`/group/fetchAllGroups/${instanceId}?getParticipants=false`)

    if (!Array.isArray(result)) {
      throw new Error('Retorno inesperado da Evolution API (não é array)')
    }

    return result.map(group => ({
      id: group.id || group.jid, // Dependendo da versão/tipo retorno id ou jid
      name: group.subject || group.name || 'Sem nome'
    }))
  }

  async sendText(params: SendTextParams): Promise<{ messageId: string }> {
    log('info', 'Enviando mensagem de texto via Evolution', { instanceId: params.instanceId, groupId: params.groupId })

    // POST /message/sendText/{instance}
    // Body: { number: "123@g.us", text: "Olá" }
    const result = await this.fetchApi<any>(`/message/sendText/${params.instanceId}`, {
      method: 'POST',
      body: JSON.stringify({
        number: params.groupId, // O groupId já deve incluir o sufixo @g.us
        text: params.text,
      })
    })

    // Evolution v2 geralmente retorna as info da mensagem em key.id ou messageId
    return { messageId: result?.key?.id || crypto.randomUUID() }
  }

  async sendMedia(params: SendMediaParams): Promise<{ messageId: string }> {
    log('info', 'Enviando mídia via Evolution', { instanceId: params.instanceId, groupId: params.groupId })

    // POST /message/sendMedia/{instance}
    // Body v2: { number: "123@g.us", mediaMessage: { mediatype: "image", media: "url_base64_ou_link", caption: "texto" } }
    const result = await this.fetchApi<any>(`/message/sendMedia/${params.instanceId}`, {
      method: 'POST',
      body: JSON.stringify({
        number: params.groupId,
        mediaMessage: {
          mediatype: params.mediaType,
          media: params.mediaUrl, // suporta links http padrão caso integration configure aceitar webhooks
          caption: params.text || '',
        }
      })
    })

    return { messageId: result?.key?.id || crypto.randomUUID() }
  }
}
