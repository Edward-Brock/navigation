<template>
  <div class="my-5">
    <UForm
      :schema="schema"
      :state="state"
      :disabled="isChangePassword"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField
        label="当前密码"
        name="currentPassword"
        help="输入账号当前的密码"
      >
        <UInput
          v-model="state.currentPassword"
          type="password"
          autocomplete="current-password"
          placeholder="输入当前密码"
        />
      </UFormField>

      <UFormField
        label="新密码"
        name="newPassword"
        help="输入你想要设定的新密码"
      >
        <UInput
          v-model="state.newPassword"
          type="password"
          autocomplete="new-password"
          placeholder="输入新密码"
        />
      </UFormField>

      <UFormField
        label="确认新密码"
        name="confirmPassword"
        :error="confirmError"
        help="再次输入新密码以确认"
      >
        <UInput
          v-model="state.confirmPassword"
          type="password"
          placeholder="确认新密码"
        />
      </UFormField>

      <UButton
        type="submit"
        :disabled="!!confirmError"
        :loading="isChangePassword"
        class="cursor-pointer"
      >
        更改密码
      </UButton>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

useHead({
  title: '更改密码',
})

const passwordSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(8, '必须至少包含 8 个字符'),
  v.maxLength(32, '最多不超过 32 个字符'),
)

const schema = v.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

/**
 * 更改密码提交时禁用表单内数据及状态变更
 * 为 true 时禁用输入框及按钮状态变更
 * 更改密码按钮显示加载状态
 */
const isChangePassword = ref(false)

// 只有两者都有值且不相等时给出错误
const confirmError = computed(() => {
  return state.newPassword.trim() && state.confirmPassword.trim() && state.newPassword.trim() !== state.confirmPassword.trim() ? '两次输入的新密码不一致' : undefined
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isChangePassword.value = true
  const { error } = await authClient.changePassword({
    newPassword: event.data.newPassword,
    currentPassword: event.data.currentPassword,
    revokeOtherSessions: true,
  })

  if (error) {
    isChangePassword.value = false
    toast.add({
      icon: 'i-heroicons-x-circle',
      title: '密码更改失败',
      description: error.message,
      color: 'error',
    })
  }
  else {
    toast.add({
      icon: 'i-heroicons-check-circle',
      title: '密码更改成功',
      color: 'success',
    })
    isChangePassword.value = false
    state.currentPassword = ''
    state.newPassword = ''
    state.confirmPassword = ''
  }
}
</script>

<style scoped>

</style>
