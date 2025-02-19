// server/api/category/index.post.ts
import * as v from 'valibot'
import { auth } from '~/utils/auth'
import prisma from '~/utils/prisma'

// 定义数据校验规则
const schema = v.object({
  name: v.pipe(v.string(), v.nonEmpty('分类名称不能为空')),
  description: v.pipe(v.optional(v.string())),
  sortOrder: v.pipe(v.optional(v.number())),
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

  const { name, description, sortOrder } = result.output

  try {
    // 创建新分类
    const newCategory = await prisma.category.create({
      data: {
        userId,
        name,
        description,
        sortOrder,
      },
    })

    return {
      statusCode: 201,
      data: newCategory,
    }
  }
  catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to create category', data: error.message })
  }
})
