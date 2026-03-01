import { z } from 'zod'

export const userStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])

export const createUserSchema = z.object({
    name: z.string().trim().min(2, 'Nome deve ter no mínimo 2 caracteres.'),
    email: z.string().trim().email('E-mail inválido.'),
    status: userStatusSchema.default('ACTIVE')
})

export const updateUserSchema = createUserSchema.partial()
