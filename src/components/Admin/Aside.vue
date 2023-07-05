<script setup lang="ts">
const asideMenu = [
  {id: 1, name: '分类管理', url: ''},
  {id: 2, name: '添加分类', url: ''},
  {id: 3, name: '网站管理', url: ''},
  {id: 4, name: '添加网站', url: ''},
]

function onJump(item) {
  console.log(item)
}
</script>

<template>
  <div class="w-64 max-w-xs h-full px-4 sm:px-9 lg:px-8 select-none text-gray-400 sticky top-14">
    <el-scrollbar class="w-48" height="calc(100vh - 80px)">
      <template v-for="item in asideMenu">
        <div
            class="my-3 p-3 pl-6 font-bold border-2 border-transparent hover:border-gray-300 rounded-full hover:text-gray-950"
            @click="onJump(item)">
          {{ item.name }}
        </div>
      </template>
    </el-scrollbar>
  </div>
</template>

<style scoped lang="scss">
.common-layout {
  padding: 20px;
  box-sizing: border-box;
}
</style>