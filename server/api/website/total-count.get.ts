// server/api/website/total-count.get.ts
import prisma from '~/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const totalCount = await prisma.website.count({
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
    console.error('Failed to fetch website total count:', error)
    throw createError({ statusCode: 500, message: 'Failed to fetch website total count', data: error.message })
  }
})
