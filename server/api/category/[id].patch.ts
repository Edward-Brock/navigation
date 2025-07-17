// server/api/category/[id].patch.ts
import * as v from 'valibot'
import { auth } from '~/utils/auth'
import prisma from '~/utils/prisma'

// 定义数据校验规则
const schema = v.object({
  name: v.pipe(v.optional(v.string())),
  description: v.pipe(v.optional(v.string())),
  isActive: v.pipe(v.optional(v.boolean())),
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
  const { id } = event.context.params as { id: string }
  const result = v.safeParse(schema, await readBody(event))

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.issues.map(issue => issue.message).join(', '),
    })
  }

  try {
    // 查找分类
    const category = await prisma.category.findUnique({
      where: { id },
    })

    // 确保分类存在且属于该用户
    if (!category || category.userId !== userId) {
      throw createError({ statusCode: 404, message: 'Category not found' })
    }

    // 过滤掉值为 undefined 的字段
    const updateData = Object.fromEntries(
      Object.entries(result.output).filter(([, value]) => value !== undefined),
    )

    // 更新分类
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
    })

    return {
      statusCode: 200,
      data: updatedCategory,
    }
  }
  catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to update category', data: error.message })
  }
})
