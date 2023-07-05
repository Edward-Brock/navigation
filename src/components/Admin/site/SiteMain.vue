<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getSiteInfo } from '@/apis/admin/site'

let siteInfo = ref([])

function onSiteInfo() {
  getSiteInfo().then((response: any) => {
    // console.log(response)
    siteInfo.value = response
  })
}

onMounted(() => {
  onSiteInfo()
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-6">网站管理</h1>
    <el-table :data="siteInfo" style="width: 100%">
      <el-table-column prop="id" label="ID" align="center" width="50"/>
      <el-table-column prop="name" label="网站名称" align="center" show-overflow-tooltip/>
      <el-table-column prop="description" label="网站介绍" align="center" show-overflow-tooltip/>
      <el-table-column prop="url" label="网站网址" align="center" show-overflow-tooltip/>
      <el-table-column prop="logo" label="网站 Logo" width="100" show-overflow-tooltip>
        <template #default="{row}">
          <el-popover placement="top-start" trigger="hover">
            <template #reference>
              <img slot="reference" :src="row.logo" style="width: 30px; height: 100%"
                   :alt="row.name"/>
            </template>
            <img :src="row.logo" :alt="row.name"/>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="visit_num" label="网站浏览量" align="center" width="100"/>
      <el-table-column prop="visibility" label="网站可见性" align="center" width="100">
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