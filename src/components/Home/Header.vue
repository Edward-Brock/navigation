<script setup lang="ts">
import { Disclosure } from '@headlessui/vue'
import 'element-plus/theme-chalk/display.css'

/**
 * 点击跳转到 GitHub 项目
 */
function toGitHub(data: string) {
  let url = ""
  switch (data) {
    case "q":
      url = import.meta.env.VITE_APP_GIT_WEB_URL
      break;
    case "h":
      url = import.meta.env.VITE_APP_GIT_SERVER_URL
      break;
  }
  window.open(url)
}
</script>

<template>
  <Disclosure>
    <div class="mx-auto max-w-full px-2 sm:px-4 lg:px-3">
      <div class="relative flex h-12 items-center justify-between">
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-between">
          <div class="flex flex-shrink-0 items-center">
            <img class="h-8 w-auto lg:block" src="../../assets/logo_396_118_black.png"
                 alt="booop navigation logo black"/>
          </div>
          <!-- GitHub 项目跳转-->
          <div
              class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 cursor-pointer hidden-xs-only">
            <div class="flex flex-col items-center mx-2" @click="toGitHub('q')">
              <button type="button"
                      class="rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-800"
              >
                <span class="sr-only">View notifications</span>
                <svg height="24" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="24"
                     data-view-component="true" class="octicon octicon-mark-github v-align-middle">
                  <path
                      d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
              </button>
              <div class="text-xs">前端代码</div>
            </div>
            <div class="flex flex-col items-center mx-2" @click="toGitHub('h')">
              <button type="button"
                      class="rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-800"
              >
                <span class="sr-only">View notifications</span>
                <svg height="24" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="24"
                     data-view-component="true" class="octicon octicon-mark-github v-align-middle">
                  <path
                      d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
              </button>
              <div class="text-xs">服务端代码</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Disclosure>
</template>

<style scoped lang="scss">

</style>