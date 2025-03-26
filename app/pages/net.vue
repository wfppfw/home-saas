<script setup>
import { useThrottleFn } from '@vueuse/core'
import { computed, onBeforeUnmount, ref } from 'vue'

const testModes = ['latency', 'download', 'upload']
const modeLabels = {
  latency: '延迟',
  download: '下载',
  upload: '上传',
}

// 响应式状态
const currentMode = ref('latency')
const speedUnit = ref('mbps') // mbps 或 mb
const latency = ref(null)
const downloadSpeed = ref(null)
const uploadSpeed = ref(null)
const currentValue = ref(0)
const abortController = ref(null)

// 服务器配置
const testEndpoints = {
  latency: '/api/ping',
  download: '/html/test_1M.txt',
  upload: '/api/upload',
}

// 格式化函数
function formatSpeed(value, isMB = false) {
  if (value === null || value === undefined)
    return '--'

  // eslint-disable-next-line prefer-const
  let convertedValue = isMB ? value / 8 : value
  if (convertedValue >= 100)
    return convertedValue.toFixed(0)
  if (convertedValue >= 10)
    return convertedValue.toFixed(1)
  if (convertedValue >= 1)
    return convertedValue.toFixed(1)
  return convertedValue.toFixed(2)
}

function formatLatency(value) {
  return value ? Math.round(value) : '--'
}

// 计算属性
const unitLabels = computed(() => ({
  mbps: 'Mbps',
  mb: 'MB/s',
}))

const speedUnitDisplay = computed(() => unitLabels.value[speedUnit.value])

const formattedLatency = computed(() => formatLatency(latency.value))
const formattedDownloadSpeed = computed(() => formatSpeed(downloadSpeed.value, speedUnit.value === 'mb'))
const formattedUploadSpeed = computed(() => formatSpeed(uploadSpeed.value, speedUnit.value === 'mb'))

const currentUnitDisplay = computed(() => {
  return currentMode.value === 'latency' ? 'ms' : speedUnitDisplay.value
})

const speedColor = computed(() => {
  const val = currentValue.value
  if (!val)
    return 'text-gray-400'

  if (currentMode.value === 'latency') {
    return val < 100
      ? 'text-green-500'
      : val < 300 ? 'text-yellow-500' : 'text-red-500'
  }

  const max = currentMode.value === 'download' ? 100 : 50
  return (val / max) > 0.5
    ? 'text-green-500'
    : (val / max) > 0.2 ? 'text-yellow-500' : 'text-red-500'
})

const statusLabel = computed(() => {
  const val = currentValue.value
  if (!val)
    return '等待测试'

  if (currentMode.value === 'latency') {
    return val < 100
      ? '极佳'
      : val < 300
        ? '良好'
        : val < 500 ? '一般' : '较差'
  }

  const max = currentMode.value === 'download' ? 100 : 50
  const ratio = val / max
  return ratio > 0.8
    ? '极佳'
    : ratio > 0.5
      ? '良好'
      : ratio > 0.2 ? '一般' : '较差'
})

// 量角器计算
const gaugePath = computed(() => {
  const max = currentMode.value === 'download' ? 100 : 50
  const progress = Math.min(currentValue.value / max, 1)
  const angle = progress * Math.PI
  const x = 100 - 80 * Math.cos(angle)
  const y = 100 - 80 * Math.sin(angle)
  return `M20 100 A80 80 0 0 1 ${x} ${y}`
})

const pointerAngle = computed(() => {
  const max = currentMode.value === 'download' ? 100 : 50
  return Math.min(currentValue.value / max, 1) * Math.PI
})

const pointerX = computed(() => 100 - 70 * Math.cos(pointerAngle.value))
const pointerY = computed(() => 100 - 70 * Math.sin(pointerAngle.value))

const ticks = computed(() => {
  const max = currentMode.value === 'download' ? 100 : 50
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 5) * Math.PI
    const value = Math.round((i / 5) * max)
    return {
      x1: 100 - 85 * Math.cos(angle),
      y1: 100 - 85 * Math.sin(angle),
      x2: 100 - 75 * Math.cos(angle),
      y2: 100 - 75 * Math.sin(angle),
      textX: 100 - 95 * Math.cos(angle),
      textY: 100 - 95 * Math.sin(angle) + 3,
      label: value,
    }
  })
})

const displayValue = computed(() => {
  if (!currentValue.value)
    return '--'
  return currentMode.value === 'latency'
    ? formatLatency(currentValue.value)
    : formatSpeed(currentValue.value, speedUnit.value === 'mb')
})

// 测试逻辑
async function testLatency() {
  const start = performance.now()
  try {
    await fetch(testEndpoints.latency, { method: 'HEAD' })
    latency.value = performance.now() - start
    currentValue.value = latency.value
  }
  catch {
    latency.value = null
  }
}

async function testDownload() {
  const start = performance.now()
  try {
    const response = await fetch(`${testEndpoints.download}?t=${Date.now()}`)
    const reader = response.body.getReader()
    let received = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done)
        break
      received += value.length
    }

    const duration = (performance.now() - start) / 1000
    downloadSpeed.value = (received * 8) / (duration * 1e6)
    currentValue.value = downloadSpeed.value
  }
  catch {
    downloadSpeed.value = null
  }
}

async function testUpload() {
  const start = performance.now()
  try {
    const data = new Blob([new Uint8Array(1024 * 1024)])
    const formData = new FormData()
    formData.append('file', data)

    await fetch(testEndpoints.upload, {
      method: 'POST',
      body: formData,
      signal: abortController.value?.signal,
    })

    const duration = (performance.now() - start) / 1000
    uploadSpeed.value = (data.size * 8) / (duration * 1e6)
    currentValue.value = uploadSpeed.value
  }
  catch {
    uploadSpeed.value = null
  }
}

const startTest = useThrottleFn(async () => {
  abortController.value?.abort()
  abortController.value = new AbortController()

  switch (currentMode.value) {
    case 'latency':
      await testLatency()
      break
    case 'download':
      await testDownload()
      break
    case 'upload':
      await testUpload()
      break
  }
}, 1000)

function stopTest() {
  abortController.value?.abort()
  currentValue.value = 0
}

onBeforeUnmount(stopTest)
</script>

<template>
  <div>
    <!-- ip查询  -->
    <div />

    <!-- 网速测试 -->
    <div class="card relative border border-gray-200 rounded-2xl bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
      <!-- 单位切换按钮 -->
      <div class="absolute left-4 top-4 flex gap-2">
        <button
          v-for="unit in ['mbps', 'mb']"
          :key="unit"
          class="rounded-md px-3 py-1 text-sm transition-all"
          :class="[
            speedUnit === unit
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600',
          ]"
          @click="speedUnit = unit"
        >
          {{ unitLabels[unit] }}
        </button>
      </div>

      <!-- 模式切换按钮组 -->
      <div class="absolute right-4 top-4 flex gap-2">
        <button
          v-for="mode in testModes"
          :key="mode"
          class="rounded-lg p-2 transition-all"
          :class="[
            currentMode === mode
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600',
          ]"
          @click="currentMode = mode"
        >
          {{ modeLabels[mode] }}
        </button>
      </div>

      <!-- 量角器速度表盘 -->
      <div class="relative mx-auto mb-6 h-48 w-64">
        <svg class="gauge" viewBox="0 0 200 120">
          <path
            d="M20 100 A80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            stroke-width="12"
            class="text-gray-200 dark:text-gray-700"
          />
          <path
            :d="gaugePath"
            fill="none"
            stroke="currentColor"
            stroke-width="12"
            :class="speedColor"
            stroke-linecap="round"
          />
          <g v-for="(tick, index) in ticks" :key="index" class="text-gray-500">
            <line
              :x1="tick.x1"
              :y1="tick.y1"
              :x2="tick.x2"
              :y2="tick.y2"
              stroke="currentColor"
              stroke-width="2"
            />
            <text
              :x="tick.textX"
              :y="tick.textY"
              text-anchor="middle"
              class="text-[8px]"
            >
              {{ tick.label }}
            </text>
          </g>
          <line
            :x1="100"
            :y1="100"
            :x2="pointerX"
            :y2="pointerY"
            stroke="#ef4444"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>

        <div class="absolute bottom-8 left-1/2 transform text-center -translate-x-1/2">
          <div class="text-4xl font-bold font-mono" :class="speedColor">
            {{ displayValue }}
          </div>
          <div class="mt-1 text-sm text-gray-500">
            {{ currentUnitDisplay }} • {{ statusLabel }}
          </div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="flex justify-center gap-4">
        <button
          class="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-white shadow-md transition-colors hover:bg-green-600"
          @click="startTest"
        >
          <div class="i-mdi-play text-lg" />
          <span>开始测试</span>
        </button>
        <button
          class="flex items-center gap-2 rounded-lg bg-red-500 px-6 py-3 text-white shadow-md transition-colors hover:bg-red-600"
          @click="stopTest"
        >
          <div class="i-mdi-stop text-lg" />
          <span>停止测试</span>
        </button>
      </div>

      <!-- 统计面板 -->
      <div class="grid grid-cols-3 mt-6 gap-4 text-center">
        <div class="rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
          <div class="text-sm text-gray-500">
            延迟
          </div>
          <div class="text-2xl font-bold font-mono">
            {{ formattedLatency }}<span class="ml-1 text-sm">ms</span>
          </div>
        </div>
        <div class="rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
          <div class="text-sm text-gray-500">
            下载速度
          </div>
          <div class="text-2xl font-bold font-mono">
            {{ formattedDownloadSpeed }}
            <span class="ml-1 text-sm">{{ speedUnitDisplay }}</span>
          </div>
        </div>
        <div class="rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
          <div class="text-sm text-gray-500">
            上传速度
          </div>
          <div class="text-2xl font-bold font-mono">
            {{ formattedUploadSpeed }}
            <span class="ml-1 text-sm">{{ speedUnitDisplay }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.gauge {
  width: 100%;
  height: 100%;
}

.card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
}

.dark .card {
  background: rgba(31, 41, 55, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
}

button {
  transition: transform 0.1s ease;
}

button:active {
  transform: scale(0.95);
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
</style>
