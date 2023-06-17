<script setup lang="ts">
import Header from '../components/Header.vue'
import { ref } from 'vue'
import Footer from '../components/Footer.vue'

// 顶部高度
const headerHeight = ref(48)
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header :height="headerHeight+'px'">
        <Header/>
      </el-header>
      <el-main>
        <Footer/>
      </el-main>
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
</style>