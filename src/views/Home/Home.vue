<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Home/Header.vue'
import Footer from '@/components/Home/Footer.vue'
import Content from '@/components/Home/Content.vue'

// 顶部高度
const headerHeight = ref(48)
// 底栏高度
const footerHeight = ref(100)
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header :height="headerHeight + 'px'">
        <Header/>
      </el-header>
      <el-main>
        <Content/>
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
  padding: 20px 0;
}

.el-footer {
  padding: 0;
}
</style>