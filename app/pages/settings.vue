<template>
  <UContainer>
    <div class="flex items-center mx-auto max-w-7xl py-6">
      <h1 class="text-3xl font-bold tracking-tight">
        设置
      </h1>
    </div>

    <!-- 设置表单 -->
    <UNavigationMenu
      :items="items"
      class="w-full"
    />

    <!-- 嵌套页面 -->
    <NuxtPage />
  </UContainer>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: '个人信息',
      icon: 'i-lucide-user',
      to: '/settings/profile',
    },
    {
      label: '密码',
      icon: 'i-lucide-lock',
      to: '/settings/password',
    },
  ],
])
</script>

<style scoped>

</style>
