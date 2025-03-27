<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
  // 缩放比例
  scale: {
    type: Number,
    default: 1.5,
  },
  // 动画时长 (ms)
  duration: {
    type: Number,
    default: 300,
  },
  // 统计信息
  stats: {
    type: Array,
    default: () => [
      { label: '好友', value: 235 },
      { label: '留言', value: 12 },
      { label: '访问', value: 1200 },
    ],
  },
  // 菜单项
  menus: {
    type: Array,
    default: () => [
      { label: '个人资料', icon: 'ph:identification-badge-bold', url: '/profile' },
      { label: '账号设置', icon: 'simple-line-icons:settings' },
    ],
  },
})

// 响应式状态
const isHovered = ref(false)
const wrapper = ref(null)
const showRipple = ref(false)
const rippleStyle = ref({})
const animatedValues = ref(props.stats.map(() => 0))

// 动态计算卡片位置
const cardPosition = computed(() => {
  if (!wrapper.value)
    return {}
  const rect = wrapper.value.getBoundingClientRect()
  return {
    top: `${rect.height * props.scale / 2 + 10}px`, // 10px间距
    left: '50%',
    transform: 'translateX(-50%)',
  }
})

// 数值动画
function animateValues() {
  props.stats.forEach((item, index) => {
    const target = item.value
    const start = Date.now()

    const update = () => {
      const progress = Math.min((Date.now() - start) / 500, 1)
      animatedValues.value[index] = Math.floor(target * progress)
      if (progress < 1)
        requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  })
}

const router = useRouter()
function backFn() {
  router.go(-1) // -1 表示返回上一页
}
function navigateToProfile(path) {
  navigateTo(path)
}

// 波纹效果
function handleRipple(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  rippleStyle.value = {
    left: `${e.clientX - rect.left - 10}px`,
    top: `${e.clientY - rect.top - 10}px`,
  }
  showRipple.value = true
  setTimeout(() => showRipple.value = false, 600)
}

// 生命周期
onMounted(() => {
  animateValues()
  watch(() => props.stats, animateValues)
})
</script>

<template>
  <!-- 组件结构 -->
  <div ref="wrapper" class="avatar-card-wrapper relative inline-block">
    <div
      class="trigger-container"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @click="handleRipple"
    >
      <!-- 插槽容器 -->
      <div
        class="avatar-trigger"
        :class="{ 'is-hovered': isHovered }"
      >
        <!-- 插槽内容 -->
        <div class="avatar-content cursor-my-pointer" @click="navigateToProfile('/profile')">
          <slot />
        </div>

        <!-- 波纹效果 -->
        <!-- <div
          v-if="showRipple"
          class="ripple-effect"
          :style="rippleStyle"
        /> -->
      </div>

      <!-- 悬浮卡片 -->
      <transition name="card-transition">
        <div
          v-show="isHovered"
          class="profile-card"
          :style="cardPosition"
        >
          <!-- 卡片内容插槽 -->
          <slot name="card">
            <!-- 默认卡片内容 -->
            <div class="default-card-content">
              <div class="statistics">
                <div v-for="(stat, index) in stats" :key="stat.label" class="cursor-my-pointer stat-item">
                  <div class="value">
                    {{ animatedValues[index] }}
                  </div>
                  <div class="label">
                    {{ stat.label }}
                  </div>
                </div>
              </div>
              <div class="menu-items">
                <NuxtLink v-for="item in menus" :key="item.label" :to="item.url" class="cursor-my-pointer menu-item">
                  <Icon :name="item.icon" class="icon" />
                  <span>{{ item.label }}</span>
                </NuxtLink>
              </div>
            </div>
          </slot>
        </div>
      </transition>
    </div>
  </div>
</template>

  <style scoped>
  /* 容器样式 */
.avatar-card-wrapper {
  --scale-factor: v-bind('props.scale');
  --avatar-size: 40px; /* 默认尺寸，自动适配插槽内容 */
}
/* 触发容器 */
.trigger-container {
  @apply relative inline-block;
}

/* 头像触发区域 */
.avatar-trigger {
  @apply relative cursor-pointer;
  transform-origin: right top;
  transition: transform v-bind('`${props.duration}ms`') ease;

  &.is-hovered {
    transform: scale(var(--scale-factor));
    z-index: 10;

    .avatar-content {
      /* @apply shadow-lg;
      box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.15); */
    }
  }
}

/* 头像内容 */
.avatar-content {
  @apply rounded-full overflow-hidden border-2 border-white;
  width: var(--avatar-size);
  height: var(--avatar-size);
  right: 0; /* 保持右侧定位 */
  transition: box-shadow 0.3s ease;

  :slotted(img) {
    @apply w-full h-full object-cover;
  }
}

/* 悬浮卡片 */
.profile-card {
  @apply absolute left-1/2 bg-white rounded-lg shadow-xl p-4 min-w-[224px] top-1 border border-gray-100;
  /* 根据新的缩放方向调整定位 */
  top: calc(100% + 10px);
  right: 0;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); /* 优化阴影与边框的配合 */

  transform: none; /* 移除之前的居中定位 */

  /* 默认卡片样式 */
  .default-card-content {
    @apply space-y-4;

    .statistics {
      @apply flex justify-between pb-4 border-b;

      .stat-item {
        @apply text-center px-2;

        .value {
          @apply text-lg font-medium text-gray-800;
        }

        .label {
          @apply text-xs text-gray-500 mt-1;
        }
      }
    }

    .menu-items {
      @apply space-y-2;

      .menu-item {
        @apply flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors;

        .icon {
          @apply w-5 h-5 text-gray-600;
        }

        span {
          @apply text-sm text-gray-700;
        }
      }
    }
  }
}

/* 卡片入场动画 */
.card-transition-enter-active {
  transition:
    opacity 0.3s ease-out,
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-transition-leave-active {
  transition:
    opacity 0.2s ease-in,
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-transition-enter-from,
.card-transition-leave-to {
  opacity: 0;
  transform: translateY(10px) translateX(10px);
}

/* 波纹效果 */
.ripple-effect {
  @apply absolute w-20 h-20 bg-blue-100/30 rounded-full;
  animation: ripple 0.6s ease-out forwards;
}

@keyframes ripple {
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
