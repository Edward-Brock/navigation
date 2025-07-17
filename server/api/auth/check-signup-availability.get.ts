// server/api/auth/check-signup-availability.get.ts
import { defineEventHandler } from 'h3'
import prisma from '~/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const userCount = await prisma.user.count()
    // 如果 userCount 为 0，说明表中没有用户，此时 canRegister 为 true
    return {
      canRegister: userCount === 0,
    }
  }
  catch (error) {
    console.error('Error checking user existence:', error)
    return {
      canRegister: false,
    }
  }
})
