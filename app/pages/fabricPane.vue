<script setup>
import { fabric } from 'fabric'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const canvasEl = ref(null)
const canvas = ref(null)

// 状态管理
const currentTool = ref('brush')
const brushColor = ref('#000000')
const brushSize = ref(5)
const eraserSize = ref(20)
const history = ref([])
const canUndo = computed(() => history.value.length > 0)

// 计算当前尺寸
const currentSize = computed({
  get: () => currentTool.value === 'brush' ? brushSize.value : eraserSize.value,
  set: (val) => {
    currentTool.value === 'brush'
      ? brushSize.value = val
      : eraserSize.value = val
    updateBrush()
  },
})

// 初始化画布
onMounted(() => {
  canvas.value = new fabric.Canvas(canvasEl.value, {
    isDrawingMode: true,
    selection: false,
    backgroundColor: '#ffffff',
    preserveObjectStacking: true,
  })

  // 初始化画笔
  updateBrush()

  // 监听绘制事件
  canvas.value.on('path:created', handlePathCreated)
})

// 清理资源
onBeforeUnmount(() => {
  canvas.value.dispose()
})

// 工具切换
function setTool(tool) {
  currentTool.value = tool
  canvas.value.isDrawingMode = tool === 'brush' || tool === 'eraser'
  updateBrush()
}

// 更新画笔属性
function updateBrush() {
  if (!canvas.value)
    return

  canvas.value.freeDrawingBrush = currentTool.value === 'eraser'
    ? createEraser()
    : createBrush()

  canvas.value.freeDrawingBrush.width = currentSize.value
}

// 创建普通画笔
function createBrush() {
  return new fabric.PencilBrush(canvas.value, {
    color: brushColor.value,
    opacity: 1,
    shadow: null,
  })
}

// 创建橡皮擦
function createEraser() {
  return new fabric.PencilBrush(canvas.value, {
    color: '#ffffff',
    opacity: 1,
    shadow: null,
    globalCompositeOperation: 'destination-out',
  })
}

// 路径创建处理
function handlePathCreated(event) {
  const path = event.path
  path.set({
    selectable: false,
    evented: false,
    globalCompositeOperation: currentTool.value === 'eraser'
      ? 'destination-out'
      : 'source-over',
  })

  history.value.push(path)
}

// 添加清空方法
function clearCanvas() {
  canvas.value.clear()
  history.value = []
}
// 撤销功能
function undo() {
  if (!canUndo.value)
    return

  const lastPath = history.value.pop()
  canvas.value.remove(lastPath)
}

// 保存功能
function saveCanvas() {
  const dataUrl = canvas.value.toDataURL({
    format: 'png',
    multiplier: 1,
  })

  const link = document.createElement('a')
  link.download = `drawing-${Date.now()}.png`
  link.href = dataUrl
  link.click()
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- 控制区域 -->
    <div class="flex flex-wrap items-center gap-2 bg-gray-100 p-2">
      <!-- 工具切换 -->
      <div class="flex gap-1">
        <button
          :class="currentTool === 'brush' ? 'bg-blue-500' : 'bg-gray-300'"
          class="rounded px-4 py-2 text-white"
          @click="setTool('brush')"
        >
          画笔
        </button>
        <button
          :class="currentTool === 'eraser' ? 'bg-blue-500' : 'bg-gray-300'"
          class="rounded px-4 py-2 text-white"
          @click="setTool('eraser')"
        >
          橡皮擦
        </button>
        <button
          class="rounded bg-red-500 px-4 py-2 text-white"
          @click="clearCanvas"
        >
          清空
        </button>
      </div>

      <!-- 颜色选择 -->
      <input
        v-model="brushColor"
        type="color"
        class="h-10 w-10"
      >

      <!-- 尺寸控制 -->
      <input
        v-model="currentSize"
        type="range"
        :min="1"
        :max="currentTool === 'brush' ? 50 : 100"
        class="w-32"
      >

      <!-- 功能按钮 -->
      <button
        :disabled="!canUndo"
        class="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        @click="undo"
      >
        撤销
      </button>
      <button
        class="rounded bg-green-500 px-4 py-2 text-white"
        @click="saveCanvas"
      >
        保存
      </button>
      <span class="ml-2">
        {{ currentTool === 'brush' ? '画笔' : '橡皮擦' }}尺寸: {{ currentSize }}
      </span>
    </div>

    <!-- 画布容器 -->
    <div class="relative flex-1 bg-white">
      <canvas
        ref="canvasEl"
        class="touch-none"
      />
    </div>
  </div>
</template>

  <style>
  /* 触摸优化 */
canvas {
  touch-action: none;
}

/* 画布尺寸适配 */
.canvas-container {
  width: 100% !important;
  height: 100% !important;
}
</style>
