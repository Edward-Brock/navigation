<template>
  <Disclosure>
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-14 items-center justify-between">
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <nuxt-link to="/">
            <div class="flex shrink-0 items-center">
              <img
                class="h-8 w-auto"
                src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              >
            </div>
          </nuxt-link>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
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
      </div>
    </div>
  </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure } from '@headlessui/vue'
import { authClient } from '~/utils/auth-client'

const session = authClient.useSession()
</script>

<style scoped>

</style>
