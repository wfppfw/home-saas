<!-- components/HoverBubble.vue -->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

  type Strategy = 'absolute' | 'fixed'
type Position = 'top' | 'bottom' | 'left' | 'right'
const props = withDefaults(defineProps<{
  position?: Position
  strategy?: Strategy
  delay?: number
  offset?: number
  boundaryPadding?: number
  disabled?: boolean
  bubbleClass?: string
  bubbleProps?: object
}>(), {
  position: 'top',
  strategy: 'absolute',
  delay: 150,
  offset: 8,
  boundaryPadding: 16,
  disabled: false,
  bubbleClass: '',
  bubbleProps: () => ({}),
})

const emit = defineEmits(['show', 'hide', 'position-change'])

const isActive = ref(false)
const triggerRef = ref<HTMLElement>()
const bubbleRef = ref<HTMLElement>()
const chatBubbleRef = ref<any>()
const adjustedPosition = ref<Position>(props.position)
const positions: Position[] = ['top', 'bottom', 'left', 'right']
let enterTimer: number | null = null
let leaveTimer: number | null = null

// 延迟控制逻辑
function handleMouseEnter() {
  if (props.disabled)
    return
  clearTimers()
  enterTimer = window.setTimeout(activate, props.delay)
}

function handleMouseLeave() {
  clearTimers()
  leaveTimer = window.setTimeout(deactivate, props.delay / 2)
}

const handleFocus = () => !props.disabled && activate()
const handleBlur = () => deactivate()
const handleTouch = () => !props.disabled && (isActive.value = !isActive.value)

// 激活/停用逻辑
function activate() {
  if (isActive.value)
    return
  isActive.value = true
  emit('show')
}

function deactivate() {
  if (!isActive.value)
    return
  isActive.value = false
  emit('hide')
}

function clearTimers() {
  if (enterTimer)
    clearTimeout(enterTimer)
  if (leaveTimer)
    clearTimeout(leaveTimer)
}

// 智能定位系统
function updatePosition() {
  if (!triggerRef.value || !bubbleRef.value)
    return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const bubbleRect = bubbleRef.value.getBoundingClientRect()
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  // 计算最佳显示位置
  const positionMetrics = positions.map(pos => ({
    position: pos,
    visibleArea: calculateVisibleArea(pos, triggerRect, bubbleRect, viewport),
  }))

  const bestPosition = positionMetrics.reduce((prev, current) =>
    current.visibleArea > prev.visibleArea ? current : prev,
  ).position

  if (bestPosition !== adjustedPosition.value) {
    adjustedPosition.value = bestPosition
    emit('position-change', bestPosition)
  }
}

function calculateVisibleArea(position: Position, trigger: DOMRect, bubble: DOMRect, viewport: { width: number, height: number }) {
  const padding = props.boundaryPadding
  let left = 0; let top = 0

  switch (position) {
    case 'top':
      left = trigger.left + trigger.width / 2 - bubble.width / 2
      top = trigger.top - bubble.height - props.offset
      break
    case 'bottom':
      left = trigger.left + trigger.width / 2 - bubble.width / 2
      top = trigger.bottom + props.offset
      break
    case 'left':
      left = trigger.left - bubble.width - props.offset
      top = trigger.top + trigger.height / 2 - bubble.height / 2
      break
    case 'right':
      left = trigger.right + props.offset
      top = trigger.top + trigger.height / 2 - bubble.height / 2
      break
  }

  // 计算可见区域
  const visibleWidth = Math.max(0, Math.min(left + bubble.width + padding, viewport.width)
    - Math.max(left - padding, 0))

  const visibleHeight = Math.max(0, Math.min(top + bubble.height + padding, viewport.height)
    - Math.max(top - padding, 0))

  return visibleWidth * visibleHeight
}

// 气泡定位样式
const bubbleStyles = computed(() => {
  if (!triggerRef.value)
    return {}

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const scroll = {
    x: window.scrollX,
    y: window.scrollY,
  }

  const baseStyle = {
    position: props.strategy,
    zIndex: 9999,
    transition: 'opacity 0.2s, transform 0.2s',
  }

  switch (adjustedPosition.value) {
    case 'top':
      return {
        ...baseStyle,
        left: `${triggerRect.left + triggerRect.width / 2 + scroll.x}px`,
        top: `${triggerRect.top - props.offset + scroll.y}px`,
        transform: 'translate(-50%, -100%)',
      }
    case 'bottom':
      return {
        ...baseStyle,
        left: `${triggerRect.left + triggerRect.width / 2 + scroll.x}px`,
        top: `${triggerRect.bottom + props.offset + scroll.y}px`,
        transform: 'translateX(-50%)',
      }
    case 'left':
      return {
        ...baseStyle,
        left: `${triggerRect.left - props.offset + scroll.x}px`,
        top: `${triggerRect.top + triggerRect.height / 2 + scroll.y}px`,
        transform: 'translate(-100%, -50%)',
      }
    case 'right':
      return {
        ...baseStyle,
        left: `${triggerRect.right + props.offset + scroll.x}px`,
        top: `${triggerRect.top + triggerRect.height / 2 + scroll.y}px`,
        transform: 'translateY(-50%)',
      }
  }
  return {}
})

// 过渡动画控制
const transitionName = computed(() =>
  ['left', 'right'].includes(adjustedPosition.value) ? 'slide-x' : 'slide-y',
)

// 窗口事件处理
const handleResize = throttle(updatePosition, 100)
const handleScroll = throttle(updatePosition, 100)

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleScroll, true)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll)
  clearTimers()
})

// 工具函数
function throttle(fn: any, delay: number) {
  let lastCall = 0
  return (...args: any[]) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      fn(...args)
      lastCall = now
    }
  }
}
</script>

<template>
  <div
    ref="triggerRef"
    class="hover-bubble-wrapper"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focus="handleFocus"
    @blur="handleBlur"
    @touchstart.passive="handleTouch"
  >
    <!-- 触发元素插槽 -->
    <slot name="trigger" />

    <!-- 气泡显示控制 -->
    <Transition
      :name="transitionName"
      @after-enter="updatePosition"
      @after-leave="cleanupPosition"
    >
      <div
        v-if="isActive"
        ref="bubbleRef"
        class="hover-bubble-container"
        :style="bubbleStyles"
        role="tooltip"
      >
        <ChatBubble
          ref="chatBubbleRef"
          v-bind="bubbleProps"
          :position="adjustedPosition"
          :class="bubbleClass"
        >
          <slot />
        </ChatBubble>
      </div>
    </Transition>
  </div>
</template>

  <style>
  .hover-bubble-wrapper {
  @apply inline-block relative;
}

.hover-bubble-container {
  @apply pointer-events-none;
}

/* 垂直方向动画 */
.slide-y-enter-active,
.slide-y-leave-active {
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out;
}

.slide-y-enter-from,
.slide-y-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}

/* 水平方向动画 */
.slide-x-enter-active,
.slide-x-leave-active {
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out;
}

.slide-x-enter-from,
.slide-x-leave-to {
  opacity: 0;
  transform: translate(-8px, -50%);
}

/* 移动端优化 */
@media (max-width: 640px) {
  .hover-bubble-container {
    @apply max-w-[90vw];
  }

  .slide-x-enter-from,
  .slide-x-leave-to {
    transform: translate(-16px, -50%);
  }
}
</style>
