import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  WA_PROVIDER: z.enum(['evolution', 'meta', 'opensource']).default('evolution')
})

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  STORAGE_DRIVER: process.env.STORAGE_DRIVER,
  WA_PROVIDER: process.env.WA_PROVIDER
})
