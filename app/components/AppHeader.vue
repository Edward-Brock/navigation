<template>
  <Disclosure>
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-14 items-center justify-between">
        <div class="flex flex-none sm:flex-1 items-center justify-center pl-2 sm:pl-0 sm:items-stretch sm:justify-start">
          <nuxt-link to="/">
            <div class="flex shrink-0 items-center">
              <img
                v-if="logoUrl"
                class="h-8 w-auto"
                :src="logoUrl"
                :alt="projectTitle"
              >
              <USkeleton
                v-else
                class="h-6 w-24"
              />
            </div>
          </nuxt-link>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
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
    </div>
  </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure } from '@headlessui/vue'
import { authClient } from '~/utils/auth-client'

const session = authClient.useSession()
const { data: options } = await useFetch('/api/option')
const colorMode = useColorMode()
const logoUrl = ref('')
const projectTitle = ref('')

// 在组件加载时，确保使用系统颜色模式
onMounted(() => {
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')

  // 如果页面第一次加载时用户是深色模式，确保 logo 正确加载
  if (darkModeQuery.matches) {
    colorMode.preference = 'dark' // 设置为深色模式
    logoUrl.value = options.value?.['logo_dark_mode'] || ''
  }
  else {
    colorMode.preference = 'light' // 设置为浅色模式
    logoUrl.value = options.value?.['logo_light_mode'] || ''
  }

  // 获取 project_title 作为 alt 的值
  projectTitle.value = options.value?.['project_title'] || 'Logo'

  // 监听系统颜色模式变化
  darkModeQuery.addEventListener('change', (e) => {
    colorMode.preference = e.matches ? 'dark' : 'light'
    logoUrl.value = e.matches
      ? options.value?.['logo_dark_mode'] || ''
      : options.value?.['logo_light_mode'] || ''
  })
})
</script>

<style scoped>

</style>
