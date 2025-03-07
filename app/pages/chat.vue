<script setup lang="ts">
definePageMeta({
  layout: 'clean',
})

// 客户端发送 POST 请求示例
const { data, error } = await useFetch('/api/chat', {
  method: 'POST',
  body: {
    name: 'John',
    age: 30,
    model: 'deepseek-reasoner', // deepseek-reasoner deepseek-chat
    message: [{ role: 'user', content: 'What\'s the highest mountain in the world?' }],
  },
  // 可选配置
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    debug: true, // 附加查询参数
  },
})

// 处理响应
if (error.value) {
  console.error('请求失败:', error.value)
}
else {
  console.warn('响应数据:', data.value)
}

// 正确定义响应式变量
const messages = ref<Array<{
  role: 'user' | 'assistant'
  content: string
  time: number
}>>([])

const isLoading = ref(false)
const inputMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const sidebarOpen = ref(true)
// 消息处理逻辑
async function handleSend() {
  if (!inputMessage.value.trim() || isLoading.value)
    return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: inputMessage.value,
    time: Date.now(),
  })

  // 清空输入框
  const msg = inputMessage.value
  inputMessage.value = ''

  try {
    isLoading.value = true

    // 模拟AI回复（替换为实际API调用）
    const response = await simulateAIResponse(msg)

    messages.value.push({
      role: 'assistant',
      content: response,
      time: Date.now(),
    })
  }
  finally {
    isLoading.value = false
  }
}

// 模拟AI响应
function simulateAIResponse(query: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`这是关于【${query}】的模拟回复，实际需要接入AI接口。\n第二行测试换行显示效果。`)
    }, 1000)
  })
}

// 保持滚动到底部
watch([messages, isLoading], () => {
  nextTick(() => {
    const container = messagesContainer.value
    if (container) {
      container.scrollTop = container.scrollHeight + 100
    }
  })
})
</script>

<template>
  <div class="h-screen flex">
    <!-- 侧边栏保持原有实现 -->
    <div
      class="w-64 border-r bg-white transition-all duration-300"
      :class="{ '-ml-64': !sidebarOpen }"
    >
      <div class="p-4">
        <h2 class="mb-4 text-lg font-bold">
          历史记录
        </h2>
        <div
          v-for="(item, index) in history"
          :key="index"
          class="mb-2 cursor-pointer rd p-2 hover:bg-gray-100"
          @click="scrollToMessage(index)"
        >
          <div class="truncate text-sm">
            {{ item.content }}
          </div>
          <div class="mt-1 text-xs text-gray-400">
            {{ formatTime(item.time) }}
          </div>
        </div>
      </div>
    </div>
    <!-- 主内容区 -->
    <div class="relative flex flex-1 flex-col">
      <!-- 消息区域 -->
      <div ref="messagesContainer" class="flex-1 of-y-auto p-4 pb-32 space-y-8">
        <!-- AI消息 -->
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="mx-auto max-w-[700px]"
        >
          <div v-if="message.role === 'assistant'" class="flex gap-3">
            <!-- 头像保持原有 -->
            <div class="min-w-[32px]">
              <div class="h-8 w-8 flex items-center justify-center rd-full bg-blue-500">
                <!-- AI头像图标 -->
              </div>
            </div>

            <!-- 消息内容区域 -->
            <div class="flex-1">
              <!-- 移除对话框包裹 -->
              <div class="max-w-none whitespace-pre-wrap prose">
                {{ message.content }}
              </div>

              <!-- 操作按钮 -->
              <div class="mt-2 flex gap-3 opacity-70 transition-opacity hover:opacity-100">
                <button @click="copyText(message.content)">
                  复制
                </button>
                <button @click="regenerate(message)">
                  重新生成
                </button>
              </div>
            </div>
          </div>

          <!-- 用户消息 -->
          <div v-if="message.role === 'user'" class="ml-auto max-w-[700px]">
            <div class="flex items-end justify-end gap-3">
              <!-- 操作按钮 -->
              <div class="flex gap-2 opacity-70 transition-opacity hover:opacity-100">
                <button @click="editMessage(index)">
                  编辑
                </button>
                <button @click="resendMessage(message)">
                  提问
                </button>
              </div>

              <!-- 用户消息内容 -->
              <div class="max-w-[600px] rd-lg bg-blue-600 px-4 py-2 text-white">
                {{ message.content }}
              </div>

              <!-- 用户头像 -->
              <div class="min-w-[32px]">
                <div class="h-8 w-8 flex items-center justify-center rd-full bg-gray-300">
                  <span class="text-sm text-white">我</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 新版输入框 -->
      <div class="fixed bottom-0 left-0 right-0">
        <div class="mx-auto max-w-[700px] w-full bg-white/90 p-4 backdrop-blur-sm">
          <form
            class="relative border rd-lg bg-white shadow-lg"
            @submit.prevent="handleSend"
          >
            <textarea
              ref="inputRef"
              v-model="inputMessage"
              placeholder="输入你的问题..."
              class="w-full resize-none rd-lg p-4 pr-20 focus:outline-none"
              rows="1"
              @keydown.enter.exact.prevent="handleSend"
            />

            <!-- 操作按钮 -->
            <div class="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                type="button"
                class="rd p-2 hover:bg-gray-100"
                @click="handleFileUpload"
              >
                上传图标
              </button>
              <button
                type="submit"
                :disabled="isLoading"
                class="rd-lg bg-blue-600 p-2 px-4 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                发送
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

  <style>
  /* 自定义文本域滚动条 */
textarea::-webkit-scrollbar {
  width: 6px;
}
textarea::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rd-full;
}
</style>
