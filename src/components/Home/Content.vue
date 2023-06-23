<script setup lang="ts">
import { getAllData } from '@/apis/Home'
import { onMounted, ref } from 'vue'

let categoryInfo = ref([])

/**
 * 获取当前所有分类和各自所属的网站信息
 */
const onAllData = async () => {
  await getAllData().then((response: any) => {
    categoryInfo.value = response
    console.log('onAllData ->', categoryInfo.value)
  })
}

onMounted(() => {
  onAllData()
})
</script>

<template>
  <div class="bg-zinc-50mx-auto max-w-full px-4 sm:px-9 lg:px-8 my-8 select-none">
    <div v-for="category in categoryInfo">
      <div class="my-6">
        <div class="text-xl font-black mb-1">{{ category.name }}</div>
        <div class="text-sm text-gray-300">{{ category.description }}</div>
      </div>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        <div v-for="siteInfo in category?.sites">
          <div
              class="group p-3 border-2 border-transparent hover:border-gray-100 rounded-md bg-transparent hover:bg-gray-50 no-underline cursor-pointer">
            <div
                class="font-bold text-gray-400 group-hover:underline decoration-wavy decoration-gray-500 group-hover:text-gray-950">
              {{ siteInfo.name }}
            </div>
            <div class="text-sm text-gray-400">{{ siteInfo.description }}</div>
          </div>
        </div>
      </div>
      <div v-for="category in category?.second_category">
        <div class="my-6 ml-3">
          <div class="text-xl mb-1">{{ category.name }}</div>
          <div class="text-sm text-gray-300">{{ category.description }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <div v-for="site in category?.sites">
            <div
                class="group p-3 border-2 border-transparent hover:border-gray-100 rounded-md bg-transparent hover:bg-gray-50 no-underline cursor-pointer">
              <div
                  class="font-bold text-gray-500 group-hover:underline decoration-wavy decoration-gray-500 group-hover:text-gray-950">
                {{ site.name }}
              </div>
              <div class="text-sm text-gray-400">{{ site.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>