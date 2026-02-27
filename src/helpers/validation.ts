import { ZodSchema, z } from 'zod'

export function parseOrThrow<T>(schema: ZodSchema<T>, payload: unknown): T {
  const parsed = schema.safeParse(payload)

  if (!parsed.success) {
    throw parsed.error
  }

  return parsed.data
}

export function normalizeZodIssues(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join('.') || 'root',
    message: issue.message
  }))
}
