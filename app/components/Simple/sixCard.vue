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

// 鼠标坐标追踪
const cardRefs = ref<HTMLElement[]>([])
const currentHoverIndex = ref(-1)
const gradientPos = reactive({ x: 50, y: 50 })

function handleMouseMove(event: MouseEvent, index: number) {
  currentHoverIndex.value = index
  const card = cardRefs.value[index]
  if (!card)
    return

  const rect = card.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  gradientPos.x = x
  gradientPos.y = y
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3 md:grid-cols-2">
    <div
      v-for="(card, index) in cards"
      :key="index"
      class="relative border border-gray-200 rounded-lg bg-white p-4 transition-all duration-300 dark:border-gray-700 hover:border-gray-300 dark:bg-gray-800 dark:hover:border-gray-500"
      @mousemove="handleMouseMove($event, index)"
      @mouseleave="currentHoverIndex = -1"
    >
      <!-- 光晕遮罩层 -->
      <div
        class="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        :style="{
          background: currentHoverIndex === index
            ? `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%, rgba(79, 70, 229, 0.08) 0%, transparent 70%)`
            : 'transparent',
        }"
      />

      <!-- 图标容器 -->
      <div class="mb-2 flex items-center">
        <div class="text-xl text-blue-500 dark:text-blue-300">
          <Icon :name="card.icon" class="iconClass" />
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
.iconClass {
  color: #4f46e5;
}
</style>
