<script setup lang="ts">
import { reactive, watch } from 'vue'
import { getPassword } from '@/apis/login'
import alarmSound from "../assets/alarm.wav";
import router from '@/router'
import { useLoginStore } from "@/stores/login";
import {ElMessage} from "element-plus";

const auth = useLoginStore()

let form = reactive({
  password: "",
  btn_disabled: true,
})

/**
 * 侦听 form 表单内 password 是否为空
 * 有数据则将按钮禁用置为假
 * 无数据则将按钮禁用置为真
 */
watch(() => form.password, () => {
  form.btn_disabled = !form.password;
})

/**
 * 控制面板密码验证
 */
function checkPassword() {
  getPassword(form.password).then((response: any) => {
    // console.log(response)
    /**
     * 判断 response.code
     * 200 验证成功
     * 404 验证失败
     */
    switch (response['code']) {
      case 200:
        ElMessage({
          message: '验证成功',
          type: 'success',
        })
        // 验证成功并跳转至 admin 页面
        router.push({name: 'admin'})
        auth.setAuthenticated(true)
        break;
      case 404:
        ElMessage.error(response['message'])
        // 验证失败并调用播放警示音
        alarm()
        break;
    }
  })
}

/**
 * 验证密钥出现错误时，用于播放警报音
 */
function alarm() {
  // 报警音路径
  const audio = new Audio(alarmSound);
  // 执行播放警报方法
  audio.play();
}
</script>

<template>
  <div class="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="@/assets/logo_396_118_black.png"
           alt="booop navigation logo"/>
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">控制面板验证</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">验证密钥</label>
        </div>
        <div class="mt-2">
          <input id="password" name="password" v-model="form.password" type="password" @keydown.enter="checkPassword()"
                 required
                 autofocus
                 :minlength="4"
                 class="block text-center w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>

      <div>
        <button
            type="button"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            :disabled="form.btn_disabled"
            @click="checkPassword()">
          验证
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">

</style>