import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  WA_PROVIDER: z.enum(['evolution', 'meta', 'opensource']).default('evolution'),

  // -- Evolution API Credentials --
  EVOLUTION_API_URL: z.string().url().default('http://localhost:8080'),
  EVOLUTION_API_KEY: z.string().min(1).default('INSERT_GLOBAL_API_KEY_HERE')
})

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  STORAGE_DRIVER: process.env.STORAGE_DRIVER,
  WA_PROVIDER: process.env.WA_PROVIDER,
  EVOLUTION_API_URL: process.env.EVOLUTION_API_URL,
  EVOLUTION_API_KEY: process.env.EVOLUTION_API_KEY
})
