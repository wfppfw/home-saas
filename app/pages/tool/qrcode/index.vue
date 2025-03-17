<script setup>
import jsQR from 'jsqr'
import QRCode from 'qrcode'
import { computed, ref, watch } from 'vue'

const qrText = ref('')
const qrCodeData = ref('')
const qrResult = ref('')
const fileInput = ref(null)
const generateError = ref('')
const recognizeError = ref('')
const generating = ref(false)
const processing = ref(false)

// 响应式尺寸处理
const { width: windowWidth } = useWindowSize()
const qrSize = computed(() => windowWidth.value < 768 ? 200 : 300)

// 暗黑模式处理
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// 生成二维码
watch([qrText, isDark], async () => {
  generateError.value = ''
  if (!qrText.value) {
    qrCodeData.value = ''
    return
  }

  generating.value = true
  try {
    qrCodeData.value = await QRCode.toDataURL(qrText.value, {
      width: qrSize.value * 2, // 2倍分辨率保证清晰度
      margin: 2,
      color: {
        dark: isDark.value ? '#ffffff' : '#000000',
        light: isDark.value ? '#374151' : '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
  }
  catch (err) {
    generateError.value = '生成二维码失败，请检查输入内容'
    console.error('QRCode生成错误:', err)
  }
  finally {
    generating.value = false
  }
})

// 文件处理逻辑
async function handleFile(event) {
  await processFile(event.target.files?.[0])
  event.target.value = '' // 重置input
}

async function handleDrop(e) {
  await processFile(e.dataTransfer.files?.[0])
}

function triggerFileInput() {
  fileInput.value?.click()
}

// 处理图片文件
async function processFile(file) {
  recognizeError.value = ''
  qrResult.value = ''

  if (!file)
    return
  if (!file.type.startsWith('image/')) {
    recognizeError.value = '请选择有效的图片文件'
    return
  }

  processing.value = true
  try {
    const imageData = await loadImageData(file)
    const code = jsQR(imageData.data, imageData.width, imageData.height)
    qrResult.value = code?.data || '未检测到二维码内容'
  }
  catch (err) {
    recognizeError.value = '识别失败，请尝试其他图片'
    console.error('QR识别错误:', err)
  }
  finally {
    processing.value = false
  }
}

// 加载图片到ImageData
function loadImageData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        resolve(ctx.getImageData(0, 0, canvas.width, canvas.height))
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
</script>

<template>
  <div class="min-h-screen p-4 transition-colors duration-300 space-y-8 dark:bg-gray-800 dark:text-white">
    <!-- 生成二维码部分 -->
    <div class="mx-auto max-w-2xl">
      <h2 class="mb-4 text-2xl font-bold">
        生成二维码
      </h2>
      <div class="space-y-4">
        <input
          v-model="qrText"
          type="text"
          placeholder="输入要生成二维码的内容"
          class="w-full border rounded-md p-2 dark:border-gray-600 focus:border-transparent dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
        >

        <div v-if="generating" class="text-center text-gray-500 dark:text-gray-400">
          生成中...
        </div>

        <div v-if="generateError" class="rounded-md bg-red-100 p-3 text-red-700 dark:bg-red-900 dark:text-red-200">
          {{ generateError }}
        </div>

        <div class="mt-4 flex justify-center">
          <img
            v-if="qrCodeData"
            :src="qrCodeData"
            :style="{ width: `${qrSize}px`, height: `${qrSize}px` }"
            class="border rounded-md bg-white p-2 dark:bg-gray-700"
            alt="生成的二维码"
          >
        </div>
      </div>
    </div>

    <!-- 识别二维码部分 -->
    <div class="mx-auto max-w-2xl">
      <h2 class="mb-4 text-2xl font-bold">
        识别二维码
      </h2>
      <div class="space-y-4">
        <div
          class="group relative cursor-pointer border-2 rounded-lg border-dashed p-8 text-center transition-colors dark:border-gray-600 hover:border-blue-500"
          @drop.prevent="handleDrop"
          @dragover.prevent
          @click="triggerFileInput"
        >
          <div class="space-y-2">
            <p class="text-gray-600 transition-colors dark:text-gray-400 group-hover:text-blue-500">
              拖放图片到这里或点击上传
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-500">
              支持格式: PNG, JPG, JPEG
            </p>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFile"
          >
        </div>

        <div v-if="processing" class="text-center text-gray-500 dark:text-gray-400">
          识别中...
        </div>

        <div v-if="qrResult" class="mt-4 break-words rounded-md bg-gray-100 p-4 dark:bg-gray-700">
          <p class="mb-2 font-semibold">
            识别结果：
          </p>
          <pre class="whitespace-pre-wrap font-mono">{{ qrResult }}</pre>
        </div>

        <div v-if="recognizeError" class="rounded-md bg-red-100 p-3 text-red-700 dark:bg-red-900 dark:text-red-200">
          {{ recognizeError }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* 解决暗黑模式切换时的背景过渡 */
.dark .dark\:bg-gray-800 {
  transition: background-color 0.3s ease;
}
</style>
