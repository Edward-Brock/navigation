<script setup lang="ts">
import { Disclosure } from '@headlessui/vue'
import * as config from '../../../package.json'
import Statistic from '@/components/Home/Statistic.vue'

// 获取 package.json 当前版本号
const version = config.version
// 获取当前版权信息
const copyright = import.meta.env.VITE_APP_COPYRIGHT
</script>

<template>
  <Disclosure>
    <div class="bg-zinc-50 mx-auto max-w-full px-4 sm:px-9 lg:px-8 border-solid border-t-2 border-zinc-100">
      <div class="relative flex items-center justify-between py-8">
        <div class="flex flex-1 items-center sm:items-stretch sm:justify-start">
          <div class="flex flex-col font-mono">
            <div class="mb-4">
              <Statistic/>
            </div>
            <div class="text-xs text-gray-300">
              <div>{{ 'VERSION: ' + version }}</div>
              <div>{{ copyright }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Disclosure>
</template>

<style scoped lang="scss">

</style>