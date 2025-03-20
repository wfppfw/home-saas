<!-- components/ImageConverter.vue -->
<script setup>
const colorMode = useColorMode()
function toggleDark() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const targetFormat = ref('webp')
const quality = ref(85)
const selectedFile = ref(null)
const isConverting = ref(false)
const downloadUrl = ref('')
const isDragging = ref(false)
const statusMessage = ref('')

const showQuality = computed(() => ['jpeg', 'webp'].includes(targetFormat.value))

const statusClass = computed(() => ({
  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': statusMessage.value?.type === 'success',
  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': statusMessage.value?.type === 'error',
}))

function handleDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    selectedFile.value = file
  }
}

function handleFileSelect(e) {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

async function convertImage() {
  if (!selectedFile.value)
    return

  isConverting.value = true
  statusMessage.value = ''

  try {
    const img = await loadImage(selectedFile.value)
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height

    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    const mimeType = {
      webp: 'image/webp',
      jpeg: 'image/jpeg',
      png: 'image/png',
    }[targetFormat.value]

    const qualityValue = showQuality.value ? quality.value / 100 : 1

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, mimeType, qualityValue)
    })

    downloadUrl.value = URL.createObjectURL(blob)
    statusMessage.value = { type: 'success', message: '转换成功！点击下方链接下载' }
  }
  catch (error) {
    console.error(error)
    statusMessage.value = { type: 'error', message: `转换失败：${error.message}` }
  }
  finally {
    isConverting.value = false
  }
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(err)
    }
    img.src = url
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8 transition-colors duration-300 dark:bg-gray-900">
    <div class="mx-auto max-w-2xl">
      <!-- 头部和主题切换 -->
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-3xl text-gray-800 font-bold dark:text-gray-100">
          图片格式转换器
        </h1>
        <button
          class="rounded-lg p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          @click="toggleDark"
        >
          <div class="i-carbon-sun dark:i-carbon-moon h-6 w-6" />
        </button>
      </div>

      <!-- 主要操作区域 -->
      <div class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <!-- 文件上传区域 -->
        <div
          class="cursor-pointer border-2 border-gray-300 rounded-lg border-dashed p-8 text-center transition-colors dark:border-gray-600"
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
          <div class="i-carbon-image-search mx-auto text-4xl text-gray-400 dark:text-gray-500" />
          <p class="mt-4 text-gray-600 dark:text-gray-400">
            拖放图片文件到此处，或
            <span
              class="text-blue-600 dark:text-blue-400 hover:underline"
              @click="$refs.fileInput.click()"
            >
              点击选择文件
            </span>
          </p>
        </div>

        <!-- 转换选项 -->
        <div class="mt-6 space-y-4">
          <div class="flex items-center gap-4">
            <label class="flex-1 text-gray-700 dark:text-gray-300">
              目标格式：
              <select
                v-model="targetFormat"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 focus:ring-blue-500"
              >
                <option value="webp">WebP</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
              </select>
            </label>
            <label v-if="showQuality" class="flex-1 text-gray-700 dark:text-gray-300">
              质量 (0-100):
              <input
                v-model="quality"
                type="number"
                min="0"
                max="100"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 focus:ring-blue-500"
              >
            </label>
          </div>

          <!-- 状态提示 -->
          <div v-if="statusMessage" class="rounded-md p-3" :class="statusClass">
            {{ statusMessage }}
          </div>

          <!-- 操作按钮 -->
          <button
            :disabled="!selectedFile || isConverting"
            class="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium transition-colors disabled:cursor-not-allowed hover:bg-blue-700 disabled:opacity-50"
            @click="convertImage"
          >
            <span v-if="isConverting">转换中...</span>
            <span v-else>开始转换</span>
          </button>

          <!-- 下载链接 -->
          <a
            v-if="downloadUrl"
            :href="downloadUrl"
            :download="downloadFilename"
            class="mt-4 block text-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            点击下载转换后的文件
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

  <style>
  /* 确保暗黑模式过渡平滑 */
html.dark {
  @apply bg-gray-900;
  color-scheme: dark;
}
</style>
