import { z } from 'zod'

export const createAdSchema = z.object({
  workspaceId: z.string().min(1, 'Workspace é obrigatório.'),
  title: z
    .string()
    .trim()
    .min(3, 'Título deve ter no mínimo 3 caracteres.')
    .max(120, 'Título deve ter no máximo 120 caracteres.'),
  text: z.string().trim().max(2000, 'Texto deve ter no máximo 2000 caracteres.').optional()
})
