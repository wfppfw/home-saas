<script setup lang="ts">
const cards = ref([
  {
    icon: 'ph:airplane-light',
    title: 'Traval',
    description: 'Traveling lets you see the amazing world out there.',
  },
  {
    icon: 'ph:guitar',
    title: 'Music',
    description: 'Music, the universal language, stirs the soul\'s deepest chords.',
  },
  {
    icon: 'ph:bicycle',
    title: 'Bicycle',
    description: 'My favorite mode of transportation!',
  },
  {
    icon: 'ph:game-controller',
    title: 'Game',
    description: 'Zero skills, maximum enthusiasm – the ultimate noob',
  },
  {
    icon: 'ph:television-simple',
    title: 'アニメ',
    description: 'きれいなアニメが好きです',
  },
  {
    icon: 'ph:bell-simple-z',
    title: 'Sleep',
    description: 'Life\'s too short – catch some Z\'s while you can!',
  },
])
</script>

<template>
  <div class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3 md:grid-cols-2">
    <div
      v-for="(card, index) in cards"
      :key="index"
      class="relative rounded-lg bg-white p-4 shadow-md transition-all duration-300 dark:bg-gray-800 hover:shadow-lg"
    >
      <!-- 图标容器 -->
      <div class="mb-2 flex items-center">
        <div class="text-xl text-blue-500 dark:text-blue-300">
          <Icon :name="card.icon" />
        </div>
      </div>

      <!-- 标题 -->
      <h3 class="mb-2 text-left text-lg text-gray-800 font-bold dark:text-gray-100">
        {{ card.title }}
      </h3>

      <!-- 描述 -->
      <p class="whitespace-pre-wrap text-left text-gray-600 leading-relaxed dark:text-gray-300">
        {{ card.description }}
      </p>
    </div>
  </div>
</template>

  <style>
  /* 通过 UnoCSS 自动生成所需样式 */
</style>
