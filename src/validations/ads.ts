import { z } from 'zod'

export const createAdSchema = z.object({
  id: z.string().optional(),
  workspaceId: z.string().min(1, 'Workspace é obrigatório.'),
  title: z
    .string()
    .trim()
    .min(3, 'Título deve ter no mínimo 3 caracteres.')
    .max(120, 'Título deve ter no máximo 120 caracteres.'),
  text: z.string().trim().max(2000, 'Texto deve ter no máximo 2000 caracteres.').optional()
})

export const adItemSchema = z.object({
  imageUrl: z.string().min(1, 'URL da imagem é obrigatória.'),
  caption: z.string().trim().max(500, 'Legenda deve ter no máximo 500 caracteres.').optional(),
  position: z.number().int().min(0),
})

export const createAdWithItemsSchema = createAdSchema.extend({
  items: z.array(adItemSchema),
})

export const updateAdWithItemsSchema = createAdWithItemsSchema.extend({
  id: z.string().min(1, 'ID do anúncio é obrigatório.'),
})
