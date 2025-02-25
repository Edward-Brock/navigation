<template>
  <div class="bg-gray-50 dark:bg-gray-800">
    <!-- 分类导航栏（仅在数据加载成功后显示） -->
    <nav
      v-if="categories.length > 0"
      class="sticky top-0 bg-white dark:bg-gray-900 z-50"
    >
      <UContainer>
        <div class="h-14 flex items-center overflow-x-auto scrollbar-hide">
          <UButton
            v-for="category in categories"
            :key="category.id"
            color="neutral"
            variant="link"
            :class="{
              'text-gray-700 dark:text-white font-bold': activeCategoryId === category.id, // 当前分类高亮样式
              'text-gray-400 dark:text-gray-600': activeCategoryId !== category.id, // 默认样式
            }"
            class="cursor-pointer p-4 whitespace-nowrap transition-colors"
            @click="scrollToCategory(category.id)"
          >
            {{ category.name }}
          </UButton>
        </div>
      </UContainer>
    </nav>

    <!-- 加载状态 -->
    <UContainer
      v-if="isLoading"
      class="py-10"
    >
      <article
        v-for="i in 3"
        :key="i"
        class="mb-6"
      >
        <header class="flex flex-col items-center sm:items-start">
          <USkeleton class="h-8 w-48 rounded" />
          <USkeleton class="h-6 w-64 rounded mt-2" />
        </header>
        <ul class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <li
            v-for="j in 5"
            :key="j"
          >
            <div class="flex flex-col p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
              <div class="flex pb-3">
                <USkeleton class="h-10 w-10 rounded-full" />
                <div class="ml-2">
                  <USkeleton class="h-4 w-24 rounded" />
                  <USkeleton class="h-3 w-32 rounded mt-2" />
                </div>
              </div>
              <USkeleton class="h-3 w-16 rounded" />
            </div>
          </li>
        </ul>
      </article>
    </UContainer>

    <!-- 错误状态 -->
    <section
      v-if="error"
      class="text-lg font-semibold text-red-500 flex flex-col items-center gap-4 h-screen"
    >
      <p>Error: {{ error.message }}</p>
      <button
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        @click="loadCategories"
      >
        Retry
      </button>
    </section>

    <!-- 分类及网站展示 -->
    <UContainer
      v-if="categories.length > 0"
      class="py-10"
    >
      <article
        v-for="category in categories"
        :key="category.id"
        :ref="(el) => setCategoryRef(category.id, el)"
        class="mb-6"
      >
        <!-- 分类标题 -->
        <header class="flex flex-col items-center sm:items-start">
          <div class="text-3xl font-light">
            <span class="mr-2">{{ category.name }}</span>
          </div>
          <div
            v-if="category.description"
            class="text-xl font-light"
          >
            {{ category.description }}
          </div>
        </header>

        <!-- 只在有网站时展示 -->
        <section v-if="category.websites && category.websites.length > 0">
          <ul class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <li
              v-for="website in category.websites"
              :key="website.id"
            >
              <ULink
                :to="website.url"
                rel="noopener noreferrer"
                @mousedown="(event) => handleWebsiteClick(event, website)"
              >
                <div class="flex flex-col p-3 bg-none hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-md border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50 box-border">
                  <div class="flex pb-3">
                    <div>
                      <UAvatar
                        :src="website.favicon as string"
                        :alt="website.title"
                        class="mr-2"
                      />
                    </div>
                    <div>
                      <p class="font-bold">{{ website.title }}</p>
                      <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                        {{ website.description || 'No description available' }}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div class="flex flex-row items-center justify-end text-gray-500/50">
                      <UIcon
                        name="i-lucide-eye"
                        class="size-4 mr-1"
                      />
                      <p class="text-xs">{{ website.visitCount }}</p>
                    </div>
                  </div>
                </div>
              </ULink>
            </li>
          </ul>
        </section>

        <!-- 如果网站不存在显示内容 -->
        <section
          v-else
          class="flex justify-center sm:justify-start text-sm text-gray-400 mt-4"
        >
          <p>No websites available in this category.</p>
        </section>
      </article>
    </UContainer>

    <!-- 如果没有任何分类 -->
    <UContainer
      v-else
      class="flex items-center justify-center h-dvh text-lg font-semibold text-gray-500"
    >
      <p>No categories or websites found.</p>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 定义接口
interface Website {
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

interface Category {
  id: string
  userId: string
  name: string
  description: string | null
  isActive: boolean
  sortOrder: number | null
  websites: Website[]
}

// 响应式状态
const isLoading = ref(true)
const categories = ref<Category[]>([])
const error = ref<Error | null>(null)
const navHeight = ref(0)
const activeCategoryId = ref<string | null>(null)
const categoryRefs = ref<Record<string, HTMLElement>>({})

// 设置分类区域的引用
const setCategoryRef = (id: string, el: HTMLElement) => {
  if (el) {
    categoryRefs.value[id] = el
  }
}

// 跳转到指定分类区域
const scrollToCategory = (id: string) => {
  const categoryElement = categoryRefs.value[id]
  if (categoryElement) {
    const elementPosition = categoryElement.getBoundingClientRect().top + window.scrollY
    const offset = navHeight.value + 70 // 导航栏高度 + 额外偏移量
    window.scrollTo({
      top: elementPosition - offset, // 减去导航栏高度和额外偏移量
      behavior: 'smooth',
    })
    activeCategoryId.value = id // 设置当前激活的分类
  }
}

// 监听滚动事件，更新当前激活的分类
const handleScroll = () => {
  const navBottom = window.scrollY + navHeight.value // 导航栏底部位置

  // 找到第一个超过导航栏底部的分类
  let newActiveCategoryId: string | null = null
  for (const [id, element] of Object.entries(categoryRefs.value)) {
    const { top } = element.getBoundingClientRect()
    const elementTop = top + window.scrollY // 转换为页面绝对位置

    if (elementTop > navBottom) {
      // 如果分类标题的顶部超过导航栏底部，则设置为当前激活的分类
      newActiveCategoryId = id
      break
    }
  }

  // 更新当前激活的分类
  activeCategoryId.value = newActiveCategoryId
}

// 获取分类数据
const loadCategories = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await fetch('/api/category')
    const { statusCode, data } = await response.json()

    if (statusCode !== 200 || !Array.isArray(data)) {
      throw new Error('Failed to load categories')
    }

    categories.value = data
  }
  catch (err: any) {
    error.value = err
    console.error('Failed to load categories:', err)
  }
  finally {
    isLoading.value = false
  }
}

// 处理网站点击事件
const handleWebsiteClick = async (event: Event, website: Website) => {
  try {
    // 发送更新访问数的请求
    const response = await fetch(`/api/website/${website.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitCount: (website.visitCount || 0) + 1, // 增加访问数
        lastVisitedAt: new Date().toISOString(), // 更新最后一次访问时间
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to update visit count')
    }

    // 解析响应数据
    const { data: updatedWebsite } = await response.json()

    // 更新本地数据
    const category = categories.value.find(cat => cat.id === website.categoryId)
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
}

// 组件挂载时初始化
onMounted(async () => {
  try {
    // 获取导航栏高度
    const navElement = document.querySelector('nav')
    if (navElement) {
      navHeight.value = navElement.clientHeight

      // 监听导航栏高度变化
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          navHeight.value = entry.contentRect.height
        }
      })
      resizeObserver.observe(navElement)
    }

    // 监听滚动事件
    window.addEventListener('scroll', handleScroll)

    // 加载分类数据
    await loadCategories()
  }
  catch (err: any) {
    error.value = err
    console.error('Failed to initialize:', err)
  }
})

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 限制行数的文本溢出 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
