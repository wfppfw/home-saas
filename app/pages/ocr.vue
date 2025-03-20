<script setup>
import { toast } from 'vue3-toastify'

const fileInput = ref(null)
const isDragging = ref(false)
const previewImage = ref(null)
const ocrResult = ref('')
const isLoading = ref(false)
const progress = ref(0)

// 触发文件选择
const triggerFileInput = () => fileInput.value.click()

// 处理文件选择
async function handleFileSelect(e) {
  const file = e.target.files[0]
  if (validateFile(file)) {
    await processImage(file)
  }
}

// 处理拖拽上传
async function handleDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (validateFile(file)) {
    await processImage(file)
  }
}

// 文件验证
function validateFile(file) {
  if (!file)
    return false
  if (!file.type.startsWith('image/')) {
    // alert('请选择图片文件')
    toast.success('请选择图片文件!', {
      position: 'top-center',
      autoClose: 400,
      closeButton: false, // 显示关闭按钮
    })
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    // alert('文件大小超过5MB限制')
    toast.success('文件大小超过5MB限制', {
      position: 'top-center',
      autoClose: 400,
      closeButton: false, // 显示关闭按钮
    })
    return false
  }
  return true
}

// 解决方案：使用事件监听替代 logger 闭包
const workerRef = ref(null)

// 修改后的 initWorker 函数
async function initWorker() {
  if (!import.meta.client)
    return

  try {
    const { createWorker } = await import('tesseract.js')
    workerRef.value = await createWorker({
      corePath: '/tesseract/worker.min.js',
      logger: (m) => {
        if (m.status === 'recognizing text') {
          progress.value = Math.floor(m.progress * 100)
        }
      },
    })

    // 正确加载并初始化多语言
    await workerRef.value.loadLanguage('chi_sim')
    await workerRef.value.initialize('chi_sim') // 主语言设为中文
    await workerRef.value.setParameters({
      tessdata_dir: '/tesseract/tessdata', // 自定义路径 [[6]]
      tessedit_ocr_engine_mode: 1, // 使用 LSTM 模式
      tessedit_pageseg_mode: 3, // 自动页面分割
    })
  }
  catch (error) {
    console.error('Worker 初始化失败:', error)
    toast.error('OCR 初始化异常，请刷新页面重试', { autoClose: 2000 })
  }
}

async function processImage(file) {
  if (!file)
    return

  try {
    isLoading.value = true
    previewImage.value = URL.createObjectURL(file)

    if (!workerRef.value)
      await initWorker()

    // 文件转换为 ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // 新增超时机制
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject('识别超时'), 15000),
    )

    const { data: { text } } = await Promise.race([
      workerRef.value.recognize(arrayBuffer, {
        tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\u4E00-\u9FFF',
        preserve_interword_spaces: '1',
      }),
      timeout,
    ])

    ocrResult.value = text.trim()
  }
  catch (error) {
    console.error('OCR 识别失败:', error)
    toast.error('识别失败，请检查图片质量', { autoClose: 2000 })
  }
  finally {
    isLoading.value = false
  }
}

// 组件卸载时清理
onBeforeUnmount(async () => {
  if (workerRef.value) {
    await workerRef.value.terminate()
    workerRef.value = null
  }
})
// 复制文本
function copyText() {
  navigator.clipboard.writeText(ocrResult.value)
    .then(() => {
      // alert('已复制到剪贴板')
      toast.success('已复制到剪贴板', {
        position: 'top-center',
        autoClose: 400,
        closeButton: false, // 显示关闭按钮
      })
    },
    )
    .catch(() => {
      // alert('复制失败')
      toast.success('复制失败', {
        position: 'top-center',
        autoClose: 400,
        closeButton: false, // 显示关闭按钮
      })
    })
}

// 清理预览URL
onBeforeUnmount(() => {
  if (previewImage.value) {
    URL.revokeObjectURL(previewImage.value)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <!-- 上传区域 -->
    <div
      class="mb-8 cursor-pointer border-4 rounded-2xl border-dashed p-8 text-center transition-colors duration-300" :class="[
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400',
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
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
      <div class="space-y-4">
        <div class="text-4xl text-gray-500">
          <div class="i-ph-upload-simple-bold" />
        </div>
        <h2 class="text-xl text-gray-700 font-semibold">
          {{ isDragging ? '松开上传图片' : '点击选择或拖拽图片到此' }}
        </h2>
        <p class="text-gray-500">
          支持格式：PNG, JPG, JPEG (最大 5MB)
        </p>
      </div>
    </div>

    <!-- 预览和结果 -->
    <div v-if="previewImage || isLoading" class="grid gap-8 lg:grid-cols-2">
      <!-- 图片预览 -->
      <div class="relative aspect-square overflow-hidden rounded-xl bg-gray-200">
        <img
          v-if="previewImage"
          :src="previewImage"
          alt="Preview"
          class="h-full w-full object-contain"
        >
        <div v-if="isLoading" class="flex-center absolute inset-0 bg-black/50">
          <div class="text-center text-white space-y-4">
            <div class="i-line-md-loading-twotone-loop animate-spin text-4xl" />
            <p class="font-medium">
              识别中... {{ progress }}%
            </p>
          </div>
        </div>
      </div>

      <!-- 识别结果 -->
      <div class="h-[500px] overflow-auto rounded-xl bg-white p-6">
        <div v-if="ocrResult" class="space-y-4">
          <div class="flex-between mb-4">
            <h3 class="text-xl text-gray-800 font-bold">
              识别结果
            </h3>
            <button
              class="flex items-center gap-1 text-blue-500 hover:text-blue-600"
              @click="copyText"
            >
              <div class="i-ph-copy-bold" /> 复制
            </button>
          </div>
          <pre class="whitespace-pre-wrap font-sans">{{ ocrResult }}</pre>
        </div>
        <div v-else class="flex-center h-full text-gray-500">
          <p>识别结果将在此处显示</p>
        </div>
      </div>
    </div>
  </div>
</template>

  <style>
  /* 添加自定义动画 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.flex-center {
  @apply flex items-center justify-center;
}

.flex-between {
  @apply flex items-center justify-between;
}
</style>
