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

    <div class="relative flex gap-8 text-left">
      <!-- 主内容区域 -->
      <div class="mx-auto max-w-[800px] flex-1 px-4 prose lg:px-0">
        <ContentRenderer :value="post.data.value" />

        <!-- 导航卡片容器 -->
        <div class="mt-16 flex flex-col gap-6 md:flex-row md:gap-8">
          <!-- 上一篇卡片 -->
          <div class="group/card flex-1 cursor-pointer">
            <div class="h-full flex items-center gap-4 border rounded-xl bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100 md:p-6 hover:shadow-md">
              <div class="group-hover/card:bg-primary h-10 w-10 flex items-center justify-center rounded-full bg-white text-gray-400 transition-all duration-300 group-hover/card:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 translate-x-[-2px] transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <div>
                <p class="mb-1 text-sm text-gray-500">
                  上一篇
                </p>
                <h3 class="group-hover/card:text-primary text-gray-800 font-medium transition-colors duration-300">
                  如何高效学习TypeScript
                </h3>
              </div>
            </div>
          </div>

          <!-- 下一篇卡片 -->
          <div class="group/card flex-1 cursor-pointer">
            <div class="h-full flex items-center gap-4 border rounded-xl bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100 md:p-6 hover:shadow-md">
              <div class="text-right">
                <p class="mb-1 text-sm text-gray-500">
                  下一篇
                </p>
                <h3 class="group-hover/card:text-primary text-gray-800 font-medium transition-colors duration-300">
                  Nuxt3最佳实践指南
                </h3>
              </div>

              <div class="group-hover/card:bg-primary ml-auto h-10 w-10 flex items-center justify-center rounded-full bg-white text-gray-400 transition-all duration-300 group-hover/card:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 translate-x-[2px] transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- 在导航卡片之后添加 -->
        <div class="mt-12 border-t pt-12">
          <!-- 评论区标题 -->
          <h3 class="mb-8 text-2xl text-gray-800 font-semibold">
            <svg class="text-primary mr-2 inline-block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            评论留言
          </h3>

          <!-- 评论列表 -->
          <div class="space-y-8">
            <!-- 单条评论 -->
            <div class="group/comment rounded-lg bg-white p-4 transition-colors duration-200 hover:bg-gray-50 md:p-6">
              <div class="flex gap-4">
                <!-- 头像 -->
                <div class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                  <img
                    src="https://source.unsplash.com/100x100/?portrait"
                    class="h-full w-full object-cover"
                    alt="用户头像"
                  >
                </div>

                <!-- 评论内容 -->
                <div class="flex-1">
                  <div class="mb-2 flex items-baseline justify-between">
                    <div>
                      <span class="text-gray-800 font-medium">李华</span>
                      <span class="ml-2 text-sm text-gray-500">@lihua</span>
                    </div>
                    <span class="text-sm text-gray-400">2小时前</span>
                  </div>
                  <p class="text-gray-700">
                    这个教程非常实用！特别是目录生成的部分，解决了我的大问题 👍
                  </p>

                  <!-- 互动按钮 -->
                  <div class="mt-3 flex items-center gap-4 text-sm">
                    <button class="hover:text-primary flex items-center gap-1 text-gray-400 transition-colors duration-200">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>回复</span>
                    </button>
                    <span class="text-gray-300">|</span>
                    <span class="text-gray-400">3 条回复 ↓</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 更多评论示例... -->
          </div>

          <!-- 评论表单 -->
          <div class="mt-8 border rounded-xl bg-gray-50 p-4 md:p-6">
            <h4 class="mb-4 text-lg text-gray-800 font-medium">
              发表评论
            </h4>
            <textarea
              class="focus:border-primary focus:ring-primary/20 w-full border rounded-lg bg-white px-4 py-3 text-gray-700 transition-colors duration-200 focus:ring-2"
              rows="4"
              placeholder="写下你的想法..."
            />
            <div class="mt-4 flex justify-end">
              <button class="bg-primary hover:bg-primary/90 rounded-lg px-6 py-2 text-white transition-colors duration-200">
                提交评论
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 目录导航 -->
      <div class="sticky top-20 hidden h-[calc(100vh-5rem)] w-64 md:block">
        <div class="text-sm space-y-1">
          <div
            v-for="item in toc" :key="item.id"
            :class="[
              {
                'ml-0': item.level === 1,
                'ml-4': item.level === 2,
                'ml-8': item.level === 3,
                'ml-12': item.level === 4,
                'border-gray-200': item.level === 1,
                'border-gray-150': item.level === 2,
                'border-gray-100': item.level === 3,
                'border-gray-50': item.level === 4,
              },
            ]"
            class="hover:text-primary hover:border-primary cursor-pointer border-l-2 py-1 pl-3 transition-colors duration-200"
            @click="navigateTo(`#${item.id}`)"
          >
            <span
              :class="{
                'font-semibold': item.level === 1,
                'text-sm': item.level === 2,
                'text-xs': item.level > 2,
              }"
            >
              {{ item.text }}
            </span>
          </div>
        </div>
      </div>

    <!-- 上下篇导航 -->
    </div>
  </div>
</template>

<style>
/* 重置正文对齐方式 */
.prose {
  text-align: left !important;
  /* max-width: 100% !important; */
}

/* 针对特定元素调整 */
.prose p {
  margin: 1em 0;
}

.prose img {
  margin: 0 auto; /* 保持图片居中 */
}
</style>
