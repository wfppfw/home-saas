<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const uploadedImage = ref(null)
const previewUrl = ref(null)
const errorMessage = ref('')
const showAdvanced = ref(false)
const sourceFormat = ref('auto')
const targetFormat = ref('png')
const base64Input = ref('')
const svgInput = ref('')

async function handleFileUpload(e) {
  const file = e.target.files[0]
  if (!file)
    return

  try {
    uploadedImage.value = file
    previewUrl.value = URL.createObjectURL(file)
    errorMessage.value = ''
  }
  catch (error) {
    handleError('文件读取失败')
  }
}

async function convertImage() {
  try {
    const image = await createImageBitmap(uploadedImage.value)
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0)

    canvas.toBlob((blob) => {
      previewUrl.value = URL.createObjectURL(blob)
    }, `image/${targetFormat.value}`, 0.9)
  }
  catch (error) {
    handleError('图片转换失败')
  }
}

function formatFileSize(bytes) {
  if (bytes === 0)
    return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

function base64ToImage() {
  try {
    previewUrl.value = base64Input.value
    errorMessage.value = ''
  }
  catch (error) {
    handleError('Base64格式错误')
  }
}

function imageToBase64() {
  const reader = new FileReader()
  reader.onload = () => {
    base64Input.value = reader.result
  }
  reader.readAsDataURL(uploadedImage.value)
}

function svgToImage() {
  try {
    const svgBlob = new Blob([svgInput.value], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    previewUrl.value = url
  }
  catch (error) {
    handleError('SVG转换失败')
  }
}

function downloadImage() {
  const link = document.createElement('a')
  link.href = previewUrl.value
  link.download = `converted.${targetFormat.value}`
  link.click()
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(previewUrl.value)
  }
  catch (error) {
    handleError('复制失败')
  }
}

function handleError(message) {
  errorMessage.value = message
  setTimeout(() => errorMessage.value = '', 3000)
}

function toggleAdvanced() {
  showAdvanced.value = !showAdvanced.value
}

function clearFile() {
  // 释放对象URL
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }

  // 重置所有相关状态
  uploadedImage.value = null
  previewUrl.value = null
  base64Input.value = ''
  svgInput.value = ''
  errorMessage.value = ''

  // 重置文件输入框
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="mx-auto max-w-6xl rounded-xl bg-white p-4 shadow-lg transition-colors dark:bg-gray-800">
    <h1 class="mb-6 text-2xl text-gray-800 font-bold dark:text-gray-200">
      图片格式转换工具
    </h1>

    <!-- 主内容区 -->
    <div class="md:grid md:grid-cols-[1.5fr_1fr] md:gap-8">
      <!-- 左侧操作区 -->
      <div class="space-y-6">
        <!-- 文件上传区域 -->
        <div class="mb-6">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileUpload"
          >
          <div
            class="cursor-pointer border-2 border-gray-300 rounded-lg border-dashed p-6 text-center transition-colors dark:border-gray-600 hover:border-blue-500"
            @click="$refs.fileInput.click()"
          >
            <div v-if="!uploadedImage" class="text-center">
              <p class="text-gray-600 dark:text-gray-400">
                点击上传图片或拖放文件到这里
              </p>
            </div>

            <!-- 上传成功状态 -->
            <div v-else class="flex items-center justify-center gap-3">
              <div class="flex items-center gap-2 text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="font-medium">上传成功</span>
              </div>
              <span class="max-w-[200px] truncate text-sm text-gray-600 dark:text-gray-300">
                {{ uploadedImage.name }}
              </span>
            </div>

            <!-- <button
              class="p-1 text-gray-400 transition-colors hover:text-red-500 dark:hover:text-red-400"
              title="清空文件"
              @click.stop="clearFile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button> -->
          </div>

          <p v-if="uploadedImage" class="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            已选择: {{ formatFileSize(uploadedImage.size) }} · {{ uploadedImage.type }}
          </p>
        </div>

        <!-- 转换选项 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-2 block text-sm text-gray-700 font-medium dark:text-gray-300">源格式</label>
            <select
              v-model="sourceFormat"
              class="w-full border border-gray-300 rounded bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            >
              <option value="auto">
                自动检测
              </option>
              <option value="png">
                PNG
              </option>
              <option value="jpeg">
                JPEG
              </option>
              <option value="webp">
                WebP
              </option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm text-gray-700 font-medium dark:text-gray-300">目标格式</label>
            <select
              v-model="targetFormat"
              class="w-full border border-gray-300 rounded bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            >
              <option value="png">
                PNG
              </option>
              <option value="jpeg">
                JPEG
              </option>
              <option value="webp">
                WebP
              </option>
            </select>
          </div>
        </div>

        <!-- 操作按钮组 -->
        <div class="flex flex-wrap gap-4">
          <button
            :disabled="!uploadedImage"
            class="flex-1 rounded bg-blue-500 px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-400 hover:bg-blue-600"
            @click="convertImage"
          >
            转换格式
          </button>

          <button
            class="flex-1 border border-blue-500 rounded px-4 py-2 text-blue-500 transition-colors hover:bg-blue-50 dark:hover:bg-gray-700"
            @click="toggleAdvanced"
          >
            {{ showAdvanced ? '隐藏高级' : '显示高级' }}
          </button>

          <button
            :disabled="!uploadedImage"
            class="flex-1 border border-red-500 rounded px-4 py-2 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-gray-700"
            @click="clearFile"
          >
            清空文件
          </button>
        </div>

        <!-- 高级选项 -->
        <div v-if="showAdvanced" class="space-y-6">
          <div>
            <label class="mb-2 block text-sm text-gray-700 font-medium dark:text-gray-300">Base64 ↔ 图片</label>
            <textarea
              v-model="base64Input"
              placeholder="输入Base64字符串或上传图片自动生成"
              class="h-32 w-full border border-gray-300 rounded bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
            <div class="mt-2 flex flex-wrap gap-2">
              <button
                :disabled="!base64Input"
                class="flex-1 rounded bg-green-500 px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-400 hover:bg-green-600"
                @click="base64ToImage"
              >
                → 图片
              </button>
              <button
                :disabled="!uploadedImage"
                class="flex-1 rounded bg-purple-500 px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-400 hover:bg-purple-600"
                @click="imageToBase64"
              >
                → Base64
              </button>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm text-gray-700 font-medium dark:text-gray-300">SVG转图片</label>
            <textarea
              v-model="svgInput"
              placeholder="输入SVG代码"
              class="h-32 w-full border border-gray-300 rounded bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
            <button
              :disabled="!svgInput"
              class="mt-2 w-full rounded bg-orange-500 px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-400 hover:bg-orange-600"
              @click="svgToImage"
            >
              SVG → 图片
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧预览区 -->
      <div class="mt-6 md:mt-0">
        <div v-if="previewUrl" class="sticky top-6">
          <h2 class="mb-2 text-lg text-gray-800 font-medium dark:text-gray-200">
            预览结果
          </h2>
          <div class="border border-gray-200 rounded-lg bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-900">
            <img :src="previewUrl" class="mb-4 w-full rounded">
            <div class="flex flex-wrap gap-2">
              <button
                class="flex-1 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                @click="downloadImage"
              >
                下载
              </button>
              <button
                class="flex-1 rounded bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
                @click="copyToClipboard"
              >
                复制Base64
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="h-full flex items-center justify-center border-2 border-gray-200 rounded-lg border-dashed p-6 dark:border-gray-700">
          <p class="text-center text-gray-500 dark:text-gray-400">
            转换结果将会在这里显示
          </p>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="mt-4 rounded bg-red-100 p-3 text-red-700 dark:bg-red-900 dark:text-red-200">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style>
.dark {
  color-scheme: dark;
}
</style>
