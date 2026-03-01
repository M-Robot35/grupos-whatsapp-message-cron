import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'
import { env } from './env'

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    // Não fazer login automático após registro — usuário é redirecionado para /login
    autoSignIn: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24,     // renova se mais de 1 dia tiver passado
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // cache do cookie por 5 minutos para evitar hits desnecessários no DB
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
        input: false, // não permite o cliente enviar o role no cadastro
      },
    },
  },
})
