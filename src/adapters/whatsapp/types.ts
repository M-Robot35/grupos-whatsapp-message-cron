import { GroupDTO, SendMediaParams, SendTextParams } from '@/types/domain'

export interface WhatsAppProvider {
  connect(instanceId: string): Promise<void>
  getGroups(instanceId: string): Promise<GroupDTO[]>
  sendText(params: SendTextParams): Promise<{ messageId: string }>
  sendMedia(params: SendMediaParams): Promise<{ messageId: string }>
}
