<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  audioList: {
    type: Array,
    required: true,
  },
})

const playerContainer = ref(null)
let playerInstance = null

// 动态加载 APlayer（仅客户端）
async function loadPlayer() {
  if (import.meta.client) {
    const APlayer = (await import('aplayer')).default
    const { default: APlayerCSS } = await import('aplayer/dist/APlayer.min.css')

    return { APlayer, APlayerCSS }
  }
}

onMounted(async () => {
  if (import.meta.client) {
    try {
      const { APlayer } = await loadPlayer()

      playerInstance = new APlayer({
        container: playerContainer.value,
        audio: props.audioList,
        fixed: false,
        mini: false,
        autoplay: false,
        theme: '#ef4444',
        loop: 'all',
        order: 'list',
        preload: 'auto',
        volume: 0.7,
        mutex: true,
        lrcType: 3,
        listFolded: true,
      })
    }
    catch (error) {
      console.error('APlayer loading failed:', error)
    }
  }
})

onBeforeUnmount(() => {
  if (import.meta.client && playerInstance) {
    playerInstance.destroy()
  }
})
</script>

<template>
  <client-only>
    <div ref="playerContainer" class="mx-auto my-4 max-w-800px w-full rounded-lg bg-dark-700 shadow-lg" />
    <template #fallback>
      <div class="p-4 text-gray-400">
        Loading player...
      </div>
    </template>
  </client-only>
</template>

  <style>
  /* 修复可能的样式冲突 */
.aplayer .aplayer-body {
  @apply bg-transparent;
}
.aplayer .aplayer-list {
  @apply bg-dark-600;
}
</style>
