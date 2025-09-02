import prisma from '../../utils/prisma'
import * as v from 'valibot'

const BodySchema = v.object({
  userId: v.pipe(v.string('用户 ID 不能为空'), v.trim()),
  name: v.optional(v.pipe(v.string('分类名称必须为字符串'), v.trim(), v.minLength(1, '分类名称至少 1 个字符'), v.maxLength(50, '分类名称最多 50 个字符'))),
  description: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(200, '分类描述最多 200 个字符'))),
  icon: v.optional(v.pipe(v.string(), v.trim())),
  isActive: v.optional(v.boolean()),
  sortOrder: v.optional(v.number()),
  parentId: v.optional(v.nullable(v.pipe(v.string(), v.trim()))),
})

type PatchBody = v.InferOutput<typeof BodySchema>

// DTO（返回给前端的字段）
interface CategoryDTO {
  id: string
  name: string
  description: string | null
  icon: string | null
  isActive: boolean
  sortOrder: number | null
  parentId: string | null
  createdAt: Date
  updatedAt: Date
}

// 仅拣选已定义字段，避免把 undefined 写进数据库
function pickDefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const entries = Object.entries(obj) as [string, unknown][]
  const filtered = entries.filter(([, value]) => value !== undefined)
  return Object.fromEntries(filtered) as Partial<T>
}

// 防止将 parentId 设为自己的子孙节点
async function assertNoCycle(targetId: string, nextParentId: string) {
  // 向上追溯父链，若遇到 targetId 则形成环
  let current: string | null = nextParentId
  while (current) {
    if (current === targetId) {
      throw createError({
        statusCode: 400,
        statusMessage: '不能将父级设置为当前分类的子级（会形成环）',
      })
    }
    const p = (await prisma.category.findUnique({
      where: { id: current },
      select: { parentId: true },
    })) as { parentId?: string | null } | null

    current = p?.parentId ?? null
  }
}

export default defineEventHandler(async (event): Promise<{ success: true, category: CategoryDTO }> => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '缺少分类 ID',
    })
  }

  const raw = await readBody(event)
  const data = v.parse(BodySchema, raw) as PatchBody

  // 至少要有 1 个可更新字段
  const hasUpdatable
        = data.name !== undefined
          || data.description !== undefined
          || data.icon !== undefined
          || data.isActive !== undefined
          || data.sortOrder !== undefined
          || data.parentId !== undefined
  if (!hasUpdatable) {
    throw createError({
      statusCode: 400,
      statusMessage: '没有任何可更新字段',
    })
  }

  // 读取原对象
  const current = await prisma.category.findUnique({
    where: { id },
    select: { id: true, userId: true, deletedAt: true },
  })
  if (!current || current.deletedAt) {
    throw createError({
      statusCode: 404,
      statusMessage: '分类不存在',
    })
  }

  // 所有权校验（如传入 userId，则必须匹配）
  if (data.userId && data.userId !== current.userId) {
    throw createError({
      statusCode: 403,
      statusMessage: '无权修改该分类',
    })
  }

  // 若更新 name，校验同用户下唯一且未删除
  if (data.name !== undefined) {
    const dup = await prisma.category.findFirst({
      where: {
        userId: current.userId,
        name: data.name,
        deletedAt: null,
        NOT: { id },
      },
      select: { id: true },
    })
    if (dup) {
      throw createError({
        statusCode: 409,
        statusMessage: `已存在 ${data.name} 分类`,
      })
    }
  }

  // 若更新 parentId，校验父级存在、同属一个用户、不可形成环、不可设为自身
  if (data.parentId !== undefined) {
    if (data.parentId === id) {
      throw createError({
        statusCode: 400,
        statusMessage: '不能将父级设置为自身',
      })
    }
    if (data.parentId !== null) {
      const parent = await prisma.category.findUnique({
        where: { id: data.parentId },
        select: { id: true, userId: true },
      })
      if (!parent) {
        throw createError({
          statusCode: 404,
          statusMessage: '父级分类不存在',
        })
      }
      if (parent.userId !== current.userId) {
        throw createError({
          statusCode: 403,
          statusMessage: '父级分类不属于同一用户',
        })
      }
      await assertNoCycle(id, parent.id)
    }
  }

  // 组织更新数据（只写入已定义字段）
  const updateData = pickDefined({
    name: data.name,
    description: data.description,
    icon: data.icon,
    isActive: data.isActive,
    sortOrder: data.sortOrder,
    // parentId: undefined 表示不更新； null 表示设为顶级
    parentId: Object.prototype.hasOwnProperty.call(data, 'parentId') ? data.parentId : undefined,
  })

  const updated = await prisma.category.update({
    where: { id },
    data: updateData,
    select: {
      id: true, name: true, description: true, icon: true,
      isActive: true, sortOrder: true, parentId: true,
      createdAt: true, updatedAt: true,
    },
  })

  return { success: true, category: updated }
})
