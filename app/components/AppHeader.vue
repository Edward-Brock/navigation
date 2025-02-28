<template>
  <UContainer>
    <div class="relative flex h-14 items-center justify-between">
      <div class="flex flex-none sm:flex-1 items-center justify-center pl-3 sm:pl-0 sm:items-stretch sm:justify-start">
        <nuxt-link to="/">
          <div class="flex shrink-0 items-center">
            <img
              v-if="logoUrl"
              class="h-8 w-auto"
              :src="logoUrl"
              :alt="optionStore.projectTitle"
            >
            <USkeleton
              v-else
              class="h-6 w-24"
            />
          </div>
        </nuxt-link>
      </div>
      <div class="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6">
        <template v-if="!session.data">
          <UButton
            class="rounded-full"
            trailing-icon="i-lucide-arrow-right"
            color="neutral"
            variant="ghost"
            size="lg"
            to="/auth/login"
          >
            登录
          </UButton>
        </template>
        <template v-else>
          <UserDropdown />
        </template>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { authClient } from '~/utils/auth-client'
import { useOptionStore } from '@/stores/optionStore'

const session = authClient.useSession()
const optionStore = useOptionStore()
const colorMode = useColorMode()
const logoUrl = ref('')

// 获取 logo 地址的函数
const getLogoUrl = () => {
  return colorMode.value === 'dark'
    ? optionStore.logoDarkMode
    : optionStore.logoLightMode
}

onMounted(() => {
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')

  // 处理系统颜色模式变化的函数
  const handleSystemColorChange = (e: MediaQueryListEvent) => {
    colorMode.preference = e.matches ? 'dark' : 'light'
    logoUrl.value = getLogoUrl()
  }

  // 监听系统颜色模式变化
  darkModeQuery.addEventListener('change', handleSystemColorChange)

  // 组件卸载时移除监听
  onUnmounted(() => {
    darkModeQuery.removeEventListener('change', handleSystemColorChange)
  })

  // 加载配置数据
  const loadOptions = async () => {
    await optionStore.loadOptions()

    // 根据系统颜色模式设置初始主题
    if (darkModeQuery.matches) {
      colorMode.preference = 'dark'
    }
    else {
      colorMode.preference = 'light'
    }

    // 设置初始 logo 地址
    logoUrl.value = getLogoUrl()
  }

  loadOptions()
})

// 监听主题模式变化
watch(colorMode, () => {
  logoUrl.value = getLogoUrl()
})
</script>

<style scoped>

</style>
