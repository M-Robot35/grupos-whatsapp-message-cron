import { log } from '@/helpers/logger'
import { makeWhatsAppProvider } from '@/lib/providers'
import { requirePremiumAction, requireAuthAction } from '@/actions/auth/auth.actions'

/**
 * Action responsável por sincronizar grupos de uma instância.
 * Mantém regra de negócio separada do adapter, facilitando manutenção futura.
 * APENAS USUÁRIOS PREMIUM PODEM SINCRONIZAR!
 */
export async function syncWhatsAppGroupsAction(instanceId: string) {
  // 1. Validação de Segurança (Authentication / Authorization / Plan)
  // Lança throw/redirect internamente se falhar
  await requirePremiumAction()

  // 2. Continua o fluxo normal se passar nas regras
  const provider = makeWhatsAppProvider()

  log('info', 'Iniciando sincronização de grupos', { instanceId })

  const groups = await provider.getGroups(instanceId)

  log('info', 'Sincronização de grupos concluída', {
    instanceId,
    groupsCount: groups.length
  })

  return groups
}
