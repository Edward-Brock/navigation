<template>
  <div class="bg-gray-50 dark:bg-gray-800">
    <header class="bg-white dark:bg-gray-900">
      <UContainer>
        <h1 class="h-14 flex items-center overflow-x-auto text-2xl font-bold">
          仪表盘
        </h1>
      </UContainer>
    </header>

    <div class="py-10">
      <UContainer>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
          <StatisticCard
            :title="'分类数量'"
            :count="categoryCount"
          />
          <StatisticCard
            :title="'网站数量'"
            :count="websiteCount"
          />
        </div>
      </UContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: categoryCountData } = await useFetch('/api/category/total-count')
const { data: websiteCountData } = await useFetch('/api/website/total-count')

const categoryCount = computed(() => categoryCountData.value?.data || 0)
const websiteCount = computed(() => websiteCountData.value?.data || 0)
</script>

<style scoped>

</style>
