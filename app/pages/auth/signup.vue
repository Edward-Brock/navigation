<template>
  <UContainer
    as="main"
    class="h-[calc(100dvh-48px)]"
  >
    <div class="h-full flex flex-col items-center justify-center">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="text-center text-2xl/9 font-bold">
          注册你的账户
        </h2>
      </div>

      <div class="mt-10 w-full sm:mx-auto sm:w-full sm:max-w-sm">
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
          >
            <UInput
              v-model="state.name"
              type="text"
              autocomplete="name"
              placeholder="输入昵称"
              icon="i-lucide-user-round"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="用户名"
            name="username"
            :error="usernameAvailableError"
            required
          >
            <UInput
              v-model="state.username"
              type="text"
              autocomplete="username"
              placeholder="输入用户名"
              icon="i-lucide-at-sign"
              class="w-full"
              @blur="checkUsernameAvailable"
            />
          </UFormField>

          <UFormField
            label="电子邮箱"
            name="email"
            required
            size="lg"
          >
            <UInput
              v-model="state.email"
              type="email"
              autocomplete="email"
              placeholder="输入电子邮箱"
              icon="i-lucide-mail"
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
              autocomplete="new-password"
              placeholder="输入密码"
              icon="i-lucide-lock"
              class="w-full"
            />
          </UFormField>

          <UButton
            block
            type="submit"
            :loading="isSignedUp"
            :disabled="isSubmitDisabled"
            class="w-full cursor-pointer"
          >
            注册
          </UButton>
        </UForm>

        <div class="mt-10 text-center text-sm/6 text-gray-500">
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

useHead({
  title: '注册',
})

const schema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email('请输入电子邮箱')),
  name: v.pipe(v.string(), v.trim(), v.minLength(1, '昵称不能为空')),
  password: v.pipe(v.string(), v.trim(), v.minLength(8, '至少包含 8 个字符'), v.maxLength(32, '最多不超过 32 个字符')),
  username: v.pipe(v.string(), v.trim(), v.minLength(3, '至少包含 3 个字符'), v.maxLength(30, '最多不超过 30 个字符')),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  email: '',
  name: '',
  password: '',
  username: '',
})

/**
 * 注册时禁用表单内数据及状态变更
 * 为 true 时禁用输入框及按钮状态变更
 * 注册按钮显示加载状态
 */
const isSignedUp = ref(false)

// 用户名不可用时错误提示
const usernameAvailableError = ref<string | null>(null)
// 用户名不可用时将提交按钮禁用
const isSubmitDisabled = computed(() => !!usernameAvailableError.value)

// 检查用户名是否可用
async function checkUsernameAvailable() {
  const value = state.username.trim()
  if (!value) {
    usernameAvailableError.value = null
    return
  }

  const response = await authClient.isUsernameAvailable({
    username: value,
  })

  usernameAvailableError.value = response.data?.available ? null : '用户名已被占用'
}

const toast = useToast()
const router = useRouter()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSignedUp.value = true
  await authClient.signUp.email({
    email: event.data.email,
    name: event.data.name,
    password: event.data.password,
    username: event.data.username,
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
        description: ctx.error.message,
        color: 'error',
      })
    },
  })
}
</script>

<style scoped>

</style>
