<script setup>
import { computed, ref } from 'vue'

// 定义 props
const props = defineProps({
  // 颜色变化范围
  colorRange: {
    type: Number,
    default: 50, // 默认颜色变化范围
  },
  // 初始颜色（RGB 格式）
  initialColor: {
    type: String,
    default: 'rgb(100, 100, 100)', // 默认初始颜色
  },
})

const square = ref(null) // 方格的 DOM 元素
const currentColor = ref(props.initialColor) // 当前颜色
const colorMap = ref({}) // 存储每个位置的颜色

// 生成颜色函数
function getColor(x, y) {
  const baseColor = props.initialColor.match(/\d+/g).map(Number) // 提取初始颜色的 RGB 值
  const range = props.colorRange

  // 根据 x 和 y 坐标生成颜色
  const r = baseColor[0] + Math.floor((x / 500) * range)
  const g = baseColor[1] + Math.floor((y / 500) * range)
  const b = baseColor[2] + Math.floor(((x + y) / 1000) * range)
  return `rgb(${r}, ${g}, ${b})`
}

// 处理鼠标移动事件
function handleMouseMove(event) {
  const rect = square.value.getBoundingClientRect()
  const x = event.clientX - rect.left // 鼠标相对于方格的 X 坐标
  const y = event.clientY - rect.top // 鼠标相对于方格的 Y 坐标

  // 生成位置键
  const positionKey = `${Math.floor(x)},${Math.floor(y)}`

  // 如果该位置没有颜色，生成并存储
  if (!colorMap.value[positionKey]) {
    colorMap.value[positionKey] = getColor(x, y)
  }

  // 设置当前颜色
  currentColor.value = colorMap.value[positionKey]
}
</script>

<template>
  <div
    ref="square"
    :style="{ backgroundColor: currentColor, width: '500px', height: '500px', border: '2px solid #000' }"
    @mousemove="handleMouseMove"
  />
</template>

  <style scoped>
  /* 可以在这里添加样式 */
</style>
