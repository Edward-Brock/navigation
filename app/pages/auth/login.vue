<!-- app/pages/auth/login.vue -->
<template>
  <main class="flex min-h-svh flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="text-center text-2xl/9 font-bold tracking-tight">
        登录你的账号
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <UForm
        :schema="v.safeParser(schema)"
        :state="state"
        :disabled="isLoggedIn"
        class="space-y-6"
        @submit="onSubmit"
      >
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

        <UCheckbox
          v-model="state.rememberMe"
          color="neutral"
          label="在此设备上记住我"
          name="rememberMe"
        />

        <UButton
          color="neutral"
          type="submit"
          size="lg"
          :loading="isSubmitting"
          class="block w-full font-bold"
        >
          登录
        </UButton>
      </UForm>
    </div>
  </main>
</template>

<script lang="ts" setup>
import * as v from 'valibot'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'single',
})

const schema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email('请输入电子邮箱')),
  password: v.pipe(v.string(), v.trim(), v.minLength(8, '必须至少包含 8 个字符'), v.maxLength(32, '最多不超过 32 个字符')),
  rememberMe: v.pipe(v.boolean()),
})

type Schema = v.InferOutput<typeof schema>

const isSubmitting = ref(false)
const isLoggedIn = ref(false)
const state = reactive({
  email: '',
  password: '',
  rememberMe: true,
})

const toast = useToast()
const router = useRouter()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true // 在提交时设置为 true
  try {
    await authClient.signIn.email({
      email: event.data.email,
      password: event.data.password,
      rememberMe: event.data.rememberMe,
    }, {
      onSuccess: () => {
        // 登录成功后将 isLoggedIn 设置为 true
        isLoggedIn.value = true
        toast.add({
          icon: 'i-heroicons-check-circle',
          title: '登录成功',
          color: 'success',
        })
        router.push('/dashboard')
      },
      onError: (ctx) => {
        toast.add({
          icon: 'i-heroicons-x-circle',
          title: '登录失败',
          description: ctx.error.message,
          color: 'error',
        })
      },
    })
  }
  finally {
    isSubmitting.value = false // 提交完成后重置为 false
  }
}
</script>

<style>

</style>
