import { prisma } from '@/lib/prisma'
import { WorkspaceModel } from '@/models/workspace.model'

/**
 * Retorna o primeiro workspace do usuário.
 * Se não existir, cria um workspace padrão automaticamente.
 */
export async function getOrCreateWorkspace(userId: string, userName?: string) {
    const workspaces = await WorkspaceModel.findByUser(userId)
    if (workspaces.length) return workspaces[0]

    // Cria workspace padrão para o usuário
    const workspace = await prisma.workspace.create({
        data: {
            name: userName ? `Workspace de ${userName}` : 'Meu Workspace',
            members: {
                create: {
                    userId,
                    role: 'ADMIN',
                },
            },
        },
    })

    return workspace
}
