<script setup lang="ts">
definePageMeta({
  layout: 'clean',
})
const route = useRoute()
const home = await useAsyncData(() => queryCollection('content').path(route.path).first())

console.warn(home)
useSeoMeta({
  title: home.data.value?.title,
  description: home.data.value?.description,
})
</script>

<template>
  <div>
    ss
    <ContentRenderer v-if="home.data.value" :value="home.data.value" />
    <div v-else>
      Home not found1
    </div>
  </div>
</template>
