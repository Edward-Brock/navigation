<template>
  <UContainer>
    <div>
      <div class="mx-auto max-w-7xl py-6">
        <h1 class="text-3xl font-bold tracking-tight">
          仪表盘
        </h1>
      </div>
    </div>

    <div>
      <UNavigationMenu
        :items="items"
        class="w-full"
      />
    </div>

    <NuxtPage />
  </UContainer>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

useHead({
  title: '仪表盘',
})

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: '首页',
      icon: 'i-lucide-tv-minimal',
      to: '/dashboard',
    },
    {
      label: '分类',
      icon: 'i-lucide-rows-3',
    },
    {
      label: '网站',
      icon: 'i-lucide-link',
    },
  ],
])
</script>

<style scoped>

</style>
