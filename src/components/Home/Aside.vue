<script setup lang="ts">
import eventBus from '@/utils/eventBus.ts'
import {onMounted, ref} from 'vue'

let categoryInfo = ref()

onMounted(() => {
  /**
   * 从 Content.vue 页面中接收分类与网站信息
   */
  eventBus.on('allDataInfo', (response) => {
    // console.log('allDataInfo ->', response)
    categoryInfo.value = response
  })
})

/**
 * 获取并拼接当前需要点击跳转到的标签处
 * @param selector
 */
function goAnchor(selector: any) {
  // console.log(selector)
  document.querySelector(selector).scrollIntoView();
}
</script>

<template>
  <aside class="w-64 max-w-xs h-full px-4 sm:px-9 lg:px-8 select-none text-gray-400 sticky top-0">
    <el-scrollbar class="w-48" height="100vh">
      <template v-for="category in categoryInfo">
        <div
            class="my-3 p-3 pl-6 font-bold border-2 border-transparent hover:border-gray-300 rounded-full hover:text-gray-950"
            @click="goAnchor(`#tag_${category.id}`)">
          {{ category.name }}
        </div>
        <template v-for="second_category in category['second_category']">
          <div class="my-3 p-3 pl-9 border-2 border-transparent hover:border-gray-300 rounded-full hover:text-gray-950"
               @click="goAnchor(`#tag_second_${second_category.id}`)">
            {{ second_category.name }}
          </div>
        </template>
      </template>
    </el-scrollbar>
  </aside>
</template>

<style scoped lang="scss">

</style>