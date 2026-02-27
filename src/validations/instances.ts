import { z } from 'zod'

export const createInstanceSchema = z.object({
  workspaceId: z.string().min(1, 'Workspace é obrigatório.'),
  name: z
    .string()
    .trim()
    .min(2, 'Nome da instância deve ter no mínimo 2 caracteres.')
    .max(80, 'Nome da instância deve ter no máximo 80 caracteres.')
})
