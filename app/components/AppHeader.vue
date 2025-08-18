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
      <template v-if="!session.data">
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
