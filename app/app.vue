<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
// 定义 setSeoMeta 函数
const setSeoMeta = (title: string, description: string) => {
  useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description,
  })
}

// 发送 API 请求
const { data, status } = useFetch('/api/option')

// 定义响应式变量
const seoTitle = ref('')
const seoDescription = ref('')

// 监听请求状态和数据变化
watchEffect(() => {
  if (status.value === 'success' && data.value) {
    seoTitle.value = data.value.project_title || ''
    seoDescription.value = data.value.project_description || ''
    setSeoMeta(seoTitle.value, seoDescription.value)
  }
})
</script>
