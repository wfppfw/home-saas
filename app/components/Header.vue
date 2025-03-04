<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

// eslint-disable-next-line unused-imports/no-unused-vars
const props = defineProps({
  navigation: {
    type: Array,
    default: () => [
      { name: 'Doc', router: '/doc' },
      { name: 'Tool', router: '/tool' },
      { name: 'Toy', router: '/toy' },
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
function toggleDarkMode() {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark', darkMode.value)
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light')
}

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
    class="supports-backdrop-blur:bg-white/95 fixed inset-x-0 top-0 z-[999] border-b border-gray-200/50 backdrop-blur transition-all duration-300 dark:border-gray-800/50 dark:bg-gray-900/75"
    :class="{
      'bg-white/80 dark:bg-gray-900/90 shadow-sm': hasScrolled,
      'border-b-transparent': !hasScrolled,
    }"
  >
    <nav class="mx-auto max-w-7xl px-4 lg:px-8 sm:px-6">
      <div class="h-16 flex items-center justify-between">
        <!-- 左侧 Logo 和导航 -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" t="1740727177932" class="mb-1" viewBox="0 0 1024 1024" version="1.1" p-id="13075" width="25" height="25">
              <path d="M859.831052 656.36486c-213.616449 0-386.78729-173.170841-386.787289-386.78729a385.435514 385.435514 0 0 1 36.282617-163.88785c-228.366355 27.334579-405.53271 221.71514-405.532711 457.498317 0 254.49271 206.367103 460.811963 460.871776 460.811963 234.981682 0 428.883738-175.850467 457.23514-403.211963a385.196262 385.196262 0 0 1-162.069533 35.576823z" fill="#6F6CFF" p-id="13076" />
              <path d="M486.83666 971.113271A484.354393 484.354393 0 0 1 2.111426 486.376075c0-245.233645 183.410841-452.186916 426.610841-481.244112l42.766356-5.131963-18.278879 39.034019a363.591776 363.591776 0 0 0-34.105421 153.707663c0 200.098692 162.775327 362.862056 362.862057 362.862056h0.418691a364.058318 364.058318 0 0 0 151.614206-33.339813l39.105794-18.075514-5.323364 42.754393a484.797009 484.797009 0 0 1-480.945047 424.170467z m-93.404112-911.551402C194.936847 102.603364 49.961894 279.31514 49.961894 486.376075c0 240.951028 195.971589 436.886729 436.874766 436.886729 205.960374 0 382.456822-144.08972 426.407477-341.329346a412.195888 412.195888 0 0 1-130.859066 21.53271h-0.442617a409.540187 409.540187 0 0 1-290.392523-120.296075 410.856075 410.856075 0 0 1-98.093458-423.644112z" fill="#333333" p-id="13077" class="default_pointer_cs" />
            </svg>
            <span class="text-xl text-gray-900 font-bold dark:text-white">Moon</span>
          </NuxtLink>
        </div>

        <!-- 导航 -->
        <div class="hidden md:flex md:flex-1 md:flex-justify-end">
          <div class="flex space-x-4">
            <NuxtLink
              v-for="nav in navigation"
              :key="nav.name"
              :to="nav.router"
              class="rounded-md px-3 py-2 text-sm text-gray-700 font-medium transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {{ nav.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-3">
          <button
            class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="toggleDarkMode"
          >
            <svg class="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
            </svg>
          </button>

          <button class="hidden items-center border border-transparent rounded-md from-blue-500 to-purple-500 bg-gradient-to-r px-4 py-2 text-sm text-white font-medium transition-all md:inline-flex hover:from-blue-600 hover:to-purple-600">
            Get Started
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
            class="text-nav-color block rounded-md px-3 py-2 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
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
</style>
