<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Home/Header.vue'
import Footer from '@/components/Home/Footer.vue'
import Content from '@/components/Home/Content.vue'
import Aside from '@/components/Home/Aside.vue'
import 'element-plus/theme-chalk/display.css'

// 顶部高度
const headerHeight = ref(48)
// 底栏高度
const footerHeight = ref(100)
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header :height="headerHeight + 'px'" class="bg-white sticky top-0 z-50">
        <Header/>
      </el-header>
      <el-main class="my-8">
        <template class="flex flex-row">
          <Aside class="hidden-xs-only"/>
          <Content/>
        </template>
      </el-main>
      <el-footer :height="footerHeight + '%'">
        <Footer/>
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
html,
body,
.common-layout,
.el-container {
  padding: 0;
  margin: 0;
}

.el-main {
  padding: 0;
  overflow: visible;
}

.aside {
  overflow: visible;
}

.el-footer {
  padding: 0;
}
</style>