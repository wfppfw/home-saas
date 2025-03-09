<script setup>
// 卡片数据
const cards = [
  {
    title: '卡片标题 1',
    description: '这是一段精彩的卡片描述内容',
    image: 'https://picsum.photos/600/400?random=1',
  },
  {
    title: '卡片标题 2',
    description: '这是一段精彩的卡片描述内容，',
    image: 'https://picsum.photos/600/400?random=2',
  },
  {
    title: '卡片标题 3',
    description: '这是一段精彩的卡片描述内容，',
    image: 'https://picsum.photos/600/400?random=3',
  },
  {
    title: '卡片标题 4',
    description: '这是一段精彩的卡片描述内容',
    image: 'https://picsum.photos/600/400?random=4',
  },
]
</script>

<template>
  <div class="mx-auto max-w-7xl p-4 container">
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 md:grid-cols-2 sm:gap-6">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="group mx-auto max-w-[450px] w-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 dark:bg-gray-800 dark:shadow-gray-900/20 hover:shadow-lg"
      >
        <!-- 图片容器添加相对定位 -->
        <div class="relative aspect-video overflow-hidden">
          <img
            :src="card.image"
            :alt="card.title"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          >

          <!-- 文字叠加层 -->
          <div class="absolute inset-0 flex flex-col justify-end from-black/60 to-transparent bg-gradient-to-t p-4">
            <!-- 标题和描述 -->
            <div class="text-left space-y-2">
              <h3 class="text-lg text-gray-50 font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {{ card.title }}
              </h3>
              <p class="line-clamp-2 text-sm text-gray-200/90 leading-snug drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                {{ card.description }}
              </p>
            </div>

            <!-- 图标按钮 -->
            <div class="mt-3 flex justify-end">
              <button
                class="border border-white/20 rounded-full bg-white/10 p-2 backdrop-blur-sm transition-all dark:border-gray-600/50 dark:bg-gray-800/30 hover:bg-white/20 dark:hover:bg-gray-700/40"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
