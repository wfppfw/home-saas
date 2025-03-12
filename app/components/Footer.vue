<!-- AppFooter.vue -->
<script setup>
const darkMode = ref(false)

// function toggleTheme() {
//   darkMode.value = !darkMode.value
//   document.documentElement.classList.toggle('dark', darkMode.value)
//   localStorage.setItem('theme', darkMode.value ? 'dark' : 'light')
// }

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  darkMode.value = savedTheme === 'dark'
  document.documentElement.classList.toggle('dark', darkMode.value)
})
</script>

<template>
  <footer class="mt-auto flex-shrink-0 border-t border-gray-200 bg-white dark:border-gray-800/50 dark:bg-gray-900/75">
    <div class="mx-auto max-w-7xl px-4 py-1 lg:px-8 sm:px-6">
      <!-- 主要容器改为响应式flex布局 -->
      <div class="flex flex-col items-center justify-between gap-y-4 lg:flex-row lg:gap-y-0">
        <!-- 版权信息（大屏左侧） -->
        <div class="order-2 lg:order-1 lg:flex-1">
          <div class="text-center text-sm text-gray-500 lg:text-left dark:text-gray-400">
            <span>
              <div
                style="display: inline-block"
                class="animate__animated animate__heartBeat animate__infinite"
              >
                <img src="/image/heart.svg" alt="">
              </div>
            </span> © {{ new Date().getFullYear() }}. All rights reserved.
          </div>
        </div>

        <!-- 中间占位（仅在桌面端显示） -->
        <div class="hidden lg:order-2 lg:block lg:flex-1" />

        <!-- 操作按钮组（大屏右侧） -->
        <div class="order-1 flex items-center justify-center gap-x-3 lg:order-3 lg:flex-1 lg:justify-end">
          <a
            href="https://github.com/wfppfw"
            title="github"
            target="_blank"
            rel="noopener noreferrer"
            class="focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex flex-shrink-0 items-center gap-x-1.5 rounded-md p-1.5 text-sm text-gray-700 font-medium aria-disabled:cursor-not-allowed disabled:cursor-not-allowed hover:bg-gray-50 dark:text-gray-200 hover:text-gray-900 aria-disabled:opacity-75 disabled:opacity-75 focus-visible:outline-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <Icon name="simple-icons:github" class="size-5 shrink-0" color="current" />

          </a>
          <a
            href="https://space.bilibili.com/327191393?spm_id_from=333.1007.0.0"
            target="_blank"
            title="bilibili"
            rel="noopener noreferrer"
            class="focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex flex-shrink-0 items-center gap-x-1.5 rounded-md p-1.5 text-sm text-gray-700 font-medium aria-disabled:cursor-not-allowed disabled:cursor-not-allowed hover:bg-gray-50 dark:text-gray-200 hover:text-gray-900 aria-disabled:opacity-75 disabled:opacity-75 focus-visible:outline-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset dark:hover:bg-gray-800 dark:hover:text-white"
          >

            <Icon name="simple-icons:bilibili" class="size-5 shrink-0" color="current" />

          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.animate__animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.animate__heartBeat {
  -webkit-animation-name: heartBeat;
  animation-name: heartBeat;
  -webkit-animation-duration: 2.6s;
  animation-duration: 2.6s;
  -webkit-animation-duration: 2.6s;
  animation-duration: 2.6s;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
}
.animate__animated.animate__infinite {
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}
@-webkit-keyframes heartBeat {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  14% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }

  28% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  42% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }

  70% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
@keyframes heartBeat {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  14% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }

  28% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  42% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }

  70% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
