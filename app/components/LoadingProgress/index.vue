<!-- components/LoadingProgress.vue -->
<script setup lang="ts">
const isLoading = ref(false)
const progress = ref<HTMLElement | null>(null)

// 使用 Nuxt3 正确的事件监听方式
// eslint-disable-next-line unused-imports/no-unused-vars
const nuxtApp = useNuxtApp()
const router = useRouter()

// 监听路由切换事件
router.beforeEach(() => {
  isLoading.value = true
  startProgress()
})

router.afterEach(() => {
  completeProgress()
})

// 进度条动画逻辑（保持不变）
let interval: NodeJS.Timeout

function startProgress() {
  clearInterval(interval)
  if (progress.value) {
    progress.value.style.width = '5%'
  }

  interval = setInterval(() => {
    if (!progress.value)
      return
    const width = Number.parseFloat(progress.value.style.width)
    const target = width + (100 - width) * 0.2
    progress.value.style.width = `${target}%`
  }, 200)
}

function completeProgress() {
  clearInterval(interval)
  if (progress.value) {
    progress.value.style.width = '100%'
    setTimeout(() => {
      isLoading.value = false
      if (progress.value) {
        progress.value.style.width = '0%'
      }
    }, 500)
  }
}
</script>

<template>
  <div
    v-if="isLoading"
    class="loading-bar fixed left-0 top-0 z-9999 h-0.75 w-full opacity-0 transition-opacity duration-300"
    :class="{ 'opacity-100': isLoading }"
  >
    <div
      ref="progress"
      class="progress h-full w-0 bg-[#4F46E5] transition-all duration-300 ease-out"
    />
  </div>
</template>
