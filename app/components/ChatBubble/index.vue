<!-- components/ChatBubble.vue -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type Position = 'top' | 'bottom' | 'left' | 'right'
type Size = 'sm' | 'md' | 'lg'
type ArrowPlacement = 'start' | 'center' | 'end'

const props = withDefaults(defineProps<{
  position?: Position
  size?: Size
  backgroundColor?: string
  textColor?: string
  shadow?: string
  rounded?: string
  border?: string
  showArrow?: boolean
  arrowOffset?: number
  arrowPlacement?: ArrowPlacement
  maxWidth?: string
  ariaLabelledby?: string
}>(), {
  position: 'top',
  size: 'md',
  backgroundColor: 'bg-gray-100 dark:bg-gray-800',
  textColor: 'text-gray-800 dark:text-gray-100',
  shadow: 'shadow-md',
  rounded: 'rounded-lg',
  border: '',
  showArrow: true,
  arrowOffset: 0,
  arrowPlacement: 'center',
  maxWidth: 'none',
  ariaLabelledby: undefined,
})

const bubbleElement = ref<HTMLElement>()
const bubbleRect = ref<DOMRect>()
const hideArrow = ref(false)

// 尺寸系统
const sizeClass = computed(() => {
  const sizes: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
  }
  return sizes[props.size]
})

// 箭头样式计算
const arrowClass = computed(() => `arrow-${props.position}`)
const arrowStyle = computed(() => {
  const placementMap = {
    start: 20,
    center: 50,
    end: 80,
  }

  const positionPercentage = placementMap[props.arrowPlacement]
  const offset = props.arrowOffset

  return {
    '--arrow-color': `var(--bubble-arrow-color, ${getComputedColor()})`,
    'left': props.position === 'top' || props.position === 'bottom'
      ? `${positionPercentage}%`
      : undefined,
    'top': props.position === 'left' || props.position === 'right'
      ? `${positionPercentage}%`
      : undefined,
    'transform': getArrowTransform(positionPercentage, offset),
  }
})

const rootStyles = computed(() => ({
  maxWidth: props.maxWidth,
}))

// 样式类
const shadowClass = computed(() => props.shadow)
const roundedClass = computed(() => props.rounded)
const borderClass = computed(() => props.border)

function getComputedColor() {
  if (props.backgroundColor.startsWith('#')) {
    return props.backgroundColor
  }
  return `rgb(var(--un-${props.backgroundColor.replace('bg-', '')}))`
}

function getArrowTransform(percentage: number, offset: number) {
  const baseTransform = {
    top: `translateX(calc(-${percentage}% + ${offset}px))`,
    bottom: `translateX(calc(-${percentage}% + ${offset}px))`,
    left: `translateY(calc(-${percentage}% + ${offset}px))`,
    right: `translateY(calc(-${percentage}% + ${offset}px))`,
  }
  return baseTransform[props.position]
}

function updateBubbleRect() {
  if (bubbleElement.value) {
    bubbleRect.value = bubbleElement.value.getBoundingClientRect()
    checkArrowVisibility()
  }
}

function checkArrowVisibility() {
  if (!bubbleRect.value)
    return
  const viewportWidth = window.innerWidth
  hideArrow.value = viewportWidth < 640 && (props.position === 'left' || props.position === 'right')
}

onMounted(() => {
  updateBubbleRect()
  window.addEventListener('resize', updateBubbleRect)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateBubbleRect)
})
</script>

<template>
  <div
    class="chat-bubble-root"
    :style="rootStyles"
    role="tooltip"
    :aria-labelledby="ariaLabelledby"
  >
    <div
      ref="bubbleElement"
      class="chat-bubble-body" :class="[
        sizeClass,
        shadowClass,
        roundedClass,
        backgroundColor,
        textColor,
        borderClass,
      ]"
    >
      <slot />
    </div>

    <div
      v-if="showArrow && !hideArrow"
      class="chat-bubble-arrow"
      :class="arrowClass"
      :style="arrowStyle"
      aria-hidden="true"
    />
  </div>
</template>

<style>
.chat-bubble-root {
  @apply relative isolate;
  --bubble-arrow-color: inherit;
}

.chat-bubble-body {
  @apply relative transition-all duration-200 break-words z-[1];
  box-shadow: inherit;
}

.chat-bubble-arrow {
  @apply absolute w-0 h-0 border-transparent pointer-events-none;
  border-style: solid;
  z-index: 0;
}

/* 顶部箭头 */
.arrow-top {
  border-width: 0 10px 12px 10px;
  border-bottom-color: var(--bubble-arrow-color);
  bottom: calc(100% - 1px);
}

/* 底部箭头 */
.arrow-bottom {
  border-width: 12px 10px 0 10px;
  border-top-color: var(--bubble-arrow-color);
  top: calc(100% - 1px);
}

/* 左侧箭头 */
.arrow-left {
  border-width: 10px 12px 10px 0;
  border-right-color: var(--bubble-arrow-color);
  right: calc(100% - 1px);
}

/* 右侧箭头 */
.arrow-right {
  border-width: 10px 0 10px 12px;
  border-left-color: var(--bubble-arrow-color);
  left: calc(100% - 1px);
}

@media (max-width: 640px) {
  .arrow-left,
  .arrow-right {
    @apply opacity-0;
    transition: opacity 0.2s;
  }
}

/* 暗黑模式过渡 */
.dark .chat-bubble-body {
  @apply transition-colors duration-300;
}
</style>
