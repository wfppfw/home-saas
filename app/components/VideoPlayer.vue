<script setup lang="ts">
// import type { Plyr, PlyrSource } from 'plyr'
// import type { Plyr } from 'plyr'
import type Plyr from 'plyr'
import 'plyr/dist/plyr.css'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'video/mp4',
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})

const videoElement = ref<HTMLVideoElement>()
let player: Plyr | null = null

// const options = {
//   captions: { active: true, language: 'auto', update: true },
//   quality: { default: 720, options: [4320, 2880, 2160, 1440, 1080, 720, 480] },
//   speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
//   keyboard: { focused: true, global: true },
//   tooltips: { controls: true, seek: true },
//   previewThumbnails: {
//     enabled: true,
//     src: ['/thumbnails/thumbnails.vtt']
//   }
// }
// 初始化播放器
onMounted(async () => {
  if (import.meta.client) {
    const { default: Plyr } = await import('plyr')

    if (videoElement.value) {
      player = new Plyr(videoElement.value, {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'captions',
          'settings',
          'pip',
          'airplay',
          'fullscreen',
        ],
        ...props.options,
      })
    }
  }
})

// 销毁播放器
onBeforeUnmount(() => {
  if (player) {
    player.destroy()
  }
})

// 暴露播放器实例
defineExpose({
  player,
})
</script>

<template>
  <div class="video-container overflow-hidden rounded-lg bg-gray-900">
    <!-- Plyr 容器 -->
    <video ref="videoElement" class="h-full w-full object-cover" playsinline controls>
      <source :src="src" :type="type">
    </video>
  </div>
</template>

  <style>
  /* 自定义 Plyr 主题色 */
:root {
  --plyr-color-main: #ec4899;
  --plyr-video-controls-background: rgba(17, 24, 39, 0.7);
  --plyr-video-control-color: #fff;
}
</style>
