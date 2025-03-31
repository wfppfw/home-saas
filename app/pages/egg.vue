<script setup>
import { ref } from 'vue'

const videoList = ref([
  {
    id: 'intro',
    src: '/video/1.mp4',
    actions: [
      {
        text: '进入第一章',
        description: '学习基础操作',
        nextVideoId: 'chapter1',
      },
      {
        text: '跳过介绍',
        description: '直接开始实践',
        nextVideoId: 'practice',
      },
    ],
  },
  {
    id: 'chapter1',
    src: '/video/2.mp4',
    actions: [
      {
        text: '继续第二章',
        description: '深入学习高级功能',
        nextVideoId: 'chapter2',
      },
    ],
  },
  {
    id: 'chapter2',
    src: '/videos/chapter2.mp4',
  },
  {
    id: 'practice',
    src: '/videos/practice.mp4',
  },
])

function handleVideoChange(videoId) {
  console.log('切换到视频:', videoId)
}
</script>

<template>
  <EggVideo
    :videos="videoList"
    initial-video-id="intro"
    @video-change="handleVideoChange"
  />
</template>
