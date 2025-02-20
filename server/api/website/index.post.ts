// server/api/website/index.post.ts
import * as v from 'valibot'
import { auth } from '~/utils/auth'
import prisma from '~/utils/prisma'

// 定义验证规则
const schema = v.object({
  categoryId: v.pipe(v.string(), v.nonEmpty('Category ID is required')),
  url: v.pipe(v.string(), v.nonEmpty('URL is required')),
  title: v.pipe(v.string(), v.nonEmpty('Title is required')),
  description: v.optional(v.string()),
  favicon: v.optional(v.string()),
  isFavorite: v.optional(v.boolean()),
  sortOrder: v.optional(v.number()),
})

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session || !session.user) {
    throw createError({ statusCode: 401, message: 'User not authenticated' })
  }

  const userId = session.user.id
  const result = v.safeParse(schema, await readBody(event))

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.issues.map(issue => issue.message).join(', '),
    })
  }

  const { categoryId, url, title, description, favicon, sortOrder, isFavorite } = result.output

  try {
    // 确保分类存在并属于该用户
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category || category.userId !== userId) {
      throw createError({ statusCode: 404, message: 'Category not found or unauthorized' })
    }

    // 创建新网站
    const newWebsite = await prisma.website.create({
      data: {
        userId,
        categoryId,
        url,
        title,
        description,
        favicon,
        sortOrder,
        isFavorite,
      },
    })

    return {
      statusCode: 201,
      data: newWebsite,
    }
  }
  catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to create website', data: error.message })
  }
})
