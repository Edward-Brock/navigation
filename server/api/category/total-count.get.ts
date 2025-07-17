// server/api/category/total-count.get.ts
import prisma from '~/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const totalCount = await prisma.category.count({
      where: {
        deletedAt: null,
      },
    })

    return {
      statusCode: 200,
      data: totalCount,
    }
  }
  catch (error: any) {
    console.error('Failed to fetch category total count:', error)
    throw createError({ statusCode: 500, message: 'Failed to fetch category total count', data: error.message })
  }
})
