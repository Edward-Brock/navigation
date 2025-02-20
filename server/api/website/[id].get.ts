// server/api/website/[id].get.ts
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
    // 查找指定ID的网站
    const website = await prisma.website.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    if (!website) {
      throw createError({ statusCode: 404, message: 'Website not found' })
    }

    return {
      statusCode: 200,
      data: website,
    }
  }
  catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to fetch website', data: error.message })
  }
})
