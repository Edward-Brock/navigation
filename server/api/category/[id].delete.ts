// server/api/category/[id].delete.ts
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
    // 查找分类
    const category = await prisma.category.findUnique({
      where: { id },
    })

    // 确保分类存在且属于该用户
    if (!category || category.userId !== userId) {
      throw createError({ statusCode: 404, message: 'Category not found' })
    }

    // 执行软删除（标记为删除）
    const deletedCategory = await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return {
      statusCode: 200,
      data: deletedCategory,
    }
  }
  catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to delete category', data: error.message })
  }
})
