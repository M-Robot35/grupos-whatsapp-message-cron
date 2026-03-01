import { prisma } from '@/lib/prisma'
import { parseOrThrow } from '@/helpers/validation'
import { withLog } from '@/helpers/with-log'
import {
    createWorkspaceSchema,
    updateWorkspaceSchema,
    addWorkspaceMemberSchema
} from '@/validations/workspaces'

export const WorkspaceModel = {
    /**
     * Encontra um workspace pelo ID
     */
    async findById(id: string) {
        return withLog('WorkspaceModel.findById', () =>
            prisma.workspace.findUnique({ where: { id } })
            , { workspaceId: id })
    },

    /**
     * Lista todos os workspaces
     */
    async findMany(params?: { skip?: number; take?: number }) {
        return withLog('WorkspaceModel.findMany', () =>
            prisma.workspace.findMany({
                skip: params?.skip,
                take: params?.take,
                orderBy: { createdAt: 'desc' }
            })
        )
    },

    /**
     * Lista os workspaces que o usuário participa
     */
    async findByUser(userId: string) {
        return withLog('WorkspaceModel.findByUser', () =>
            prisma.workspace.findMany({
                where: { members: { some: { userId } } }
            })
            , { userId })
    },

    /**
     * Cria um novo workspace
     */
    async create(data: unknown) {
        return withLog('WorkspaceModel.create', () => {
            const parsed = parseOrThrow(createWorkspaceSchema, data)
            return prisma.workspace.create({ data: parsed })
        })
    },

    /**
     * Atualiza um workspace
     */
    async update(id: string, data: unknown) {
        return withLog('WorkspaceModel.update', () => {
            const parsed = parseOrThrow(updateWorkspaceSchema, data)
            return prisma.workspace.update({ where: { id }, data: parsed })
        }, { workspaceId: id })
    },

    /**
     * Remove um workspace
     */
    async delete(id: string) {
        return withLog('WorkspaceModel.delete', () =>
            prisma.workspace.delete({ where: { id } })
            , { workspaceId: id })
    },

    // ---- Modelos associados (Members) ----

    /**
     * Adiciona um membro ao workspace
     */
    async addMember(data: unknown) {
        return withLog('WorkspaceModel.addMember', () => {
            const parsed = parseOrThrow(addWorkspaceMemberSchema, data)
            return prisma.workspaceMember.create({ data: parsed })
        }, { workspaceId: (data as any)?.workspaceId, userId: (data as any)?.userId })
    },

    /**
     * Remove um membro do workspace
     */
    async removeMember(workspaceId: string, userId: string) {
        return withLog('WorkspaceModel.removeMember', () =>
            prisma.workspaceMember.delete({
                where: { workspaceId_userId: { workspaceId, userId } }
            })
            , { workspaceId, userId })
    }
}
