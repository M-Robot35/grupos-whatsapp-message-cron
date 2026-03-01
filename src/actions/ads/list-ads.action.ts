'use server'

import { AdModel } from '@/models/ad.model'
import { getSessionAction } from '@/actions/auth/auth.actions'
import { getOrCreateWorkspace } from '@/helpers/get-or-create-workspace'

/**
 * Lista os anúncios do workspace padrão do usuário autenticado.
 */
export async function listAdsAction() {
    const session = await getSessionAction()
    if (!session?.user) throw new Error('Não autenticado.')

    const workspace = await getOrCreateWorkspace(session.user.id, session.user.name)
    return AdModel.listByWorkspace(workspace.id)
}
