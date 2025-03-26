<script setup>
import { onMounted, ref, watch } from 'vue'

// 图标引入（示例路径）
// const FriendsIcon = resolveComponent('FriendsIcon')
// const MessageIcon = resolveComponent('MessageIcon')
// const VisitIcon = resolveComponent('VisitIcon')
// const ProfileIcon = resolveComponent('ProfileIcon')
// const SettingsIcon = resolveComponent('SettingsIcon')
// const LogoutIcon = resolveComponent('LogoutIcon')

// 统计数据
const stats = ref([
  { label: '好友', value: 235 },
  { label: '留言', value: 12 },
  { label: '访问', value: 1200 }, // 存储实际数值
])

// 菜单数据
const menus = ref([
  { label: '个人资料', icon: 'ph:identification-badge-bold' },
  { label: '账号设置', icon: 'simple-line-icons:settings' },
])

// 动画数值
const animatedValues = ref(stats.value.map(() => 0))

// 数值动画
function animateValues() {
  stats.value.forEach((item, index) => {
    const target = item.value
    const duration = 1500
    const startTime = Date.now()

    const update = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1)
      animatedValues.value[index] = Math.floor(target * progress)

      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }
    requestAnimationFrame(update)
  })
}

// 波纹效果
const showRipple = ref(false)
const rippleStyle = ref({})
let rippleTimer = null

function handleRipple(e) {
  const rect = e.target.getBoundingClientRect()
  rippleStyle.value = {
    left: `${e.clientX - rect.left - 10}px`,
    top: `${e.clientY - rect.top - 10}px`,
  }
  showRipple.value = true
  clearTimeout(rippleTimer)
  rippleTimer = setTimeout(() => {
    showRipple.value = false
  }, 600)
}

// 初始化
onMounted(() => {
  animateValues()
})
</script>

<template>
  <nav class="h-16 flex items-center justify-end bg-white px-6 shadow-sm">
    <div class="group relative m-auto">
      <!-- 头像容器 -->
      <div
        class="cursor-my-pointer relative z-10"
        @click="handleRipple"
      >
        <img
          class="z-10 h-10 w-10 origin-bottom origin-top-right border-(2 transparent solid) rounded-full transition-all duration-300 group-hover:scale-150 hover:border-blue-200"
          src="/moon.png"
          alt="用户头像"
        >
        <!-- 波纹效果 -->
        <div
          v-if="showRipple"
          class="animate-ripple absolute h-20 w-20 rounded-full bg-blue-100/30"
          :style="rippleStyle"
        />
      </div>

      <!-- 悬浮卡片 -->
      <div
        class="invisible absolute left-1/2 top-[calc(100%+28px)] z-5 z-50 h-72 w-56 border-1 border-[#e5e7eb] rounded-lg border-solid bg-white p-4 opacity-0 shadow-xl transition-all duration-300 group-hover:(visible opacity-100) -translate-x-1/2"
      >
        <!-- 统计信息 -->
        <div class="mb-6 flex justify-between px-1">
          <div
            v-for="(item, index) in stats"
            :key="item.label"
            class="relative flex-1 text-center"
          >
            <div class="h-8 overflow-hidden">
              <Transition name="count">
                <div
                  :key="animatedValues[index]"
                  class="text-lg text-gray-800 font-medium"
                >
                  {{ item.label === '访问' ? `${animatedValues[index]}k` : animatedValues[index] }}
                </div>
              </Transition>
            </div>
            <div class="relative mt-1 text-xs text-gray-400">
              {{ item.label }}
              <span
                v-if="item.label === '留言' && item.value > 0"
                class="absolute h-2 w-2 rounded-full bg-red-500 -right-3 -top-1.5"
              />
            </div>
          </div>
        </div>

        <!-- 功能菜单 -->
        <div class="mb-3 space-y-2">
          <div
            v-for="item in menus"
            :key="item.label"
            class="icon-hover flex items-center gap-3 rounded-lg p-2 transition-colors duration-200 hover:bg-gray-50"
          >
            <Icon :name="item.icon" class="h-5 w-5 text-gray-500" />
            <span class="text-sm text-gray-700">{{ item.label }}</span>
          </div>
        </div>

        <!-- 分割线 -->
        <div class="my-3 h-px bg-gray-100" />

        <!-- 退出登录 -->
        <div class="icon-hover flex items-center gap-3 rounded-lg p-2 transition-colors duration-200 hover:bg-gray-50">
          <Icon name="ph:sign-out-bold" class="h-5 w-5 text-red-400" />
          <span class="text-sm text-red-500">退出登录</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
/* 波纹动画 */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
.animate-ripple {
  animation: ripple 0.6s ease-out forwards;
}

/* 数字过渡 */
.count-enter-active,
.count-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
}
.count-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.count-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 图标悬停 */
.icon-hover {
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}
.icon-hover:hover {
  transform: translateX(2px);
}

/* 自定义卡片阴影 */
.shadow-xl {
  box-shadow:
    0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}

/* 添加卡片进入动画 */
.group-hover .card-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.group-hover .card-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

/* 头像缩放优化 */
.group-hover img {
  will-change: transform;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

/* 高级分割线效果 */
.h-px {
  background: linear-gradient(90deg, transparent 10%, #e5e7eb 50%, transparent 90%);
  height: 1px;
}
</style>
