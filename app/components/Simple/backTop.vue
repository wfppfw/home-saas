<!-- components/BackTop.vue -->
<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const visible = ref(false)
const scrollThreshold = 400 // 滚动多少像素后显示按钮

function handleScroll() {
  visible.value = (window.pageYOffset > scrollThreshold)
}

function scrollToTop() {
  if (import.meta.client) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('scroll', handleScroll)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div
    v-show="visible"
    class="back-top fixed bottom-14 right-6 hidden cursor-pointer md:block"
    @click="scrollToTop"
  >
    <div class="bTOP bg-primary-500/80 hover:bg-primary-600/90 rounded-full p-3 shadow-lg transition-all">
      <Icon name="i-ph-arrow-up-bold" class="mt-3 size-5 shrink-0" color="current" />
    </div>
  </div>
</template>

  <style scoped>
.bTOP:hover {
  /* border: 1px solid rgba(160, 160, 160, 0.5);
  box-shadow: 0 0 20px rgba(180, 180, 191, 0.5); */
}
/* 自定义过渡动画 */
.back-top {
  transition:
    opacity 0.3s,
    transform 0.3s;
  z-index: 999;
  cursor: url('/pointer.svg'), pointer !important;
}
.back-top:hover {
  transform: translateY(-2px);
}
</style>
