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
    class="back-top fixed bottom-8 right-8 cursor-pointer"
    @click="scrollToTop"
  >
    <div class="bg-primary-500/80 hover:bg-primary-600/90 rounded-full p-3 shadow-lg transition-all">
      <div class="i-ph-arrow-up-bold text-xl text-white">
        回到顶部
      </div>
    </div>
  </div>
</template>

  <style scoped>
  /* 自定义过渡动画 */
.back-top {
  transition:
    opacity 0.3s,
    transform 0.3s;
  z-index: 999;
}
.back-top:hover {
  transform: translateY(-2px);
}
</style>
