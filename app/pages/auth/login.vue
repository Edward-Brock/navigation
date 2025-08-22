<template>
  <UContainer
    as="main"
    class="h-[calc(100dvh-48px)]"
  >
    <div class="h-full flex flex-col items-center justify-center">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="text-center text-2xl/9 font-bold">
          登录你的账户
        </h2>
      </div>

      <div class="mt-10 w-full sm:mx-auto sm:w-full sm:max-w-sm">
        <UForm
          :schema="schema"
          :state="state"
          :disabled="isLoggedIn"
          class="space-y-6"
          @submit="onSubmit"
        >
          <UFormField
            label="用户名"
            name="username"
            required
          >
            <UInput
              v-model="state.username"
              type="text"
              autocomplete="username"
              placeholder="输入用户名"
              icon="i-lucide-at-sign"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="密码"
            name="password"
            required
          >
            <UInput
              v-model="state.password"
              type="password"
              autocomplete="current-password"
              placeholder="输入密码"
              icon="i-lucide-lock"
              class="w-full"
            />
          </UFormField>

          <UButton
            block
            type="submit"
            :loading="isLoggedIn"
            class="w-full cursor-pointer"
          >
            登录
          </UButton>
        </UForm>

        <div class="mt-10 text-center text-sm/6 text-gray-500">
          还没有账号？
          <UButton
            trailing-icon="i-lucide-arrow-right"
            color="neutral"
            variant="link"
            to="/auth/signup"
          >
            立即注册
          </UButton>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  hideUserMenu: true, // 隐藏 Header 内的用户信息区域
})

useHead({
  title: '登录',
})

const schema = v.object({
  username: v.pipe(v.string(), v.trim(), v.minLength(3, '至少包含 3 个字符'), v.maxLength(30, '最多不超过 30 个字符')),
  password: v.pipe(v.string(), v.trim(), v.minLength(8, '必须至少包含 8 个字符'), v.maxLength(32, '最多不超过 32 个字符')),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  username: '',
  password: '',
})

/**
 * 登录时禁用表单内数据及状态变更
 * 为 true 时禁用输入框及按钮状态变更
 * 登录按钮显示加载状态
 */
const isLoggedIn = ref(false)

const toast = useToast()
const router = useRouter()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoggedIn.value = true
  await authClient.signIn.username({
    username: event.data.username,
    password: event.data.password,
  }, {
    onSuccess: () => {
      toast.add({
        icon: 'i-heroicons-check-circle',
        title: '登录成功',
        color: 'success',
      })
      router.push('/')
    },
    onError: (ctx) => {
      isLoggedIn.value = false
      toast.add({
        icon: 'i-heroicons-x-circle',
        title: '登录失败',
        description: ctx.error.message,
        color: 'error',
      })
    },
  })
}
</script>

<style scoped>

</style>
