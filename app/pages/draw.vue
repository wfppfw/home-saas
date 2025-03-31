<script setup>
const canvasRef = ref(null)
const ctx = ref(null)
const isDrawing = ref(false)
const history = ref([])
const currentPath = ref([])

// 工具相关状态
const currentTool = ref('pen')
const penColor = ref('#000000')
const brushSize = ref(5)
const eraserSize = ref(20)

// 计算当前尺寸
const currentSize = computed({
  get: () => currentTool.value === 'pen' ? brushSize.value : eraserSize.value,
  set: (val) => {
    if (currentTool.value === 'pen') {
      brushSize.value = val
    }
    else {
      eraserSize.value = val
    }
  },
})

// 初始化画布
onMounted(() => {
  const canvas = canvasRef.value
  const dpr = window.devicePixelRatio || 1

  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  ctx.value = canvas.getContext('2d')
  ctx.value.scale(dpr, dpr)
  ctx.value.lineCap = 'round'
  ctx.value.lineJoin = 'round'
})

// 获取画布坐标
function getCanvasCoordinates(event) {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY

  return {
    x: (clientX - rect.left) * (canvas.width / rect.width) / window.devicePixelRatio,
    y: (clientY - rect.top) * (canvas.height / rect.height) / window.devicePixelRatio,
  }
}

// 开始绘制
function startDrawing(event) {
  isDrawing.value = true
  const { x, y } = getCanvasCoordinates(event)
  currentPath.value = [{ x, y }]

  ctx.value.beginPath()
  ctx.value.moveTo(x, y)
}

// 绘制中
function draw(event) {
  if (!isDrawing.value)
    return

  const { x, y } = getCanvasCoordinates(event)
  currentPath.value.push({ x, y })

  if (currentTool.value === 'eraser') {
    ctx.value.globalCompositeOperation = 'destination-out'
    ctx.value.strokeStyle = 'rgba(0,0,0,1)'
  }
  else {
    ctx.value.globalCompositeOperation = 'source-over'
    ctx.value.strokeStyle = penColor.value
  }

  ctx.value.lineWidth = currentSize.value
  ctx.value.lineTo(x, y)
  ctx.value.stroke()
}

// 结束绘制
function endDrawing() {
  if (!isDrawing.value)
    return

  isDrawing.value = false
  history.value.push({
    tool: currentTool.value,
    color: currentTool.value === 'pen' ? penColor.value : null,
    size: currentSize.value,
    path: [...currentPath.value],
  })
}

// 撤销功能
function undo() {
  if (history.value.length === 0)
    return

  history.value.pop()
  redraw()
}

// 重绘画布
function redraw() {
  const canvas = canvasRef.value
  ctx.value.clearRect(0, 0, canvas.width, canvas.height)

  history.value.forEach((record) => {
    ctx.value.beginPath()
    ctx.value.globalCompositeOperation = record.tool === 'eraser'
      ? 'destination-out'
      : 'source-over'

    ctx.value.strokeStyle = record.tool === 'pen' ? record.color : 'rgba(0,0,0,1)'
    ctx.value.lineWidth = record.size

    record.path.forEach((point, index) => {
      if (index === 0) {
        ctx.value.moveTo(point.x, point.y)
      }
      else {
        ctx.value.lineTo(point.x, point.y)
      }
    })

    ctx.value.stroke()
  })

  ctx.value.globalCompositeOperation = 'source-over'
}

// 保存功能
function saveCanvas() {
  const canvas = canvasRef.value
  const dataUrl = canvas.toDataURL('image/png')

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
          :class="currentTool === 'pen' ? 'bg-blue-500' : 'bg-gray-300'"
          class="rounded px-4 py-2 text-white"
          @click="currentTool = 'pen'"
        >
          画笔
        </button>
        <button
          :class="currentTool === 'eraser' ? 'bg-blue-500' : 'bg-gray-300'"
          class="rounded px-4 py-2 text-white"
          @click="currentTool = 'eraser'"
        >
          橡皮擦
        </button>
      </div>

      <!-- 颜色选择 -->
      <input
        v-if="currentTool === 'pen'"
        v-model="penColor"
        type="color"
        class="h-10 w-10"
      >

      <!-- 尺寸控制 -->
      <input
        v-model="currentSize"
        type="range"
        :min="1"
        :max="currentTool === 'pen' ? 50 : 100"
        class="w-32"
      >

      <!-- 功能按钮 -->
      <button
        :disabled="history.length === 0"
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
        {{ currentTool === 'pen' ? '画笔' : '橡皮擦' }}尺寸: {{ currentSize }}
      </span>
    </div>

    <!-- 画布区域 -->
    <canvas
      ref="canvasRef"
      class="flex-1 touch-none bg-white"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="endDrawing"
      @mouseleave="endDrawing"
      @touchstart.prevent="startDrawing"
      @touchmove.prevent="draw"
      @touchend.prevent="endDrawing"
    />
  </div>
</template>

  <style>
  canvas {
  touch-action: none;
}
</style>
