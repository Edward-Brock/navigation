<template>
  <UContainer>
    <div class="my-3 w-full flex items-center">
      <UIcon
        name="i-lucide-cog"
        class="size-9 mr-1"
      />
      <div class="font-bold text-2xl">
        设置
      </div>
    </div>

    <!-- 设置内容区 -->
    <div>
      <!-- 设置表单 -->
      <UNavigationMenu
        :items="items"
        class="w-full"
      />

      <!-- 嵌套页面 -->
      <NuxtPage />
    </div>
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
