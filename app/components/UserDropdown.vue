<template>
  <UDropdownMenu
    :items="items"
  >
    <UButton
      :avatar="{
        src: session.data?.user.image as string,
        alt: session.data?.user.name,
      }"
      color="neutral"
      variant="link"
    >
      {{ session.data?.user.name }}
    </UButton>
  </UDropdownMenu>
</template>

<script lang="ts" setup>
import { authClient } from '@/utils/auth-client'

const toast = useToast()
const router = useRouter()
const session = authClient.useSession()
const items = ref([
  [
    {
      label: '仪表盘',
      icon: 'i-lucide-gauge',
    },
    {
      label: '设置',
      icon: 'i-lucide-cog',
      to: '/settings',
    },
  ],
  [
    {
      label: '退出账号',
      icon: 'i-lucide-log-out',
      onSelect() {
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.add({
                icon: 'i-heroicons-check-circle',
                title: '退出成功',
                color: 'success',
              })
              router.push('/')
            },
          },
        })
      },
    },
  ],
])
</script>

<style>

</style>
