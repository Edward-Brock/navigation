import { PrismaClient } from '../../generated/prisma'

declare global {
  var _prismaClient: PrismaClient | undefined
}

const prisma: PrismaClient = globalThis._prismaClient ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis._prismaClient = prisma
}

export default prisma
