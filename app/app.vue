<script setup lang="ts">
import '../assets/css/main.css'

useHead({
  title: 'Code · Life | Moon\'s Mind Sanctuary',
})
onMounted(() => {
  consoleText()
})
</script>

<template>
  <VitePwaManifest />
  <!-- <LoadingProgress /> -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* .page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
} */

html,
body,
#__nuxt {
  scroll-behavior: smooth;
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  background: #222;
  color: white;
}

/* 全局滚动条样式 */
:root {
  --scrollbar-thumb: rgba(160, 160, 160, 0.5); /* 半透明浅灰 */
  --scrollbar-track: rgba(245, 245, 245, 0.3); /* 极浅背景 */
}

/* Webkit 核心样式 */
::-webkit-scrollbar {
  width: 8px; /* 更纤细的宽度 */
  height: 8px;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
  border: 2px solid transparent; /* 透明边框增加精致感 */
  background-clip: content-box; /* 防止颜色溢出 */
  transition: background-color 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(140, 140, 140, 0.7); /* 悬停时稍深 */
}

::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
  border-radius: 4px;
}

/* Firefox 适配 */
@supports (scrollbar-color: auto) {
  html {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  }
}

/* 可选 - 动态宽度效果 */
:hover::-webkit-scrollbar {
  width: 10px; /* 悬停时略微加宽 */
}

/* 磨砂玻璃效果 (可选) */
::-webkit-scrollbar-track {
  backdrop-filter: blur(2px);
}

/* 渐变过渡 (可选) */
::-webkit-scrollbar-thumb {
  background-image: linear-gradient(to bottom, rgba(180, 180, 180, 0.6), rgba(150, 150, 150, 0.6));
}

/* 暗色模式适配
@media (prefers-color-scheme: dark) {
  :root {
    --scrollbar-thumb: rgba(120, 120, 120, 0.6);
    --scrollbar-track: rgba(30, 30, 30, 0.3);
  }
} */

::view-transition-old(root),
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: none;
}

/* 进入dark模式和退出dark模式时，两个图像的位置顺序正好相反 */
.dark::view-transition-old(root) {
  z-index: 1;
}

.dark::view-transition-new(root) {
  z-index: 999;
}

::view-transition-old(root) {
  z-index: 999;
}

::view-transition-new(root) {
  z-index: 1;
}
</style>
