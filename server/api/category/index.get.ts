// server/api/category/index.get.ts
import prisma from '~/utils/prisma'

export default defineEventHandler(async () => {
  try {
    // 查询 Option 表中的 'default_user_id' 选项
    const defaultUserIdOption = await prisma.option.findUnique({
      where: {
        name: 'default_user_id', // 根据 name 查找标识为 default_user_id 的记录
      },
    })

    // 如果没有找到该记录，返回错误或使用默认用户ID
    if (!defaultUserIdOption || !defaultUserIdOption.value) {
      throw createError({ statusCode: 500, message: 'Default User ID not set in option' })
    }

    // 获取默认用户ID
    const defaultUserId = defaultUserIdOption.value

    // 查询所有属于该用户的分类，并排除已删除的分类
    const categories = await prisma.category.findMany({
      where: {
        userId: defaultUserId,
        deletedAt: null,
      },
      orderBy: [{
        sortOrder: 'asc',
      }, {
        createdAt: 'asc',
      }],
      include: {
        websites: true,
      },
    })

    return {
      statusCode: 200,
      data: categories,
    }
  }
  catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to fetch categories', data: error.message })
  }
})
