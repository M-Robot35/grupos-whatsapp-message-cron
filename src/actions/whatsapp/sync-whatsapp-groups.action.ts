import { log } from '@/helpers/logger'
import { makeWhatsAppProvider } from '@/lib/providers'

/**
 * Action responsável por sincronizar grupos de uma instância.
 * Mantém regra de negócio separada do adapter, facilitando manutenção futura.
 */
export async function syncWhatsAppGroupsAction(instanceId: string) {
  const provider = makeWhatsAppProvider()

  log('info', 'Iniciando sincronização de grupos', { instanceId })

  const groups = await provider.getGroups(instanceId)

  log('info', 'Sincronização de grupos concluída', {
    instanceId,
    groupsCount: groups.length
  })

  return groups
}
