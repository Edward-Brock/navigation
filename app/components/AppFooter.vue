<template>
  <UContainer class="text-sm text-gray-400 dark:text-gray-500">
    <div class="my-10 flex flex-row items-center">
      <div>共创建 {{ categoryStore.categoryCount }} 个分类，收藏 {{ categoryStore.websiteCount }} 个网站</div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/categoryStore'

const categoryStore = useCategoryStore()
</script>

<style scoped>

</style>
