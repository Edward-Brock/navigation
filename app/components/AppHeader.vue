<template>
  <UContainer
    as="header"
    class="h-12 flex items-center justify-between"
  >
    <!-- Logo -->
    <NuxtLink href="/">
      <NuxtImg
        src="/booop_navigation_logo.svg"
        alt="booop navigation"
        width="108"
        placeholder
      />
    </NuxtLink>
    <!-- 功能区 -->
    <div v-if="!hideUserArea">
      <!-- 未完成加载状态 -->
      <template v-if="session.isPending">
        <USkeleton class="w-20 h-9 rounded-full" />
      </template>
      <!-- 不存在登录信息显示登录按钮 -->
      <template v-else-if="!session.data">
        <UButton
          class="rounded-full"
          trailing-icon="i-lucide-arrow-right"
          color="neutral"
          variant="ghost"
          size="lg"
          to="/auth/login"
        >
          登录
        </UButton>
      </template>
      <!-- 显示用户下拉选项 -->
      <template v-else>
        <UserDropdown />
      </template>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const route = useRoute()
const session = authClient.useSession()

const hideUserArea = computed(() => route.meta.hideUserMenu === true)
</script>

<style>

</style>
