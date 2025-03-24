<script setup>
const code = ref(`// 示例代码
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

console.log(fibonacci(10))`)

const currentLanguage = ref('javascript')
const currentTheme = ref('dracula')

const languages = [
  { name: 'JavaScript', value: 'javascript' },
  { name: 'Python', value: 'python' },
  { name: 'HTML', value: 'html' },
]

const themes = [
  { name: 'Dracula', value: 'dracula' },
  { name: 'One Light', value: 'one-light' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
    <div class="mx-auto max-w-4xl">
      <h1 class="mb-6 text-2xl text-gray-800 font-bold dark:text-gray-200">
        Nuxt3 Code Editor Demo1
      </h1>

      <!-- 控制栏 -->
      <div class="mb-4 flex gap-4">
        <select
          v-model="currentLanguage"
          class="border rounded-lg bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
        >
          <option v-for="lang in languages" :key="lang" :value="lang.value">
            {{ lang.name }}
          </option>
        </select>

        <select
          v-model="currentTheme"
          class="border rounded-lg bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
        >
          <option v-for="t in themes" :key="t.value" :value="t.value">
            {{ t.name }}
          </option>
        </select>
      </div>

      <!-- 编辑器 -->
      <ClientOnly>
        <CodeEditor
          v-model="code"
          :language="currentLanguage"
          :theme="currentTheme"
          class="shadow-lg"
        />
      </ClientOnly>

      <!-- 预览 -->
      <div class="mt-4 rounded-lg bg-white p-4 dark:bg-gray-800">
        <pre class="text-sm text-gray-800 font-mono dark:text-gray-200">{{ code }}</pre>
      </div>
    </div>
  </div>
</template>
