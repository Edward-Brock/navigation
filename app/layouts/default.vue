<template>
  <div class="select-none">
    <header>
      <AppHeader />
    </header>

    <main>
      <nuxt-page />
    </main>

    <footer>
      <AppFooter />
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'
</script>

<style scoped>

</style>
