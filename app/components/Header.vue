<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

// eslint-disable-next-line unused-imports/no-unused-vars
const props = defineProps({
  navigation: {
    type: Array,
    default: () => [
      { name: 'Blog', router: '/blog-index', icon: 'simple-icons:readdotcv' },
      { name: 'Project', router: '/project', icon: 'ph:telegram-logo-bold' },
      // { name: 'Toy', router: '/toy', icon: 'simple-icons:ghostery' },
    ],
  },
})

const hasScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const headerRef = ref(null)
let lastScroll = 0

// 暗黑模式状态
const darkMode = ref(true)

// 滚动处理
function handleScroll() {
  const currentScroll = window.scrollY
  hasScrolled.value = currentScroll > 50

  // 优化滚动方向判断
  if (Math.abs(currentScroll - lastScroll) > 5) {
    lastScroll = currentScroll
  }
}

// 切换暗黑模式
// function toggleDarkMode() {
//   darkMode.value = !darkMode.value
//   document.documentElement.classList.toggle('dark', darkMode.value)
//   localStorage.setItem('theme', darkMode.value ? 'dark' : 'light')
// }

// 切换移动菜单
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// 点击外部关闭菜单
function handleClickOutside(event) {
  if (headerRef.value && !headerRef.value.contains(event.target)) {
    isMobileMenuOpen.value = false
  }
}

// 生命周期钩子
onMounted(() => {
  darkMode.value = localStorage.getItem('theme') === 'dark'
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
  // 初始化暗黑模式
  document.documentElement.classList.toggle('dark', darkMode.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header
    ref="headerRef"
    class="supports-backdrop-blur:bg-white/95 fixed inset-x-0 top-0 z-[999] border-b border-gray-200/50 backdrop-blur transition-all duration-300 dark:border-gray-800/50 dark:bg-[#020618]/75"
    :class="{
      'bg-white/80 dark:bg-[#020618]/80 shadow-sm': hasScrolled,
      'border-b-transparent': !hasScrolled,
    }"
  >
    <nav class="mx-auto max-w-7xl px-4 lg:px-8 sm:px-6">
      <div class="h-16 flex items-center justify-between">
        <!-- 左侧 Logo 和导航 -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2" title="home">
            <img src="/head-moon.svg">
            <span class="text-xl text-gray-900 font-bold dark:text-white" />
          </NuxtLink>
        </div>

        <!-- 导航 -->
        <div class="mr-6 hidden md:flex md:flex-1 md:flex-justify-end">
          <div class="flex space-x-4">
            <NuxtLink
              v-for="nav in navigation"
              :key="nav.name"
              :to="nav.router"

              :class="
                $route.path === nav.router
                  ? 'after:w-full after:left-0'
                  : 'after:w-0 after:left-1/2'"
              class="relative rounded-md px-3 py-2 pb-[6px] text-4 text-gray-700 font-bold transition-all duration-300 after:absolute after:bottom-0 after:h-[2px] after:bg-current dark:text-gray-300 after:transition-all after:duration-300 after:content-['']"
            >
              <!-- <Icon :name="nav.icon" /> -->
              {{ nav.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-3">
          <DarkMode class="mt-2" />

          <AvataarCard>
            <img :style="{ width: '40px', height: '40px' }" src="/moon.svg">
          </AvataarCard>
          <button class="hidden items-center border border-transparent rounded-md from-blue-500 to-purple-500 bg-gradient-to-r px-4 py-2 text-sm text-white font-medium transition-all md:inline-flex hover:from-blue-600 hover:to-purple-600">
            <NuxtLink to="/login">
              Sigin Up
            </NuxtLink>
          </button>

          <!-- 移动端菜单按钮 -->
          <button
            class="rounded-lg p-2 transition-colors md:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="toggleMobileMenu"
          >
            <svg class="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- 移动端菜单 -->
    <Transition
      enter-active-class="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
      leave-active-class="transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
      enter-from-class="opacity-0 -translate-y-5"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-5"
    >
      <div
        v-show="isMobileMenuOpen"
        class="fixed inset-x-0 top-16 z-[998] bg-white shadow-lg md:hidden dark:bg-gray-800"
      >
        <div class="px-4 pb-3 pt-2 space-y-1">
          <NuxtLink
            v-for="nav in navigation"
            :key="nav.name"
            :to="nav.router"
            class="block rounded-md px-3 py-2 transition-colors text-nav-color hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <!-- <Icon :name="nav.icon" /> -->
            {{ nav.name }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

  <style>
  @supports (height: 100dvh) {
  :root {
    min-height: 100dvh;
    min-height: -webkit-fill-available;
  }
}
/* 添加自定义缓动曲线（可选） */
.ease-menu {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 修复移动端点击闪烁问题 */
@media (pointer: coarse) {
  .transition-all {
    -webkit-tap-highlight-color: transparent;
  }
}

.logo-svg {
  @apply w-24 h-24 mx-auto mb-6;
  filter: drop-shadow(0 0 8px rgba(79, 70, 229, 0.3));
}
</style>
