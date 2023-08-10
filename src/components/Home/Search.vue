<script setup lang="ts">
import {onMounted, reactive} from "vue";

/**
 * 搜索引擎列表
 */
let searchSelectArray = [
  {id: "baidu", name: "百度", url: `https://www.baidu.com/s?ie=UTF-8&wd=`},
  {id: "google", name: "Google", url: `https://www.google.com/search?q=`},
  {id: "bing", name: "Bing", url: `https://www.bing.com/search?q=`},
  {id: "wikipedia", name: "Wikipedia", url: "https://zh.wikipedia.org/zh-cn/"},
  {id: "duckduckgo", name: "DuckDuckGo", url: "https://duckduckgo.com/?q="}
]

/**
 * 待搜索的内容
 */
let searchInfo = reactive({
  // 搜索引擎选择
  searchSelect: searchSelectArray[0].id,
  // 待搜索关键字
  keyword: ""
})

/**
 * 监听搜索引擎切换
 * select 切换时自动切换数据
 */
function searchSelectHandleChange() {
  let search = searchSelectArray.find((searchArray: any) => searchArray.id === searchInfo.searchSelect)
  localStorage.setItem("searchSelect", JSON.stringify(search));
  console.log(`搜索引擎数据已切换至 ${search?.name} 并保存`)
}

/**
 * 用户点击按钮或按下 Enter 进行搜索
 */
function toSearch() {
  let search = searchSelectArray.find((searchArray: any) => searchArray.id === searchInfo.searchSelect)
  window.open(search?.url + searchInfo.keyword)
  searchInfo.keyword = ""
}

onMounted(() => {
  /**
   * 判断 localStorage 中是否存在搜索引擎选择记录
   * 如果存在则自动切换到存储的搜索引擎
   */
  if (localStorage.getItem("searchSelect")) {
    console.log("搜索引擎数据存储存在")
    const searchSelect = localStorage.getItem("searchSelect") as string
    searchInfo.searchSelect = JSON.parse(searchSelect)?.id
  }
})
</script>

<template>
  <div class="relative my-8">
    <div class="absolute inset-y-0 left-0 flex items-center">
      <label for="search" class="sr-only">Search Engineer</label>
      <select id="Search" name="search-select" v-model="searchInfo.searchSelect" @change="searchSelectHandleChange"
              class="h-12 rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-4 text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm">
        <option v-for="item in searchSelectArray" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>
    </div>
    <input type="text" name="search" id="search" required autofocus v-model="searchInfo.keyword"
           @keydown.enter="toSearch"
           class="block w-full h-12 p-3 rounded-md border-b-1 px-3.5 py-2 pl-36 pr-20 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600"/>
    <div class="absolute inset-y-0 right-0 flex items-center">
      <button
          class="h-12 rounded-md px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          @click="toSearch">
        搜索
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>