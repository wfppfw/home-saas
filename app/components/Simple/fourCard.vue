<script setup>
// 卡片数据
const cards = [
  {
    title: '卡片标题 1',
    description: '这是一段精彩的卡片描述内容，展示卡片的主要信息，最多显示三行文本。',
    image: 'https://picsum.photos/600/400?random=1',
  },
  {
    title: '卡片标题 2',
    description: '这是一段精彩的卡片描述内容，展示卡片的主要信息，最多显示三行文本。',
    image: 'https://picsum.photos/600/400?random=2',
  },
  {
    title: '卡片标题 3',
    description: '这是一段精彩的卡片描述内容，展示卡片的主要信息，最多显示三行文本。',
    image: 'https://picsum.photos/600/400?random=3',
  },
  {
    title: '卡片标题 4',
    description: '这是一段精彩的卡片描述内容，展示卡片的主要信息，最多显示三行文本。',
    image: 'https://picsum.photos/600/400?random=4',
  },
]
</script>

<template>
  <div class="mx-auto p-4 container">
    <!-- 网格容器 -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 md:grid-cols-2">
      <!-- 单个卡片 -->
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg"
      >
        <!-- 图片容器 -->
        <div class="aspect-video overflow-hidden">
          <img
            :src="card.image"
            :alt="card.title"
            class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          >
        </div>

        <!-- 内容区域 -->
        <div class="p-6">
          <h3 class="mb-2 text-xl text-gray-800 font-bold">
            {{ card.title }}
          </h3>
          <p class="line-clamp-3 text-gray-600">
            {{ card.description }}
          </p>

          <!-- 操作按钮 -->
          <div class="mt-4 flex gap-3">
            <button class="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
              查看详情
            </button>
            <button class="border border-gray-300 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50">
              收藏
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
