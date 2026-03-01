import { prisma } from '@/lib/prisma'
import { parseOrThrow } from '@/helpers/validation'
import { withLog } from '@/helpers/with-log'
import { createUserSchema, updateUserSchema } from '@/validations/users'

export const UserModel = {
    /**
     * Encontra um usuário pelo ID
     */
    async findById(id: string) {
        return withLog('UserModel.findById', () =>
            prisma.user.findUnique({ where: { id } })
            , { userId: id })
    },

    /**
     * Encontra um usuário pelo Email
     */
    async findByEmail(email: string) {
        return withLog('UserModel.findByEmail', () =>
            prisma.user.findUnique({ where: { email } })
            , { email })
    },

    /**
     * Lista todos os usuários (com paginação opcional)
     */
    async findMany(params?: { skip?: number; take?: number }) {
        return withLog('UserModel.findMany', () =>
            prisma.user.findMany({
                skip: params?.skip,
                take: params?.take,
                orderBy: { createdAt: 'desc' }
            })
        )
    },

    /**
     * Cria um novo usuário
     */
    async create(data: unknown) {
        return withLog('UserModel.create', () => {
            const parsed = parseOrThrow(createUserSchema, data)
            return prisma.user.create({ data: parsed })
        }, { email: (data as any)?.email })
    },

    /**
     * Atualiza um usuário existente
     */
    async update(id: string, data: unknown) {
        return withLog('UserModel.update', () => {
            const parsed = parseOrThrow(updateUserSchema, data)
            return prisma.user.update({ where: { id }, data: parsed })
        }, { userId: id })
    },

    /**
     * Remove um usuário
     */
    async delete(id: string) {
        return withLog('UserModel.delete', () =>
            prisma.user.delete({ where: { id } })
            , { userId: id })
    }
}
