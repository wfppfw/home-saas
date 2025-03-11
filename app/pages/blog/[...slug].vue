<script setup lang="ts">
definePageMeta({
  layout: 'home',
})
const route = useRoute()
const post = await useAsyncData(() => queryCollection('content').path(route.path).first())

// 获取目录结构
const hType = { h1: 1, h2: 2, h3: 3, h4: 4 }
const toc = ref([])
function updateToc() {
  toc.value = post.data.value?.body.value
    .filter((node: string[]) => ['h1', 'h2', 'h3', 'h4'].includes(node[0]))
    .map((item, index) => ({
      id: item[1].id,
      text: item[2],
      level: hType[item[0] as 'h1'],
    }))
}
updateToc()

// console.warn(toc.value, post.data.value, post, route.params)
useSeoMeta({
  title: post.data.value?.title,
  description: post.data.value?.description,
})
</script>

<template>
  <div>
    <!-- {{ route }} -->
    <!-- <ContentRenderer v-if="post.data.value" :value="post.data.value" /> -->
    <!-- <div v-else>
      post not found1
    </div> -->

    <div class="relative flex gap-8">
      <!-- 主内容区域 -->
      <div class="mx-auto max-w-3xl flex-1 prose">
        <ContentRenderer :value="post.data.value" />
      </div>

      <!-- 目录导航 -->
      <div class="sticky top-20 hidden h-[calc(100vh-5rem)] w-64 md:block">
        <div class="text-sm space-y-2">
          <div
            v-for="item in toc" :key="item.id"
            :class="`ml-${(item.level - 2) * 4}`"
            class="hover:text-primary cursor-pointer"
            @click="navigateTo(`#${item.id}`)"
          >
            {{ item.text }}
          </div>
        </div>
      </div>

    <!-- 上下篇导航 -->
    </div>
  </div>
</template>
