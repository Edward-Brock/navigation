// server/api/category/[id].get.ts
import { auth } from '~/utils/auth'
import prisma from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session || !session.user) {
    throw createError({ statusCode: 401, message: 'User not authenticated' })
  }

  const id = getRouterParam(event, 'id')

  try {
    // 查找指定ID的分类
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        websites: true,
      },
    })

    if (!category) {
      throw createError({ statusCode: 404, message: 'Category not found' })
    }

    return {
      statusCode: 200,
      data: category,
    }
  }
  catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to fetch category', data: error.message })
  }
})
