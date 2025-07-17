<template>
  <section
    class="flex flex-col items-center bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700 box-border"
  >
    <header class="text-lg font-light mb-2">
      {{ title }}
    </header>

    <div class="text-3xl font-bold">
      {{ count }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义组件的props，接收标题和统计数值
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
})

const count = ref(props.count)
</script>

<style scoped>

</style>
