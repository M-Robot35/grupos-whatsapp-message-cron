import { z } from 'zod'

export const workspaceRoleSchema = z.enum(['SUPER_ADMIN', 'ADMIN', 'OPERATOR', 'VIEWER'])

export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(2, 'Nome do workspace deve ter no mínimo 2 caracteres.')
})

export const updateWorkspaceSchema = createWorkspaceSchema.partial()

export const addWorkspaceMemberSchema = z.object({
    workspaceId: z.string().min(1, 'Workspace ID é obrigatório.'),
    userId: z.string().min(1, 'User ID é obrigatório.'),
    role: workspaceRoleSchema.default('OPERATOR')
})
