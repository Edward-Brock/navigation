<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCategoryInfo } from '@/apis/admin/category'

let categoryInfo = ref([])

function onCategoryInfo() {
  getCategoryInfo().then((response: any) => {
    // console.log(response)
    categoryInfo.value = response
  })
}

onMounted(() => {
  onCategoryInfo()
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-6">分类管理</h1>
    <el-table :data="categoryInfo" style="width: 100%">
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="name" label="分类名称"/>
      <el-table-column prop="description" label="分类介绍"/>
      <el-table-column prop="pid" label="分类上一级 ID"/>
      <el-table-column prop="order_by" sortable label="分类排序"/>
      <el-table-column prop="visibility" label="分类可见性">
        <template #default="{row}">
          <el-tag
              :type="row.visibility === true ? 'success' : 'danger'">
            {{ row.visibility }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">

</style>