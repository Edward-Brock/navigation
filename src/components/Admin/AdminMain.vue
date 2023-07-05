<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getTotalNum } from '@/apis/admin/main/index'

let totalNum = ref([])

function onTotalNum() {
  getTotalNum().then((response: any) => {
    // console.log(response)
    totalNum.value = response
  })
}

onMounted(() => {
  onTotalNum()
})
</script>

<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <dl class="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-2">
        <div v-for="item in totalNum" :key="item['name']" class="mx-auto flex max-w-xs flex-col gap-y-4">
          <dt class="text-base leading-7 text-gray-600">{{ item['name'] }}</dt>
          <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">{{
              item['value']
            }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>