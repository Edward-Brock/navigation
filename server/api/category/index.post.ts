import prisma from '../../utils/prisma'
import * as v from 'valibot'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = v.parse(v.object({
    userId: v.pipe(v.string('用户 ID 不能为空'), v.trim()),
    name: v.pipe(v.string('分类名称不能为空'), v.minLength(1, '分类名称至少包含 1 个字符'), v.maxLength(50, '分类名称最多不超过 50 个字符')),
    description: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(200, '分类描述最多不超过 200 个字符'))),
    icon: v.optional(v.pipe(v.string(), v.trim())),
    isActive: v.optional(v.boolean(), true),
    sortOrder: v.optional(v.number(), 0),
    parentId: v.optional(v.string()),
  }), body)

  // 检查父级分类是否存在
  if (data.parentId) {
    const parent = await prisma.category.findUnique({
      where: { id: data.parentId },
    })
    if (!parent) {
      throw createError({
        statusCode: 404,
        statusMessage: `父级分类 ${data.parentId} 不存在`,
      })
    }
  }

  // 查找分类名称是否存在
  const exists = await prisma.category.findFirst({
    where: {
      userId: data.userId,
      name: data.name,
      deletedAt: null,
    },
  })

  if (exists) {
    throw createError({
      statusCode: 409,
      statusMessage: `已存在 ${data.name} 分类`,
    })
  }

  const category = await prisma.category.create({
    data: {
      userId: data.userId,
      name: data.name,
      description: data.description,
      icon: data.icon,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      parentId: data.parentId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      icon: true,
      isActive: true,
      parent: {
        select: {
          id: true,
          name: true,
        },
      },
      createdAt: true,
    },
  })

  return { success: true, category }
})
