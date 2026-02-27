import { env } from './env'

export const authConfig = {
  secret: env.BETTER_AUTH_SECRET,
  providers: []
}
