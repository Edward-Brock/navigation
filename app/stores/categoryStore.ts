// app/stores/categoryStore.ts
import { defineStore } from 'pinia'

// 定义接口
export interface Website {
  id: string
  categoryId: string
  userId: string
  url: string
  title: string
  description: string | null
  favicon: string | null
  isFavorite: boolean
  sortOrder: number | null
  visitCount: number
  lastVisitedAt: Date | null
  lastModifiedAt: Date | null
}

export interface Category {
  id: string
  userId: string
  name: string
  description: string | null
  isActive: boolean
  sortOrder: number | null
  websites: Website[]
}

const fetchData = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export const useCategoryStore = defineStore('category', {
  state: () => ({
    isLoading: true,
    categories: [] as Category[],
    error: null as Error | null,
    navHeight: 0,
    activeCategoryId: null as string | null,
    categoryRefs: {} as Record<string, HTMLElement>,
  }),
  getters: {
    // 计算分类数
    categoryCount(): number {
      return this.categories.length
    },
    // 计算网站数
    websiteCount(): number {
      let count = 0
      this.categories.forEach((category) => {
        count += category.websites.length
      })
      return count
    },
  },
  actions: {
    // 设置分类区域的引用
    setCategoryRef(id: string, el: HTMLElement) {
      if (el) {
        this.categoryRefs[id] = el
      }
    },
    // 跳转到指定分类区域
    scrollToCategory(id: string) {
      const categoryElement = this.categoryRefs[id]
      if (categoryElement) {
        const elementPosition = categoryElement.getBoundingClientRect().top + window.scrollY
        const offset = this.navHeight + 70 // 导航栏高度 + 额外偏移量
        window.scrollTo({
          top: elementPosition - offset, // 减去导航栏高度和额外偏移量
          behavior: 'smooth',
        })
        this.activeCategoryId = id // 设置当前激活的分类
      }
    },
    // 监听滚动事件，更新当前激活的分类
    handleScroll() {
      const navBottom = window.scrollY + this.navHeight // 导航栏底部位置

      // 找到第一个超过导航栏底部的分类
      let newActiveCategoryId: string | null = null
      for (const [id, element] of Object.entries(this.categoryRefs)) {
        const { top } = element.getBoundingClientRect()
        const elementTop = top + window.scrollY // 转换为页面绝对位置

        if (elementTop > navBottom) {
          // 如果分类标题的顶部超过导航栏底部，则设置为当前激活的分类
          newActiveCategoryId = id
          break
        }
      }

      // 更新当前激活的分类
      this.activeCategoryId = newActiveCategoryId
    },
    // 获取分类数据
    async loadCategories() {
      this.isLoading = true
      this.error = null

      try {
        const { statusCode, data } = await fetchData('/api/category')

        if (statusCode !== 200 || !Array.isArray(data)) {
          throw new Error('Failed to load categories')
        }

        this.categories = data
      }
      catch (err: any) {
        this.error = err
        console.error('Failed to load categories:', err)
      }
      finally {
        this.isLoading = false
      }
    },
    // 处理网站点击事件
    async handleWebsiteClick(event: Event, website: Website) {
      try {
        // 发送更新访问数的请求
        const { data: updatedWebsite } = await fetchData(`/api/website/${website.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visitCount: (website.visitCount || 0) + 1, // 增加访问数
            lastVisitedAt: new Date().toISOString(), // 更新最后一次访问时间
          }),
        })

        // 更新本地数据
        const category = this.categories.find(cat => cat.id === website.categoryId)
        if (category) {
          const websiteIndex = category.websites.findIndex(ws => ws.id === website.id)
          if (websiteIndex !== -1) {
            category.websites[websiteIndex] = updatedWebsite
          }
        }
      }
      catch (err) {
        console.error('Failed to update visit count:', err)
      }
    },
  },
})
