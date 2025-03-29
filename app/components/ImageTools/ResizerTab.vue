<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  initialWidth: { type: Number, default: 800 },
  initialHeight: { type: Number, default: 600 },
})

const emit = defineEmits(['file-uploaded'])

// 响应式状态
const imageUrl = ref('')
const width = ref(props.initialWidth)
const height = ref(props.initialHeight)
const quality = ref(100)
const lockAspectRatio = ref(true)
const isDragging = ref(false)
const originalWidth = ref(props.initialWidth)
const originalHeight = ref(props.initialHeight)
const dragActive = ref(false)
const fileInput = ref(null)
const startX = ref(0)
const startY = ref(0)
const startWidth = ref(0)
const startHeight = ref(0)
const previewImage = ref(null)
const showQualityTip = ref(false)

// 预设尺寸
const presetSizes = [
  { label: '手机竖版', width: 720, height: 1280 },
  { label: '手机横版', width: 1280, height: 720 },
  { label: '电脑壁纸', width: 1920, height: 1080 },
  { label: '社交媒体', width: 1080, height: 1080 },
]

// 文件处理逻辑
function handleFileSelect(e) {
  const file = e.target.files?.[0]
  if (file && file.type.startsWith('image/')) {
    processImageFile(file)
  }
}

function handleDrop(e) {
  dragActive.value = false
  const file = e.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) {
    processImageFile(file)
  }
}

function processImageFile(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target.result
    loadImageDimensions(e.target.result)
    emit('file-uploaded', file)
  }
  reader.readAsDataURL(file)
}

function loadImageDimensions(url) {
  const img = new Image()
  img.onload = () => {
    originalWidth.value = img.naturalWidth
    originalHeight.value = img.naturalHeight
    width.value = img.naturalWidth
    height.value = img.naturalHeight
  }
  img.src = url
}

// 拖拽调整尺寸逻辑
function startDrag(e) {
  isDragging.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  startWidth.value = width.value
  startHeight.value = height.value

  window.addEventListener('mousemove', handleDrag)
  window.addEventListener('mouseup', stopDrag)
}

function handleDrag(e) {
  if (!isDragging.value)
    return

  const deltaX = e.clientX - startX.value
  const deltaY = e.clientY - startY.value

  width.value = startWidth.value + deltaX
  if (lockAspectRatio.value) {
    height.value = startHeight.value + (deltaX * (originalHeight.value / originalWidth.value))
  }
  else {
    height.value = startHeight.value + deltaY
  }
}

function stopDrag() {
  isDragging.value = false
  window.removeEventListener('mousemove', handleDrag)
  window.removeEventListener('mouseup', stopDrag)
}

// 比例锁定逻辑
function toggleLock() {
  lockAspectRatio.value = !lockAspectRatio.value
  if (lockAspectRatio.value) {
    originalWidth.value = width.value
    originalHeight.value = height.value
  }
}

watch([width, height], ([newWidth, newHeight], [oldWidth, oldHeight]) => {
  if (!lockAspectRatio.value)
    return

  if (newWidth !== oldWidth) {
    height.value = Math.round(newWidth * (originalHeight.value / originalWidth.value))
  }
  else if (newHeight !== oldHeight) {
    width.value = Math.round(newHeight * (originalWidth.value / originalHeight.value))
  }
})

// 预设尺寸应用
function applyPreset(preset) {
  width.value = preset.width
  height.value = preset.height
}

function isActivePreset(preset) {
  return width.value === preset.width && height.value === preset.height
}

// 文件拖拽处理
function handleDragOver() {
  dragActive.value = true
}

function handleDragLeave() {
  dragActive.value = false
}

function triggerFileInput() {
  if (!imageUrl.value) {
    fileInput.value.click()
  }
}

// 检查是否为JPEG格式
const isJPEG = computed(() => {
  return imageUrl.value?.startsWith('data:image/jpeg')
    || imageUrl.value?.endsWith('.jpg')
    || imageUrl.value?.endsWith('.jpeg')
})
// 下载功能
async function downloadImage() {
  if (!previewImage.value)
    return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // 设置输出尺寸
  canvas.width = width.value
  canvas.height = height.value

  // 绘制缩放后的图片
  ctx.drawImage(
    previewImage.value,
    0,
    0,
    previewImage.value.naturalWidth,
    previewImage.value.naturalHeight,
    0,
    0,
    width.value,
    height.value,
  )

  // 生成图片文件
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `image-${Date.now()}${isJPEG.value ? '.jpg' : '.png'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, isJPEG.value ? 'image/jpeg' : 'image/png', isJPEG.value ? quality.value / 100 : 1)
}
</script>

<template>
  <div class="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-lg transition-colors md:flex-row dark:bg-gray-900">
    <!-- 左侧控制面板 -->
    <div class="w-full md:w-300px space-y-6">
      <!-- 下载按钮 -->
      <div>
        <button
          class="w-full flex items-center justify-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          :disabled="!imageUrl"
          @click="downloadImage"
        >
          <div class="i-carbon-download" />
          下载图片
        </button>
      </div>

      <!-- 尺寸预设 -->
      <div>
        <label class="mb-2 block text-sm font-medium dark:text-gray-100">预设尺寸</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="(preset, index) in presetSizes"
            :key="index"
            class="border rounded-md p-2 text-left text-sm dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{ 'bg-blue-100 dark:bg-blue-800': isActivePreset(preset) }"
            @click="applyPreset(preset)"
          >
            {{ preset.label }}<br>
            <span class="text-xs text-gray-500">{{ preset.width }}×{{ preset.height }}</span>
          </button>
        </div>
      </div>

      <!-- 尺寸控制 -->
      <div class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium dark:text-gray-100">宽度</label>
          <div class="flex gap-2">
            <input
              v-model.number="width"
              type="number"
              class="w-full border rounded-md px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            >
            <button
              class="rounded-md px-3 hover:bg-gray-100 dark:hover:bg-gray-700"
              :title="lockAspectRatio ? '解锁比例' : '锁定比例'"
              @click="toggleLock"
            >
              <div :class="lockAspectRatio ? 'i-carbon-locked' : 'i-carbon-unlocked'" />
            </button>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium dark:text-gray-100">高度</label>
          <input
            v-model.number="height"
            type="number"
            class="w-full border rounded-md px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
          >
        </div>
      </div>

      <!-- 质量控制 -->
      <div>
        <label class="group relative mb-2 block text-sm font-medium dark:text-gray-100">
          <span
            class="flex cursor-help items-center gap-1"
            @mouseenter="showQualityTip = true"
            @mouseleave="showQualityTip = false"
          >
            画质 ({{ quality }}%)
            <div class="i-carbon-information text-xs" />
          </span>
          <transition name="fade">
            <div
              v-if="showQualityTip"
              class="absolute left-0 top-full z-50 mt-1 w-48 rounded-md bg-gray-800 p-2 text-xs text-gray-100 shadow-lg dark:bg-gray-200 dark:text-gray-800"
            >
              质量参数仅对JPEG格式生效
            </div>
          </transition>
        </label>
        <input
          v-model.number="quality"
          type="range"
          min="1"
          max="100"
          class="w-full"
        >
      </div>
    </div>

    <!-- 右侧预览上传区域 -->
    <div
      class="relative min-h-300px flex-1 border-2 rounded-lg border-dashed dark:border-gray-700"
      :class="[dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300']"
      style="max-width: 800px; height: 600px;"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept="image/*"
        @change="handleFileSelect"
      >

      <!-- 上传提示 -->
      <div v-if="!imageUrl" class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <div class="i-carbon-image mb-4 text-4xl text-gray-400" />
        <p class="text-gray-600 font-medium dark:text-gray-300">
          点击选择或拖拽图片到此区域
        </p>
        <p class="mt-2 text-sm text-gray-500">
          支持 JPEG、PNG、WEBP 格式
        </p>
      </div>

      <!-- 预览区域 -->
      <div
        v-else
        class="relative h-full w-full overflow-auto p-4"
        @mousedown="startDrag"
      >
        <div class="relative mx-auto">
          <img
            ref="previewImage"
            :src="imageUrl"
            class="object-contain"
            :style="{
              width: `${originalWidth}px`,
              height: `${originalHeight}px`,
              filter: isDragging ? 'brightness(0.8)' : 'none',
            }"
            alt="Preview"
          >

          <!-- 尺寸显示 -->
          <div class="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
            输出尺寸: {{ width }}px × {{ height }}px (质量: {{ quality }}%)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

  <style>
  /* 提示框动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滚动条样式 */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.overflow-auto::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

/* 其他样式保持不变 */
.cursor-nwse-resize {
  cursor: nwse-resize;
}

.dark .dark\:bg-gray-900 {
  transition: background-color 0.3s ease;
}

input[type='range'] {
  @apply appearance-none h-2 bg-gray-200 rounded-lg dark:bg-gray-700;
}

input[type='range']::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-blue-500 rounded-full cursor-pointer transition-all;
}

input[type='range']::-webkit-slider-thumb:hover {
  @apply bg-blue-600 scale-110;
}

.min-h-300px {
  min-height: 300px;
}
</style>
