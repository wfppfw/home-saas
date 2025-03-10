<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

definePageMeta({
  layout: 'clean',
})

const isSidebarCollapsed = ref(false)
const mobileView = ref(false)
const sidebar = ref(null)
const inputText = ref('')
const chatMessages = ref([])
const currentSummary = ref('当前对话摘要')
const inputRef = ref(null)
const chatContainer = ref(null)
const chatHistory = ref([
  { id: 1, title: '对话历史1' },
  { id: 2, title: '对话历史2' },
])

const aiActions = ['复制', '重新生成', '点赞', '踩']
const actionIcons = [
  'mdi:content-copy',
  'mdi:reload',
  'mdi:thumb-up-outline',
  'mdi:thumb-down-outline',
]

const randomResponses = [
  '人工智能是未来科技发展的重要方向。',
  '深度学习需要大量数据和计算资源。',
  '自然语言处理正在改变人机交互方式。',
  '机器学习模型需要持续优化和训练。',
  '算法偏见是需要重视的伦理问题。',
]

const textareaStyle = computed(() => ({
  minHeight: '4rem',
  maxHeight: window.innerWidth >= 768 ? '645px' : '425px',
  paddingBottom: '3rem',
}))

// 响应式处理
function checkMobile() {
  mobileView.value = window.innerWidth < 768
  if (mobileView.value) {
    isSidebarCollapsed.value = true
  }
  else {
    isSidebarCollapsed.value = false
  }
}

// 自动聚焦输入框
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  nextTick(() => {
    inputRef.value?.focus()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

function adjustTextareaHeight() {
  nextTick(() => {
    const textarea = inputRef.value
    textarea.style.height = 'auto'
    const newHeight = Math.min(
      textarea.scrollHeight,
      Number.parseInt(textareaStyle.value.maxHeight),
    )
    textarea.style.height = `${newHeight}px`
    chatContainer.value?.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: 'smooth',
    })
  })
}

function startNewChat() {
  chatMessages.value = []
  currentSummary.value = '新对话'
}

function sendMessage() {
  const content = inputText.value.trim()
  if (!content)
    return

  chatMessages.value.push({
    role: 'user',
    content,
    timestamp: Date.now(),
  })

  inputText.value = ''

  setTimeout(() => {
    chatMessages.value.push({
      role: 'ai',
      content: randomResponses[Math.floor(Math.random() * randomResponses.length)],
      timestamp: Date.now(),
    })

    nextTick(() => {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    })
  }, 1000)
}
</script>

<template>
  <div class="h-screen flex bg-[#111]">
    <!-- 左侧侧边栏 -->
    <aside
      ref="sidebar"
      class="h-full border-r border-[#222] bg-[#0a0a0a] transition-all duration-300"
      :class="[isSidebarCollapsed ? 'w-16' : 'w-64', mobileView ? 'absolute z-30' : 'relative']"
    >
      <div class="h-full flex flex-col">
        <!-- 顶部区域 -->
        <div class="border-b border-[#222] p-4">
          <div v-if="!isSidebarCollapsed" class="flex items-center justify-between">
            <span class="text-white font-bold">DeepSeek</span>
            <Icon
              name="mdi:chevron-left"
              class="cursor-pointer text-gray-400 hover:text-white"
              @click="toggleSidebar"
            />
          </div>
          <div v-else class="flex flex-col items-center gap-4">
            <Icon name="mdi:robot" class="text-2xl text-white" />
            <Icon
              name="mdi:menu"
              class="cursor-pointer text-gray-400 hover:text-white"
              @click="toggleSidebar"
            />
            <Icon
              name="mdi:plus"
              class="cursor-pointer text-gray-400 hover:text-white"
              @click="startNewChat"
            />
          </div>
        </div>

        <!-- 对话历史列表 -->
        <div class="flex-1 overflow-y-auto p-2">
          <div
            v-for="item in chatHistory"
            :key="item.id"
            class="flex cursor-pointer items-center gap-2 rounded p-2 text-gray-300 hover:bg-[#1a1a1a]"
          >
            <Icon name="mdi:message-text-outline" class="shrink-0" />
            <span v-if="!isSidebarCollapsed" class="truncate">{{ item.title }}</span>
          </div>
        </div>

        <!-- 底部个人信息 -->
        <div class="border-t border-[#222] p-4">
          <div class="flex items-center gap-2 text-gray-400">
            <Icon name="mdi:account-circle" class="shrink-0 text-xl" />
            <span v-if="!isSidebarCollapsed">个人信息</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- 右侧主区域 -->
    <main class="relative h-full flex flex-1 flex-col bg-[#1a1a1a]">
      <!-- 移动端侧边栏遮罩 -->
      <div
        v-if="mobileView && !isSidebarCollapsed"
        class="fixed inset-0 z-20 bg-black/50"
        @click="toggleSidebar"
      />

      <!-- 顶部摘要栏 -->
      <div class="sticky top-0 z-10 border-b border-[#222] bg-[#1a1a1a] p-4">
        <div class="text-sm text-gray-400">
          {{ currentSummary }}
        </div>
      </div>

      <!-- 对话容器 -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <div
          ref="chatContainer"
          class="flex-1 overflow-y-auto p-4"
        >
          <div class="mx-auto h-full max-w-4xl">
            <!-- 无对话时的居中输入 -->
            <div
              v-if="chatMessages.length === 0"
              class="h-full flex flex-col items-center justify-center pb-[120px]"
            >
              <div class="max-w-2xl w-full">
                <div class="relative mb-4">
                  <textarea
                    ref="inputRef"
                    v-model="inputText"
                    class="w-full resize-none overflow-y-auto rounded-lg bg-[#2a2a2a] p-4 pr-40 text-gray-300 focus:outline-none"
                    :style="textareaStyle"
                    placeholder="输入你的问题..."
                    @input="adjustTextareaHeight"
                    @keydown.enter.prevent="sendMessage"
                  />
                  <!-- 输入框按钮 -->
                  <div class="absolute bottom-3 left-3 flex gap-2">
                    <button class="flex items-center gap-1.5 border border-blue-500/20 rounded-lg bg-blue-500/10 px-3 py-1.5 text-blue-400 transition-colors hover:bg-blue-500/20">
                      <Icon name="mdi:brain" class="h-4 w-4" />
                      <span class="text-sm">深度思考</span>
                    </button>
                    <button class="flex items-center gap-1.5 border border-blue-500/20 rounded-lg bg-blue-500/10 px-3 py-1.5 text-blue-400 transition-colors hover:bg-blue-500/20">
                      <Icon name="mdi:earth" class="h-4 w-4" />
                      <span class="text-sm">联网搜索</span>
                    </button>
                  </div>
                  <div class="absolute bottom-3 right-3 flex gap-2">
                    <button class="rounded p-1.5 text-gray-400 hover:bg-[#3a3a3a] hover:text-white">
                      <Icon name="mdi:paperclip" class="h-5 w-5" />
                    </button>
                    <button
                      class="rounded bg-blue-600 p-1.5 text-white transition-colors hover:bg-blue-700"
                      @click="sendMessage"
                    >
                      <Icon name="mdi:send" class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 对话消息 -->
            <div
              v-else
              class="h-full"
            >
              <div
                v-for="(message, index) in chatMessages"
                :key="index"
                class="group mb-8"
                :class="message.role === 'ai' ? 'flex gap-4' : 'flex justify-end'"
              >
                <!-- AI消息 -->
                <template v-if="message.role === 'ai'">
                  <div class="w-full flex gap-4">
                    <Icon name="mdi:robot" class="mt-1 shrink-0 text-2xl text-blue-400" />
                    <div class="flex-1">
                      <div class="whitespace-pre-wrap text-left text-gray-300">
                        {{ message.content }}
                      </div>
                      <div class="mt-2 flex gap-3">
                        <button
                          v-for="(action, actionIndex) in aiActions"
                          :key="actionIndex"
                          class="text-gray-400 transition-colors hover:text-white"
                        >
                          <Icon :name="actionIcons[actionIndex]" class="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- 用户消息 -->
                <template v-else>
                  <div class="w-full flex items-center gap-2">
                    <!-- 操作按钮 -->
                    <div class="flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <button class="text-gray-400 hover:text-white">
                        <Icon name="mdi:pencil" class="h-4 w-4" />
                      </button>
                      <button class="text-gray-400 hover:text-white">
                        <Icon name="mdi:content-copy" class="h-4 w-4" />
                      </button>
                    </div>
                    <!-- 消息内容 -->
                    <div class="flex flex-1 justify-end">
                      <div class="relative max-w-3xl rounded-lg bg-[#2a2a2a] p-4">
                        <div class="text-left text-gray-300">
                          {{ message.content }}
                        </div>
                      </div>
                      <Icon name="mdi:account-circle" class="shrink-0 text-2xl text-gray-400" />
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域和底部提示语 -->
        <div class="sticky bottom-0 w-full bg-[#1a1a1a]">
          <!-- 有对话时的输入区域 -->
          <div
            v-if="chatMessages.length > 0"
            class="border-t border-[#222] pt-2"
          >
            <div class="relative mx-auto max-w-4xl px-4">
              <div class="relative">
                <textarea
                  ref="inputRef"
                  v-model="inputText"
                  class="w-full resize-none overflow-y-auto rounded-lg bg-[#2a2a2a] p-4 pr-40 text-gray-300 focus:outline-none"
                  :style="textareaStyle"
                  placeholder="输入你的问题..."
                  @input="adjustTextareaHeight"
                  @keydown.enter.prevent="sendMessage"
                />
                <!-- 输入框按钮 -->
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <button class="flex items-center gap-1.5 border border-blue-500/20 rounded-lg bg-blue-500/10 px-3 py-1.5 text-blue-400 transition-colors hover:bg-blue-500/20">
                    <Icon name="mdi:brain" class="h-4 w-4" />
                    <span class="text-sm">深度思考</span>
                  </button>
                  <button class="flex items-center gap-1.5 border border-blue-500/20 rounded-lg bg-blue-500/10 px-3 py-1.5 text-blue-400 transition-colors hover:bg-blue-500/20">
                    <Icon name="mdi:earth" class="h-4 w-4" />
                    <span class="text-sm">联网搜索</span>
                  </button>
                </div>
                <div class="absolute bottom-3 right-3 flex gap-2">
                  <button class="rounded p-1.5 text-gray-400 hover:bg-[#3a3a3a] hover:text-white">
                    <Icon name="mdi:paperclip" class="h-5 w-5" />
                  </button>
                  <button
                    class="rounded bg-blue-600 p-1.5 text-white transition-colors hover:bg-blue-700"
                    @click="sendMessage"
                  >
                    <Icon name="mdi:send" class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 固定底部提示语 -->
          <div class="mx-auto max-w-4xl py-2 text-center">
            <div class="text-xs text-gray-500">
              内容由 AI 生成，请仔细甄别
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 6px;
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #3a3a3a;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4a4a4a;
}

@media (min-width: 1024px) {
  .max-w-4xl {
    max-width: 56rem;
  }

  [class*='mdi-account-circle'] {
    margin-right: calc((100% - 56rem) / 2 - 1.5rem);
  }

  [class*='mdi-robot'] {
    margin-left: calc((100% - 56rem) / 2 - 1.5rem);
  }
}

textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-thumb {
  background: #3a3a3a;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  aside {
    transition: transform 0.3s ease;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  }
  aside:not(.w-16) {
    transform: translateX(-100%);
  }
  aside.w-16 {
    transform: translateX(0);
  }

  .max-w-4xl {
    padding: 0 1rem;
  }

  [class*='mdi-account-circle'] {
    margin-right: 0.5rem;
  }

  [class*='mdi-robot'] {
    margin-left: 0.5rem;
  }
}

/* 用户消息操作按钮调整 */
.group:hover .opacity-0 {
  opacity: 1 !important;
  transform: translateX(0);
}

.user-message-buttons {
  position: relative;
  right: 0.5rem;
  margin-right: -1rem;
  transition: all 0.2s ease;
}

/* 输入框底部间距优化 */
.sticky.bottom-0 {
  padding-bottom: 0.25rem;
}
</style>
