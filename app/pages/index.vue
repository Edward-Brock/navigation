<template>
  <div>
    <!-- 加载状态 -->
    <section
      v-if="isLoading"
      class="w-full py-10"
    >
      <article
        v-for="i in 3"
        :key="i"
        class="mb-6"
      >
        <header class="flex flex-col items-center sm:items-start">
          <!-- 分类标题骨架 -->
          <USkeleton class="h-8 w-48 rounded" />
          <USkeleton class="h-6 w-64 rounded mt-2" />
        </header>
        <ul class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <li
            v-for="j in 5"
            :key="j"
          >
            <div class="flex flex-col p-3 bg-gray-100 rounded-md">
              <div class="flex pb-3">
                <!-- 网站图标骨架 -->
                <USkeleton class="h-10 w-10 rounded-full" />
                <div class="ml-2">
                  <!-- 网站标题骨架 -->
                  <USkeleton class="h-4 w-32 rounded" />
                  <!-- 网站描述骨架 -->
                  <USkeleton class="h-3 w-48 rounded mt-2" />
                </div>
              </div>
              <!-- 访问数骨架 -->
              <USkeleton class="h-3 w-16 rounded" />
            </div>
          </li>
        </ul>
      </article>
    </section>

    <!-- 错误状态 -->
    <section
      v-if="error"
      class="text-lg font-semibold text-red-500 flex flex-col items-center gap-4 h-screen"
    >
      <p>Error: {{ error.message }}</p>
      <!-- 添加重试按钮 -->
      <button
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        @click="loadCategories"
      >
        Retry
      </button>
    </section>

    <!-- 分类及网站展示 -->
    <section
      v-if="categories.length > 0"
      class="w-full py-10"
    >
      <article
        v-for="category in categories"
        :key="category.id"
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
          class="flex justify-center sm:justify-start text-sm text-gray-400 mt-2"
        >
          <p>No websites available in this category.</p>
        </section>
      </article>
    </section>

    <!-- 如果没有任何分类 -->
    <section
      v-else
      class="text-lg font-semibold text-gray-500"
    >
      <p>No categories or websites found.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

const isLoading = ref(true)
const categories = ref<Category[]>([])
const error = ref<Error | null>(null)

// 获取分类数据
onMounted(async () => {
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

  loadCategories()
})

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
const handleWebsiteClick = async (event: MouseEvent, website: Website) => {
  // 如果是中键点击（button === 1），阻止默认行为
  if (event.button === 1) {
    event.preventDefault() // 阻止中键点击的默认行为
  }
  else {
    // 否则立即导航到目标 URL
    window.location.href = website.url
  }

  // 异步发送更新请求（不阻塞跳转）
  try {
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
