<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />

    <AppHeader />

    <NuxtPage />
  </UApp>
</template>

<script lang="ts" setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - 波普导航` : '波普导航'
  },
})
</script>
