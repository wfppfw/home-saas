<script setup lang="ts">
import { appName } from '~/constants'
import consoleCatText from '~/utils/consoleText'

useHead({
  title: 'Code · Life | Moon\'s Mind Sanctuary',
})
onMounted(() => {
  consoleCatText()
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  background: #222;
  color: white;
}
</style>
