<!-- app/pages/auth/signup.vue -->
<template>
  <main class="flex min-h-svh flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="text-center text-2xl/9 font-bold tracking-tight">
        注册管理员账号
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <UForm
        :schema="v.safeParser(schema)"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <UFormField
          label="昵称"
          name="name"
          required
          size="lg"
          class="block text-sm/6 font-medium text-gray-900"
        >
          <UInput
            v-model="state.name"
            type="text"
            autocomplete="name"
            placeholder="输入昵称"
            icon="i-lucide-user-round"
            class="block w-full text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </UFormField>

        <UFormField
          label="电子邮箱"
          name="email"
          required
          size="lg"
          class="block text-sm/6 font-medium text-gray-900"
        >
          <UInput
            v-model="state.email"
            type="email"
            autocomplete="email"
            placeholder="输入电子邮箱"
            icon="i-lucide-mail"
            class="block w-full text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </UFormField>

        <UFormField
          label="密码"
          name="password"
          required
          size="lg"
          class="block text-sm/6 font-medium text-gray-900"
        >
          <UInput
            v-model="state.password"
            type="password"
            autocomplete="current-password"
            placeholder="输入密码"
            icon="i-lucide-lock"
            class="block w-full text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </UFormField>

        <UButton
          color="neutral"
          type="submit"
          size="lg"
          :loading="isSubmitting"
          :disabled="isLoggedIn"
          class="block w-full font-bold"
        >
          注册
        </UButton>
      </UForm>
    </div>
  </main>
</template>

<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '#ui/types'
import { authClient } from '~/utils/auth-client'

definePageMeta({
  layout: 'single',
})

const schema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email('请输入有效的电子邮箱')),
  password: v.pipe(v.string(), v.trim(), v.minLength(8, '密码最少8个字符'), v.maxLength(32, '密码最多32个字符')),
  name: v.pipe(v.string(), v.trim(), v.minLength(1, '昵称不能为空')),
})

type Schema = v.InferOutput<typeof schema>

// 提交加载状态
const isSubmitting = ref(false)
// 禁用状态
const isLoggedIn = ref(false)

const state = reactive({
  email: '',
  password: '',
  name: '',
})

const toast = useToast()
const router = useRouter()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true // 在提交时设置为 true

  // 用户注册 API 调用
  await authClient.signUp.email({
    email: event.data.email,
    password: event.data.password,
    name: event.data.name,
  }, {
    onSuccess: () => {
      // 登录成功后将 isSubmitting 设置为 false 同时将 isLoggedIn 设置为 true
      isSubmitting.value = false
      isLoggedIn.value = true
      toast.add({
        icon: 'i-heroicons-check-circle',
        title: '注册成功',
        color: 'success',
      })
      router.push('/')
    },
    onError: (ctx) => {
      // 提交失败后将 isSubmitting 设置为 false
      isSubmitting.value = false
      // 处理注册失败错误提示
      toast.add({
        icon: 'i-heroicons-x-circle',
        title: '注册失败',
        description: ctx.error.message,
        color: 'error',
      })
    },
  })
}
</script>

<style scoped>

</style>
