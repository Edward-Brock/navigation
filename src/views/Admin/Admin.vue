<script setup lang="ts">
import Header from '@/components/Home/Header.vue'
import { ref } from 'vue'
import Aside from '@/components/Admin/Aside.vue'
import Main from '@/components/Admin/Main.vue'

// 顶部高度
const headerHeight = ref(48)
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header :height="headerHeight + 'px'" class="bg-white sticky top-0 z-50">
        <Header/>
      </el-header>
      <el-container>
        <el-aside class="hidden-xs-only">
          <Aside/>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="scss">

</style>