<script setup lang="ts">
import { getAllData, findOne } from '@/apis/home'
import { onMounted, Ref, ref, UnwrapRef } from 'vue'
import eventBus from '@/utils/eventBus'

let categoryInfo: Ref<UnwrapRef<any[]>> = ref([])
let defaultLogoUrl = import.meta.env.VITE_APP_LOGO_DEFAULT_URL

/**
 * 点击跳转网站
 */
function refreshTo(data: any) {
  // console.log(data);
  window.open(data.url);

  /**
   * 统计跳转网站访问次数并将该网站浏览数本地加一，优化显示体验
   */
  findOne(data.id)
  data.visit_num += 1
}

/**
 * 获取当前所有分类和各自所属的网站信息
 */
const onAllData = () => {
  getAllData().then((response: any) => {
    // console.log(response)
    categoryInfo.value = response
    eventBus.emit('allDataInfo', categoryInfo.value)
  })
}

onMounted(() => {
  onAllData()
})

</script>

<template>
  <div class="w-full px-4 sm:px-9 lg:px-8 select-none">
    <template v-for="(categoryGroup, index) in categoryInfo">
      <!-- 一级目录 -->
      <div class="my-6">
        <div :id="'tag' + index" class="text-xl font-black mb-1">{{ categoryGroup['name'] }}</div>
        <div class="text-sm text-gray-300">{{ categoryGroup['description'] }}</div>
      </div>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <template v-for="site in categoryGroup['sites']">
          <div
              class="group p-3 border-2 border-transparent hover:border-gray-100 rounded-md bg-transparent hover:bg-gray-50 no-underline cursor-pointer"
              @click="refreshTo(site)">
            <div class="flex flex-row items-center mb-2">
              <!-- 网站名称 -->
              <div
                  class="font-bold text-gray-400 w-3/4 group-hover:underline decoration-wavy decoration-gray-950 group-hover:text-gray-950">
                {{ site['name'] }}
              </div>
              <!-- 网站 Logo -->
              <div
                  class="w-9 h-9 flex justify-center items-center rounded-full overflow-hidden opacity-0 group-hover:opacity-100">
                <img :src="site.logo ? site.logo : defaultLogoUrl" :alt="site.name">
              </div>
            </div>
            <!-- 网站描述 -->
            <div class="text-sm text-gray-400 truncate" :title="site['description']">{{ site['description'] }}</div>
            <!-- 网站访问数 -->
            <div class="text-xs font-light text-gray-200 mt-2 z-20">{{ site['visit_num'] + ' 次访问' }}</div>
          </div>
        </template>
      </div>
      <!-- 二级目录 -->
      <div v-for="(category, index) in categoryGroup['second_category']">
        <div class="my-6 ml-3">
          <div :id="'tag_second' + index" class="text-xl mb-1">{{ category['name'] }}</div>
          <div class="text-sm text-gray-300">{{ category['description'] }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div v-for="site in category?.sites">
            <div
                class="group relative p-3 border-2 border-transparent hover:border-gray-100 rounded-md bg-transparent hover:bg-gray-50 no-underline cursor-pointer"
                @click="refreshTo(site)">
              <!-- 网站 Logo -->
              <div
                  class="absolute top-1 right-2 w-9 h-9 flex justify-center items-center rounded-full overflow-hidden opacity-0 group-hover:opacity-100">
                <img :src="site.logo ? site.logo : defaultLogoUrl" :alt="site.name">
              </div>
              <!-- 网站名称 -->
              <div
                  class="font-bold text-gray-400 mb-2 w-3/4 group-hover:underline decoration-wavy decoration-gray-950 group-hover:text-gray-950">
                {{ site['name'] }}
              </div>
              <!-- 网站描述 -->
              <div class="text-sm text-gray-400 truncate" :title="site['description']">{{ site['description'] }}</div>
              <!-- 网站访问数 -->
              <div class="text-xs font-light text-gray-200 mt-2">{{ site['visit_num'] + ' 次访问' }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">

</style>