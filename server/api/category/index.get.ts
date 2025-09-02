import prisma from '../../utils/prisma'
import * as v from 'valibot'

/**
 * 分类带计数的类型
 */
type CategoryWithCount = {
  id: string
  name: string
  description: string | null
  icon: string | null
  isActive: boolean
  sortOrder: number | null
  parentId: string | null
  createdAt: Date
  updatedAt: Date
  _count: { Website: number }
}

/**
 * 定义分类树节点类型
 */
interface CategoryTreeNode {
  id: string
  name: string
  description?: string | null
  icon?: string | null
  isActive: boolean
  sortOrder?: number | null
  parentId?: string | null
  createdAt: Date
  updatedAt: Date
  websiteCount: number
  childrenCount: number
  children: CategoryTreeNode[]
}

/**
 * 构建分类树（递归方式，使用 Map 提升性能）
 */
function buildTree(
  categories: CategoryWithCount[],
  parentId: string | null,
  depth: number,
  maxDepth: number | null,
  grouped: Map<string | null, CategoryWithCount[]>,
): CategoryTreeNode[] {
  if (maxDepth !== null && depth > maxDepth) return []

  const nodes = grouped.get(parentId) || []

  return nodes.map((cat) => {
    const children = buildTree(categories, cat.id, depth + 1, maxDepth, grouped)
    return {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
      parentId: cat.parentId,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
      websiteCount: cat._count.Website,
      childrenCount: children.length,
      children,
    }
  })
}

/**
 * Query 参数校验 schema
 */
const querySchema = v.object({
  userId: v.optional(v.string()),
  includeDeleted: v.optional(v.boolean()),
  depth: v.optional(v.number()),
})

export default defineEventHandler(async (event) => {
  const rawQuery = getQuery(event)

  const query = v.parse(querySchema, {
    userId: rawQuery.userId,
    includeDeleted: rawQuery.includeDeleted === 'true',
    depth: rawQuery.depth ? Number(rawQuery.depth) : undefined,
  })

  const categories: CategoryWithCount[] = await prisma.category.findMany({
    where: {
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.includeDeleted ? {} : { deletedAt: null }),
    },
    orderBy: [
      { sortOrder: 'asc' },
    ],
    select: {
      id: true,
      name: true,
      description: true,
      icon: true,
      isActive: true,
      sortOrder: true,
      parentId: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { Website: true } },
    },
  })

  // 构建 parentId -> 分类列表 的映射
  const grouped = new Map<string | null, typeof categories>()
  categories.forEach((cat) => {
    const list = grouped.get(cat.parentId ?? null) || []
    list.push(cat)
    grouped.set(cat.parentId ?? null, list)
  })

  // 构建树状结构
  const tree = buildTree(categories, null, 1, query.depth ?? null, grouped)

  return { success: true, categories: tree }
})
