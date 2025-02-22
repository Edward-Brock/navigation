// server/api/website/[id].patch.ts
import * as v from 'valibot'
import { auth } from '~/utils/auth'
import prisma from '~/utils/prisma'

// 定义数据校验规则
const schema = v.object({
  categoryId: v.pipe(v.optional(v.string())),
  url: v.pipe(v.optional(v.string())),
  title: v.pipe(v.optional(v.string())),
  description: v.pipe(v.optional(v.string())),
  favicon: v.pipe(v.optional(v.string())),
  isFavorite: v.pipe(v.optional(v.boolean())),
  sortOrder: v.pipe(v.optional(v.number())),
  visitCount: v.pipe(v.optional(v.number())),
  lastVisitedAt: v.pipe(v.optional(v.string())),
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
    // 查找网站
    const website = await prisma.website.findUnique({
      where: { id },
    })

    // 确保网站存在且属于该用户
    if (!website || website.userId !== userId) {
      throw createError({ statusCode: 404, message: 'Website not found' })
    }

    // 过滤掉值为 undefined 的字段
    const updateData = Object.fromEntries(
      Object.entries(result.output).filter(([, value]) => value !== undefined),
    )

    // 更新分类
    const updatedWebsite = await prisma.website.update({
      where: { id },
      data: updateData,
    })

    return {
      statusCode: 200,
      data: updatedWebsite,
    }
  }
  catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to update website', data: error.message })
  }
})
