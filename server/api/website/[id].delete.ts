// server/api/website/[id].delete.ts
import { auth } from '~/utils/auth'
import prisma from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session || !session.user) {
    throw createError({ statusCode: 401, message: 'User not authenticated' })
  }

  const userId = session.user.id
  const { id } = event.context.params as { id: string }

  try {
    // 查找网站
    const website = await prisma.website.findUnique({
      where: { id },
    })

    // 确保网站存在且属于该用户
    if (!website || website.userId !== userId) {
      throw createError({ statusCode: 404, message: 'Website not found' })
    }

    // 执行软删除（标记为删除）
    const deletedWebsite = await prisma.website.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return {
      statusCode: 200,
      data: deletedWebsite,
    }
  }
  catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to delete website', data: error.message })
  }
})
