<template>
  <UContainer
    as="main"
    class="h-[calc(100dvh-48px)]"
  >
    <div class="h-full flex flex-col items-center justify-center">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-2xl/9 font-bold tracking-tight text-gray-900">
          注册你的账户
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <UForm
          :schema="schema"
          :state="state"
          :disabled="isSignedUp"
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
          >
            <UInput
              v-model="state.email"
              type="email"
              autocomplete="email"
              placeholder="输入电子邮箱"
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
            type="submit"
            :loading="isSignedUp"
            class="block w-full"
          >
            注册
          </UButton>
        </UForm>

        <div class="mt-10 text-sm/6 text-gray-500">
          已经有账号？
          <UButton
            trailing-icon="i-lucide-arrow-right"
            color="neutral"
            variant="link"
            to="/auth/login"
          >
            立即登录
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

const schema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email('请输入电子邮箱')),
  password: v.pipe(v.string(), v.trim(), v.minLength(8, '必须至少包含 8 个字符'), v.maxLength(32, '最多不超过 32 个字符')),
  name: v.pipe(v.string(), v.trim(), v.minLength(1, '昵称不能为空')),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  email: '',
  password: '',
  name: '',
})

/**
 * 注册时禁用表单内数据及状态变更
 * 为 true 时禁用输入框及按钮状态变更
 * 注册按钮显示加载状态
 */
const isSignedUp = ref(false)

const toast = useToast()
const router = useRouter()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSignedUp.value = true
  await authClient.signUp.email({
    email: event.data.email,
    password: event.data.password,
    name: event.data.name,
  }, {
    onSuccess: () => {
      toast.add({
        icon: 'i-heroicons-check-circle',
        title: '注册成功',
        color: 'success',
      })
      router.push('/')
    },
    onError: (ctx) => {
      isSignedUp.value = false
      toast.add({
        icon: 'i-heroicons-x-circle',
        title: '注册失败',
        description: ctx.error.statusText,
        color: 'error',
      })
    },
  })
}
</script>

<style scoped>

</style>
