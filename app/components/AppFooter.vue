<template>
  <UContainer class="w-full flex flex-col sm:flex-row justify-between my-10 text-sm text-gray-400 dark:text-gray-500">
    <div class="mb-8 sm:mb-0">
      <div class="mb-4">
        共创建 {{ categoryStore.categoryCount }} 个分类，收藏 {{ categoryStore.websiteCount }} 个网站
      </div>
      <div>
        Copyright © {{ optionStore.nowYear }} {{ optionStore.projectTitle }}
      </div>
      <div v-if="optionStore.projectLicenseUrl && optionStore.projectLicenseType">
        Released under the <ULink
          as="button"
          :to="optionStore.projectLicenseUrl"
        >{{ optionStore.projectLicenseType }}</ULink>
      </div>
      <div v-if="optionStore.error">
        请求配置信息失败，请稍后重试。
      </div>
    </div>
    <div>
      <UButton
        icon="i-lucide-github"
        color="neutral"
        variant="ghost"
        :to="optionStore.projectGithubUrl"
      />

      <ClientOnly v-if="!colorMode?.forced">
        <UButton
          :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
          color="neutral"
          variant="ghost"
          class="ml-2"
          @click="isDark = !isDark"
        />
        <template #fallback>
          <div class="size-8" />
        </template>
      </ClientOnly>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { useOptionStore } from '@/stores/optionStore'

const categoryStore = useCategoryStore()
const optionStore = useOptionStore()
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})

onMounted(async () => {
  await optionStore.loadOptions()
})
</script>

<style scoped>

</style>
