// server/api/category/index.get.ts
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

  try {
    // 查询所有属于该用户的分类，并排除已删除的分类
    const categories = await prisma.category.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: [{
        sortOrder: 'desc',
      }, {
        createdAt: 'asc',
      }],
      include: {
        websites: true,
      },
    })

    return {
      statusCode: 200,
      data: categories,
    }
  }
  catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to fetch categories', data: error.message })
  }
})
