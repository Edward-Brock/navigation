// server/api/option/index.get.ts
import { defineEventHandler, createError } from 'h3'
import prisma from '~/utils/prisma'

// 定义 Option 类型
interface OptionType {
  name: string
  value: string | null
}

// 定义 API 处理函数
export default defineEventHandler(async () => {
  try {
    // 使用 Prisma 查询 autoload 为 true 的选项
    const options = await prisma.option.findMany({
      where: {
        autoload: true,
      },
    })

    // 创建一个用于存储选项的映射对象
    const optionMap: Record<string, string | null> = {}

    // 遍历查询结果，将选项添加到映射对象中
    options.forEach((option: OptionType) => {
      optionMap[option.name] = option.value
    })

    // 返回选项映射对象
    return optionMap
  }
  catch (error) {
    console.error('Error loading options:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load options' })
  }
})
