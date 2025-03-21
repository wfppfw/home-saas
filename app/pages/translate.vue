<script setup>
const inputText = ref('')
const translatedText = ref('')
const isLoading = ref(false)
const currentLangPair = ref('zh-en')

const langPairs = [
  { label: '中文 → 英文', value: 'zh-en' },
  { label: '英文 → 中文', value: 'en-zh' },
  { label: '中文 → 日文', value: 'zh-ja' },
  { label: '英文 → 法文', value: 'en-fr' },
]

// 模拟翻译函数（实际使用时替换为API调用）
async function mockTranslate(text, pair) {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return `[${pair}] 模拟翻译结果: ${text.split('').reverse().join('')}`
}

async function handleTranslate() {
  if (!inputText.value.trim())
    return

  isLoading.value = true
  try {
    translatedText.value = await mockTranslate(inputText.value, currentLangPair.value)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-200px rounded-xl bg-gray-50 p-4 shadow-sm">
    <!-- 翻译类型切换 -->
    <div class="mb-6 flex justify-end gap-4">
      <select
        v-model="currentLangPair"
        class="border border-gray-200 rounded-lg bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option
          v-for="pair in langPairs"
          :key="pair.value"
          :value="pair.value"
        >
          {{ pair.label }}
        </option>
      </select>

      <button
        :disabled="isLoading"
        class="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors disabled:bg-gray-400 hover:bg-blue-600"
        @click="handleTranslate"
      >
        {{ isLoading ? '翻译中...' : '翻译' }}
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="grid grid-cols-2 gap-6">
      <!-- 输入区域 -->
      <div class="h-96">
        <textarea
          v-model="inputText"
          placeholder="请输入要翻译的内容..."
          class="h-full w-full resize-none border-2 border-gray-200 rounded-xl p-6 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <!-- 结果区域 -->
      <div class="relative h-96">
        <div
          v-if="translatedText"
          class="h-full w-full overflow-auto border-2 border-gray-200 rounded-xl bg-white p-6"
        >
          {{ translatedText }}
        </div>
        <div
          v-else
          class="h-full w-full flex items-center justify-center border-2 border-gray-200 rounded-xl border-dashed text-gray-400"
        >
          翻译结果将会显示在这里
        </div>
      </div>
    </div>
  </div>
</template>
