<script setup lang="ts">
import { ref } from 'vue'
import CodeEditor from '~/components/CodeEditor.vue'
import { useWebContainer } from '~/composables/useWebContainer'

const code = ref(`
console.log("Hello from WebContainer!");
function add(a, b) {
  return a + b;
}
console.log(add(2, 3));
`.trim())

const { initWebContainer, runCode, output, isRunning } = useWebContainer()

// 初始化 WebContainer
onMounted(() => {
  initWebContainer()
})

async function handleRun() {
  await runCode(code.value)
}
</script>

<template>
  <div>
    <div class="h-screen flex flex-col bg-gray-900 text-gray-100">
      <!-- 编辑器区域 -->
      <div class="min-h-0 flex flex-1">
        <div class="flex-1 border-r border-gray-700">
          <CodeEditor v-model:code="code" />
        </div>
        <!-- 控制台输出 -->
        <div class="flex-1 overflow-auto p-4 font-mono">
          <pre class="text-green-400">{{ output }}</pre>
          <div v-if="isRunning" class="text-blue-400">
            Running...
          </div>
        </div>
      </div>

      <!-- 运行按钮 -->
      <div class="border-t border-gray-700 p-4">
        <button
          :disabled="isRunning"
          class="rounded bg-blue-600 px-4 py-2 disabled:bg-gray-600 hover:bg-blue-700"
          @click="handleRun"
        >
          {{ isRunning ? 'Running...' : 'Run Code' }}
        </button>
      </div>
    </div>

    <div>
      <CodeEditor v-model:code="code" />
    </div>
  </div>
</template>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #374151;
}
</style>
