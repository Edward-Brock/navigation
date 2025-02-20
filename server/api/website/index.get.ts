// server/api/website/index.get.ts
import { auth } from '~/utils/auth'
import prisma from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const session = await auth.api.getSession({
      headers: event.headers,
    })

    if (!session || !session.user) {
      throw createError({ statusCode: 401, message: 'User not authenticated' })
    }

    const userId = session.user.id // 从会话中获取用户ID

    // 查询所有网站，并排除已删除的网站
    const websites = await prisma.website.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        category: true,
      },
    })

    return {
      statusCode: 200,
      data: websites,
    }
  }
  catch (error: any) {
    console.error('Failed to fetch websites:', error)
    throw createError({ statusCode: 500, message: 'Failed to fetch websites', data: error.message })
  }
})
