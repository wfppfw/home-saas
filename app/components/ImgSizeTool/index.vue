<!-- components/ImageResizer.vue -->
<script setup>
const fileInput = ref(null)
const previewCanvas = ref(null)

const isDragging = ref(false)
const originalImage = ref(null)
const originalSize = ref(0)
const originalWidth = ref(0)
const originalHeight = ref(0)
const originalAspectRatio = ref(1)

const targetWidth = ref(0)
const targetHeight = ref(0)
const keepAspectRatio = ref(true)
const quality = ref(85)
const autoOptimize = ref(true)
const isProcessing = ref(false)
const processedBlob = ref(null)
const estimatedSize = ref(0)

// 计算属性
const previewWidth = computed(() => Math.round(targetWidth.value))
const previewHeight = computed(() => Math.round(targetHeight.value))
const downloadUrl = computed(() => processedBlob.value ? URL.createObjectURL(processedBlob.value) : '')
const downloadFilename = computed(() =>
  `resized-${targetWidth.value}x${targetHeight.value}-q${quality.value}.${processedBlob.value?.type.split('/')[1] || 'jpg'}`,
)

// 文件处理
function handleDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file?.type.startsWith('image/'))
    handleFile(file)
}

function handleFileSelect(e) {
  const file = e.target.files[0]
  if (file)
    handleFile(file)
}

async function handleFile(file) {
  reset()
  originalSize.value = file.size
  originalImage.value = await loadImage(file)
  originalWidth.value = originalImage.value.width
  originalHeight.value = originalImage.value.height
  originalAspectRatio.value = originalWidth.value / originalHeight.value
  targetWidth.value = originalWidth.value
  targetHeight.value = originalHeight.value
  updatePreview()
}

// 图片处理逻辑
async function updatePreview() {
  if (!originalImage.value)
    return

  const canvas = previewCanvas.value
  const ctx = canvas.getContext('2d')

  canvas.width = targetWidth.value
  canvas.height = targetHeight.value

  // 高质量缩放
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(originalImage.value, 0, 0, canvas.width, canvas.height)

  // 估算文件大小（修正版本）
  const previewBlob = await new Promise(resolve =>
    canvas.toBlob(resolve, 'image/jpeg', quality.value / 100),
  )
  estimatedSize.value = previewBlob.size
}

async function processImage() {
  isProcessing.value = true
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = targetWidth.value
    canvas.height = targetHeight.value
    ctx.drawImage(originalImage.value, 0, 0, canvas.width, canvas.height)

    let qualityLevel = quality.value / 100
    if (autoOptimize.value) {
      // 自动优化逻辑（示例：限制文件大小在 500KB 内）
      const maxSize = 500 * 1024
      let blob = await canvasToBlob(canvas, qualityLevel)

      while (blob.size > maxSize && qualityLevel > 0.1) {
        qualityLevel -= 0.05
        blob = await canvasToBlob(canvas, qualityLevel)
      }
    }

    processedBlob.value = await canvasToBlob(canvas, qualityLevel)
  }
  catch (error) {
    console.error('处理失败:', error)
  }
  finally {
    isProcessing.value = false
  }
}

// 工具函数
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      resolve(img)
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        }
        else {
          reject(new Error('Failed to generate blob'))
        }
      },
      'image/jpeg',
      quality,
    )
  })
}

function formatFileSize(bytes) {
  if (bytes === 0)
    return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

function reset() {
  originalImage.value = null
  processedBlob.value = null
}

// 观察尺寸变化
watch([targetWidth, keepAspectRatio], ([width, keepRatio]) => {
  if (keepRatio && originalImage.value) {
    targetHeight.value = Math.round(width / originalAspectRatio.value)
  }
})

watch([targetHeight, keepAspectRatio], ([height, keepRatio]) => {
  if (keepRatio && originalImage.value) {
    targetWidth.value = Math.round(height * originalAspectRatio.value)
  }
})

watch([targetWidth, targetHeight, quality], () => {
  if (originalImage.value)
    updatePreview()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8 transition-colors duration-300 dark:bg-gray-900">
    <div class="mx-auto max-w-3xl">
      <div class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <!-- 文件上传区域 -->
        <div
          class="mb-6 cursor-pointer border-2 border-gray-300 rounded-lg border-dashed p-8 text-center transition-colors dark:border-gray-600"
          :class="isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          >
          <div v-if="!originalImage" class="space-y-4">
            <div class="i-carbon-image-search mx-auto text-4xl text-gray-400 dark:text-gray-500" />
            <p class="text-gray-600 dark:text-gray-400">
              拖放图片或
              <span
                class="text-blue-600 dark:text-blue-400 hover:underline"
                @click="$refs.fileInput.click()"
              >
                点击上传
              </span>
            </p>
          </div>
          <div v-else class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              原始尺寸：{{ originalWidth }}×{{ originalHeight }}px
              <br>
              原始大小：{{ formatFileSize(originalSize) }}
            </p>
          </div>
        </div>

        <!-- 控制区域 -->
        <div v-if="originalImage" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- 尺寸调整 -->
            <div class="space-y-4">
              <h3 class="text-lg text-gray-800 font-medium dark:text-gray-200">
                尺寸调整
              </h3>
              <div class="flex items-center gap-3">
                <div class="flex-1">
                  <label class="mb-1 block text-sm text-gray-700 dark:text-gray-300">宽度 (px)</label>
                  <input
                    v-model.number="targetWidth"
                    type="number"
                    min="1"
                    class="w-full border-gray-300 rounded-md dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 focus:ring-blue-500"
                  >
                </div>
                <div class="flex-1">
                  <label class="mb-1 block text-sm text-gray-700 dark:text-gray-300">高度 (px)</label>
                  <input
                    v-model.number="targetHeight"
                    type="number"
                    min="1"
                    class="w-full border-gray-300 rounded-md dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 focus:ring-blue-500"
                  >
                </div>
              </div>
              <div class="flex items-center gap-2">
                <input
                  id="keepRatio"
                  v-model="keepAspectRatio"
                  type="checkbox"
                  class="border-gray-300 rounded text-blue-600 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500"
                >
                <label for="keepRatio" class="text-sm text-gray-700 dark:text-gray-300">
                  保持宽高比 ({{ originalAspectRatio.toFixed(2) }})
                </label>
              </div>
            </div>

            <!-- 质量调整 -->
            <div class="space-y-4">
              <h3 class="text-lg text-gray-800 font-medium dark:text-gray-200">
                压缩设置
              </h3>
              <div class="space-y-2">
                <label class="block text-sm text-gray-700 dark:text-gray-300">
                  质量：{{ quality }}%
                  <span class="ml-2 text-gray-500">
                    (预计大小: {{ estimatedSize ? formatFileSize(estimatedSize) : '--' }})
                  </span>
                </label>
                <input
                  v-model.number="quality"
                  type="range"
                  min="1"
                  max="100"
                  class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-600"
                >
              </div>
              <div class="flex items-center gap-2">
                <input
                  id="autoOptimize"
                  v-model="autoOptimize"
                  type="checkbox"
                  class="border-gray-300 rounded text-blue-600 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500"
                >
                <label for="autoOptimize" class="text-sm text-gray-700 dark:text-gray-300">
                  自动优化文件大小
                </label>
              </div>
            </div>
          </div>

          <!-- 预览区域 -->
          <div class="overflow-hidden border rounded-lg bg-gray-100 dark:bg-gray-900">
            <div class="border-b border-gray-200 p-4 dark:border-gray-700">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                预览区域 {{ previewWidth }}×{{ previewHeight }}px
              </p>
            </div>
            <canvas ref="previewCanvas" class="mx-auto max-w-full" />
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-end gap-3">
            <button
              class="rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition-colors dark:bg-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="reset"
            >
              重置
            </button>
            <button
              :disabled="isProcessing"
              class="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors disabled:cursor-not-allowed hover:bg-blue-700 disabled:opacity-50"
              @click="processImage"
            >
              <span v-if="isProcessing">处理中...</span>
              <span v-else>开始处理</span>
            </button>
          </div>

          <!-- 结果下载 -->
          <div v-if="processedBlob" class="mt-6 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
            <p class="text-green-700 dark:text-green-400">
              处理成功！最终大小：{{ formatFileSize(processedBlob.size) }}
              <a
                :href="downloadUrl"
                :download="downloadFilename"
                class="ml-3 text-blue-600 dark:text-blue-400 hover:underline"
              >
                点击下载
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

  <style>
  /* 自定义滑块样式 */
input[type='range']::-webkit-slider-thumb {
  @apply w-4 h-4 bg-blue-600 rounded-full appearance-none cursor-pointer;
}

input[type='range']::-moz-range-thumb {
  @apply w-4 h-4 bg-blue-600 rounded-full border-none cursor-pointer;
}
</style>
