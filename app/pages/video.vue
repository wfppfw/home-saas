<script setup>
// 可选：处理服务端渲染问题
// 如果不需要 SSR，可以添加以下指令
// <client-only>
//   <VideoPlayer ... />
// </client-only>
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="mx-auto max-w-4xl">
      <h1 class="mb-6 text-3xl text-gray-800 font-bold">
        视频播放器示例
      </h1>

      <div class="aspect-video">
        <VideoPlayer
          src="/video/1.mp4"
          :options="{
            autoplay: false,
            muted: false,
            quality: { default: 576, options: [4320, 2880, 2160, 1440, 1080, 720, 576] },
          }"
        />
      </div>
    </div>
  </div>
</template>
