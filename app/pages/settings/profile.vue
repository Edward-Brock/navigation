<template>
  <div class="my-5">
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField
        label="用户名"
        name="username"
        help="用户名是你用于登录账号的重要凭证"
      >
        <UInput
          v-model="state.username"
          disabled
          type="text"
          autocomplete="username"
          placeholder="输入用户名"
          icon="i-lucide-at-sign"
        />
      </UFormField>

      <UFormField
        label="昵称"
        name="name"
        help="你的昵称可能会出现在你贡献或被提及的地方"
      >
        <UInput
          v-model="state.name"
          type="text"
          autocomplete="name"
          placeholder="输入昵称"
          icon="i-lucide-user-round"
        />
      </UFormField>
      <UButton
        type="submit"
        class="cursor-pointer"
      >
        保存信息
      </UButton>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

useHead({
  title: '个人信息',
})

const session = authClient.useSession()

const schema = v.object({
  username: v.pipe(v.string(), v.trim(), v.minLength(3, '至少包含 3 个字符'), v.maxLength(30, '最多不超过 30 个字符')),
  name: v.pipe(v.string(), v.trim(), v.minLength(1, '昵称不能为空')),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  name: session.value.data?.user.name ?? '',
  username: session.value.data?.user.username ?? '',
})

// session 更新时同步表单
watchEffect(() => {
  if (session.value.data) {
    state.name = session.value.data.user.name ?? ''
    state.username = session.value.data.user.username ?? ''
  }
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await authClient.updateUser({
    name: event.data.name,
  })
  toast.add({
    icon: 'i-heroicons-check-circle',
    title: '个人信息保存成功',
    color: 'success',
  })
}
</script>

<style scoped>

</style>
