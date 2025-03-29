<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const prompt = ref('')
const width = ref(512)
const height = ref(512)
const steps = ref(25)
const seed = ref(null)
const model = ref('stable-diffusion')
const nologo = ref(false)
const privateMode = ref(false)
const enhance = ref(false)
const isLoading = ref(false)
const imageUrl = ref(null)
const errorMessage = ref('')
const abortController = ref(null)

// 模型相关状态
const models = ref([])
const modelsLoading = ref(true)
const modelsError = ref(false)
const modelsAbortController = ref(null)

onMounted(async () => {
  try {
    modelsAbortController.value = new AbortController()
    const response = await fetch('https://image.pollinations.ai/models', {
      signal: modelsAbortController.value.signal,
    })

    if (!response.ok)
      throw new Error('Failed to fetch models')
    models.value = await response.json()
    if (!models.value.includes(model.value))
      model.value = models.value[0]
  }
  catch (error) {
    console.error('Model fetch failed:', error)
    modelsError.value = true
  }
  finally {
    modelsLoading.value = false
    modelsAbortController.value = null
  }
})

function generateRandomSeed() {
  seed.value = Math.floor(Math.random() * 1000000000)
}

function validateParams() {
  errorMessage.value = ''
  if (!prompt.value.trim())
    throw new Error('Prompt cannot be empty')
  if (width.value < 256 || width.value > 1024)
    throw new Error('Width must be between 256-1024')
  if (height.value < 256 || height.value > 1024)
    throw new Error('Height must be between 256-1024')
  if (steps.value < 1 || steps.value > 50)
    throw new Error('Steps must be between 1-50')
}

async function generateImage() {
  try {
    // 初始化状态
    isLoading.value = true
    imageUrl.value = null
    abortController.value = new AbortController()

    // 参数验证
    validateParams()

    // 构造请求参数
    const apiUrl = new URL(`https://image.pollinations.ai/prompt/${prompt.value}`)
    const params = {
    //   prompt: prompt.value,
      width: width.value,
      height: height.value,
      steps: steps.value,
      model: model.value,
      nologo: nologo.value ? 'true' : 'false',
      private: privateMode.value ? 'true' : 'false',
      enhance: enhance.value ? 'true' : 'false',
      seed: seed.value || '',
    }

    // 添加查询参数
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        apiUrl.searchParams.append(key, value)
      }
    })

    // 发起请求
    const response = await fetch(apiUrl, {
      signal: abortController.value.signal,
    })

    // 处理响应
    if (!response.ok)
      throw new Error(`HTTP error! Status: ${response.status}`)

    // 生成图片URL
    const blob = await response.blob()
    imageUrl.value = URL.createObjectURL(blob)
  }
  catch (error) {
    if (error.name !== 'AbortError') {
      errorMessage.value = error.message || 'Image generation failed'
      console.error('Generation failed:', error)
    }
  }
  finally {
    isLoading.value = false
    abortController.value = null
  }
}

function cancelRequest() {
  if (abortController.value) {
    abortController.value.abort()
  }
}

function openFullscreen() {
  if (imageUrl.value) {
    window.open(imageUrl.value, '_blank', 'noopener,noreferrer')
  }
}

// 清理资源
onBeforeUnmount(() => {
  // 清理图片URL
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
  }
  // 取消模型请求
  if (modelsAbortController.value) {
    modelsAbortController.value.abort()
  }
  // 取消生成请求
  if (abortController.value) {
    abortController.value.abort()
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col gap-6 bg-gray-50 p-4 transition-colors md:flex-row dark:bg-gray-900">
    <!-- 左侧控制面板 -->
    <div class="w-full flex flex-col gap-4 rounded-xl bg-white p-6 shadow-lg md:w-1/3 dark:bg-gray-800">
      <h1 class="text-2xl text-gray-800 font-bold dark:text-white">
        AI Image Generator
      </h1>

      <div class="flex flex-1 flex-col gap-4">
        <textarea
          v-model="prompt"
          placeholder="Enter your prompt here..."
          class="h-32 w-full resize-none border border-gray-300 rounded-lg bg-transparent p-3 text-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
        />

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-600 dark:text-gray-400">Width</label>
            <input
              v-model.number="width"
              type="number"
              class="border border-gray-300 rounded bg-transparent p-2 dark:border-gray-600 dark:text-white"
              min="256"
              max="1024"
            >
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-600 dark:text-gray-400">Height</label>
            <input
              v-model.number="height"
              type="number"
              class="border border-gray-300 rounded bg-transparent p-2 dark:border-gray-600 dark:text-white"
              min="256"
              max="1024"
            >
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-600 dark:text-gray-400">Steps</label>
            <input
              v-model.number="steps"
              type="number"
              class="border border-gray-300 rounded bg-transparent p-2 dark:border-gray-600 dark:text-white"
              min="1"
              max="50"
            >
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-600 dark:text-gray-400">Seed</label>
            <div class="flex gap-2">
              <input
                v-model.number="seed"
                type="number"
                class="flex-1 border border-gray-300 rounded bg-transparent p-2 dark:border-gray-600 dark:text-white"
                placeholder="Random"
              >
              <button
                class="rounded bg-gray-100 px-3 transition-colors dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Generate random seed"
                @click="generateRandomSeed"
              >
                🎲
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600 dark:text-gray-400">Model</label>
          <select
            v-model="model"
            class="border border-gray-300 rounded bg-transparent p-2 dark:border-gray-600 dark:text-white"
            :disabled="modelsLoading"
          >
            <option v-if="modelsLoading" value="" disabled>
              Loading models...
            </option>
            <option v-for="modelOption in models" :key="modelOption" :value="modelOption">
              {{ modelOption }}
            </option>
            <option v-if="modelsError" value="" disabled>
              Failed to load models
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <label class="cursor-pointer flex items-center gap-2 text-sm">
            <input
              v-model="nologo"
              type="checkbox"
              class="h-4 w-4 border-gray-300 rounded text-blue-600 dark:border-gray-600 dark:bg-gray-700"
            >
            <span class="text-gray-600 dark:text-gray-400">Disable Logo</span>
          </label>

          <label class="cursor-pointer flex items-center gap-2 text-sm">
            <input
              v-model="privateMode"
              type="checkbox"
              class="h-4 w-4 border-gray-300 rounded text-blue-600 dark:border-gray-600 dark:bg-gray-700"
            >
            <span class="text-gray-600 dark:text-gray-400">Private Mode</span>
          </label>

          <label class="cursor-pointer flex items-center gap-2 text-sm">
            <input
              v-model="enhance"
              type="checkbox"
              class="h-4 w-4 border-gray-300 rounded text-blue-600 dark:border-gray-600 dark:bg-gray-700"
            >
            <span class="text-gray-600 dark:text-gray-400">Enhance Prompt</span>
          </label>
        </div>

        <div class="mt-4 flex gap-2">
          <button
            :disabled="isLoading || modelsLoading"
            class="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium transition-colors disabled:cursor-not-allowed hover:bg-blue-700 disabled:opacity-50"
            @click="generateImage"
          >
            {{ isLoading ? 'Generating...' : 'Generate Image' }}
          </button>
          <button
            v-if="isLoading"
            class="rounded-lg bg-red-600 px-4 py-3 text-white font-medium transition-colors hover:bg-red-700"
            @click="cancelRequest"
          >
            Cancel
          </button>
        </div>

        <div v-if="errorMessage" class="rounded-lg bg-red-100 p-3 text-red-700 dark:bg-red-900 dark:text-red-200">
          {{ errorMessage }}
        </div>
      </div>
    </div>

    <!-- 右侧预览区域 -->
    <div class="w-full flex items-center justify-center rounded-xl bg-white p-6 shadow-lg md:w-2/3 dark:bg-gray-800">
      <div v-if="isLoading" class="text-center">
        <div class="mb-4 h-12 w-12 animate-spin border-4 border-blue-500 border-t-transparent rounded-full" />
        <p class="text-gray-500 dark:text-gray-400">
          Generating your image...
        </p>
      </div>

      <img
        v-else-if="imageUrl"
        :src="imageUrl"
        alt="Generated image"
        class="max-h-[70vh] max-w-full cursor-zoom-in rounded-lg object-contain shadow-lg transition-shadow hover:shadow-xl"
        @click="openFullscreen"
      >

      <div v-else class="text-center text-gray-500 dark:text-gray-400">
        <div class="mb-4 text-4xl">
          🖼️
        </div>
        <p>Your generated image will appear here</p>
      </div>
    </div>
  </div>
</template>
