<!-- components/BaseConverter.vue -->
<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'

const bases = [
  { label: '二进制', value: 2 },
  { label: '八进制', value: 8 },
  { label: '十进制', value: 10 },
  { label: '十六进制', value: 16 },
]

const units = ['B', 'KB', 'MB', 'GB', 'TB']

// 暗黑模式状态
const isDark = ref(false)
function toggleDarkMode() {
  isDark.value = !isDark.value
  if (import.meta.client) {
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
}

// 初始化主题
onMounted(() => {
  if (import.meta.client) {
    const savedTheme = localStorage.getItem('theme')
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    isDark.value = savedTheme === 'dark'
    document.documentElement.classList.toggle('dark', isDark.value)
  }
})

// 响应式状态
const inputValue = ref('')
const inputBase = ref(10)
const unitInput = ref(1)
const inputUnit = ref('B')
const outputUnit = ref('KB')

// 验证状态管理
const validationState = reactive({
  isValid: true,
  errorType: null,
})

// 错误信息映射
const errorMessages = {
  empty: '输入不能为空',
  invalid_binary: '二进制只能包含0和1',
  invalid_octal: '八进制只能包含0-7',
  invalid_decimal: '十进制包含无效字符',
  invalid_hex: '十六进制包含0-9和A-F',
}

// 输入验证
watch([inputValue, inputBase], ([value, base]) => {
  try {
    validateInput(value, base)
    validationState.isValid = true
    validationState.errorType = null
  }
  catch (error) {
    validationState.isValid = false
    validationState.errorType = error.message
  }
})

// 进制转换计算
const conversionResults = computed(() => {
  const results = {}
  const input = inputValue.value.toUpperCase()

  if (!validationState.isValid || !input) {
    bases.forEach(({ value }) => {
      results[value] = '--'
    })
    return results
  }

  try {
    const decimalValue = Number.parseInt(input, inputBase.value)
    if (Number.isNaN(decimalValue))
      // eslint-disable-next-line unicorn/error-message
      throw new Error()

    bases.forEach(({ value }) => {
      results[value] = formatOutput(decimalValue, value)
    })
    return results
  }
  catch {
    bases.forEach(({ value }) => {
      results[value] = '转换错误'
    })
    return results
  }
})

// 单位转换计算
const unitConversionResult = computed(() => {
  const unitsOrder = ['B', 'KB', 'MB', 'GB', 'TB']
  const inputIndex = unitsOrder.indexOf(inputUnit.value)
  const outputIndex = unitsOrder.indexOf(outputUnit.value)

  if (inputIndex === -1 || outputIndex === -1)
    return '无效单位'

  const factor = 1024 ** (outputIndex - inputIndex)
  const result = unitInput.value * factor
  return result % 1 === 0 ? result.toString() : result.toFixed(4)
})

// 格式化输出
function formatOutput(value, base) {
  if (Number.isNaN(value))
    return '--'

  switch (base) {
    case 2: return value.toString(2)
    case 8: return value.toString(8)
    case 10: return value.toString()
    case 16: return value.toString(16).toUpperCase()
    default: return '--'
  }
}

// 验证方法
function validateInput(value, base) {
  if (!value)
    throw new Error('empty')

  const validationRules = {
    2: { regex: /^[01]+$/, error: 'invalid_binary' },
    8: { regex: /^[0-7]+$/, error: 'invalid_octal' },
    10: { regex: /^-?\d+$/, error: 'invalid_decimal' },
    16: { regex: /^[0-9A-F]+$/i, error: 'invalid_hex' },
  }

  if (!validationRules[base].regex.test(value)) {
    throw new Error(validationRules[base].error)
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl rounded-xl bg-white p-4 shadow-lg transition-colors duration-300 dark:bg-gray-800">
    <!-- 标题 -->
    <div class="mb-8 text-center">
      <h1 class="mb-2 text-3xl text-gray-800 font-bold dark:text-gray-100">
        进制 & 单位转换器
      </h1>
      <div class="flex items-center justify-center space-x-2">
        <button
          class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="toggleDarkMode"
        >
          <span class="i-ph-sun-dim-duotone dark:i-ph-moon-stars-duotone text-xl text-yellow-500 dark:text-blue-400" />
        </button>
      </div>
    </div>

    <!-- 进制转换部分 -->
    <div class="mb-12">
      <div class="mb-6">
        <div class="mb-4 flex items-center gap-3">
          <input
            v-model="inputValue"
            type="text"
            placeholder="输入数值"
            class="flex-1 border rounded-lg bg-white p-3 text-gray-900 transition-all dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2"
            :class="[
              !validationState.isValid
                ? 'border-red-500 ring-red-200 dark:border-red-400 dark:ring-red-900'
                : 'border-gray-300 dark:border-gray-600 ring-blue-200 dark:ring-blue-900',
            ]"
          >
          <select
            v-model="inputBase"
            class="border border-gray-300 rounded-lg bg-white p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
          >
            <option v-for="base in bases" :key="base.value" :value="base.value">
              {{ base.label }}
            </option>
          </select>
        </div>

        <div v-if="!validationState.isValid" class="mb-4 px-2 text-sm text-red-500 dark:text-red-400">
          {{ errorMessages[validationState.errorType] || '未知错误' }}
        </div>
      </div>

      <!-- 转换结果 -->
      <div class="grid gap-4 lg:grid-cols-4 sm:grid-cols-2">
        <div
          v-for="base in bases"
          :key="base.value"
          class="border border-gray-200 rounded-lg bg-gray-50 p-4 transition-colors dark:border-gray-600 dark:bg-gray-700"
        >
          <div class="mb-2 text-sm text-gray-500 font-medium dark:text-gray-300">
            {{ base.label }}
          </div>
          <div class="break-all text-gray-800 font-mono dark:text-gray-200">
            {{ conversionResults[base.value] || '--' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 单位转换部分 -->
    <div class="border-t border-gray-200 pt-8 dark:border-gray-700">
      <h3 class="mb-6 text-xl text-gray-800 font-semibold dark:text-gray-200">
        数据单位转换
      </h3>
      <div class="grid gap-6 sm:grid-cols-2">
        <div class="space-y-3">
          <input
            v-model="unitInput"
            type="number"
            placeholder="输入数值"
            class="w-full border border-gray-300 rounded-lg bg-white p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
          >
          <select
            v-model="inputUnit"
            class="w-full border border-gray-300 rounded-lg bg-white p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
          >
            <option v-for="unit in units" :key="unit" :value="unit">
              {{ unit }}
            </option>
          </select>
        </div>
        <div class="space-y-3">
          <div class="border border-gray-200 rounded-lg bg-gray-50 p-3 text-gray-800 font-mono dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
            {{ unitConversionResult || '--' }}
          </div>
          <select
            v-model="outputUnit"
            class="w-full border border-gray-300 rounded-lg bg-white p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
          >
            <option v-for="unit in units" :key="unit" :value="unit">
              {{ unit }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

  <style>
  /* 基础过渡效果 */
html {
  @apply transition-colors duration-300;
}

/* 暗黑模式基础样式 */
.dark {
  @apply bg-gray-900 text-gray-100;
}

/* 输入过渡 */
input,
select {
  @apply transition-all duration-200;
}

/* 图标悬停效果 */
button:hover span {
  @apply transform transition-transform duration-200 scale-110;
}
</style>
