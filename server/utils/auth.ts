import { betterAuth } from 'better-auth'
import { username } from 'better-auth/plugins'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from './prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    username(),
  ],
})
