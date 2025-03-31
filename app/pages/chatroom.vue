<script setup lang="ts">
import type { User } from '~/server/plugins/socket.io'

const { $io } = useNuxtApp()

const username = ref('')
const message = ref('')
const messages = ref<Array<{ user: string, content: string, time: string, system?: boolean }>>([])
const usersOnline = ref<string[]>([])
const isConnected = ref(false)

// 连接聊天室
function joinChat() {
  if (!username.value.trim())
    return
  $io.connect()
  $io.emit('join', username.value.trim())
  isConnected.value = true
}

// 发送消息
function sendMessage() {
  if (!message.value.trim())
    return
  $io.emit('message', message.value.trim())
  message.value = ''
}

onMounted(() => {
  $io.on('message', (msg) => {
    messages.value.push({ ...msg, system: false })
    scrollToBottom()
  })

  $io.on('users', (users: User[]) => {
    usersOnline.value = users.map(u => u.name)
  })

  $io.on('user-joined', (name: string) => {
    messages.value.push({
      user: 'System',
      content: `${name} joined the chat`,
      time: new Date().toISOString(),
      system: true,
    })
    scrollToBottom()
  })

  $io.on('user-left', (name: string) => {
    messages.value.push({
      user: 'System',
      content: `${name} left the chat`,
      time: new Date().toISOString(),
      system: true,
    })
    scrollToBottom()
  })
})

onUnmounted(() => {
  $io.disconnect()
})

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    const container = document.getElementById('messages-container')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}

// 格式化时间
function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
    <!-- 登录界面 -->
    <div
      v-if="!isConnected"
      class="mx-auto mt-20 max-w-md border border-gray-200 rounded-xl bg-white p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <h1 class="mb-6 text-center text-2xl text-gray-800 font-bold dark:text-gray-200">
        Join Chat Room
      </h1>
      <input
        v-model="username"
        placeholder="Enter your name"
        class="mb-4 w-full border border-gray-200 rounded-lg bg-white px-4 py-2 text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keyup.enter="joinChat"
      >
      <button
        class="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-800"
        @click="joinChat"
      >
        Join
      </button>
    </div>

    <!-- 聊天界面 -->
    <div v-else class="mx-auto h-[calc(100vh-2rem)] max-w-6xl w-full flex flex-1 gap-4 p-4">
      <!-- 主聊天区域 -->
      <div class="flex flex-1 flex-col border border-gray-200 rounded-xl bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-4 flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
          <h2 class="text-xl text-gray-800 font-semibold dark:text-gray-200">
            Chat Room
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Online: {{ usersOnline.length }}
          </div>
        </div>

        <!-- 消息容器 -->
        <div
          id="messages-container"
          class="mb-4 flex-1 overflow-y-auto pr-2 space-y-4"
        >
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="flex gap-3"
            :class="msg.user === username ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[70%] rounded-lg p-3 shadow-sm transition-colors [&.system]:bg-gray-100 [&.system]:text-gray-600 [&.system]:dark:bg-gray-700 [&.system]:dark:text-gray-300 [&:not(.system)]:dark:shadow-gray-700"
              :class="{
                'bg-blue-600 text-white': msg.user === username && !msg.system,
                'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200': msg.user !== username && !msg.system,
                'system': msg.system,
              }"
            >
              <div class="mb-1 text-sm font-medium">
                {{ msg.user === username ? 'You' : msg.system ? 'System' : msg.user }}
              </div>
              <div class="mb-1">
                {{ msg.content }}
              </div>
              <div class="text-xs opacity-70">
                {{ formatTime(msg.time) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="flex gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
          <input
            v-model="message"
            placeholder="Type a message..."
            class="flex-1 border border-gray-200 rounded-lg bg-white px-4 py-2 text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="sendMessage"
          >
          <button
            class="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-800"
            @click="sendMessage"
          >
            Send
          </button>
        </div>
      </div>

      <!-- 在线用户列表 -->
      <div class="w-64 border border-gray-200 rounded-xl bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <h3 class="mb-4 text-gray-800 font-semibold dark:text-gray-200">
          Online Users
        </h3>
        <ul class="space-y-2">
          <li
            v-for="(user, index) in usersOnline"
            :key="index"
            class="flex items-center text-sm text-gray-600 dark:text-gray-400"
          >
            <div class="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500" />
            {{ user }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
/* 自定义滚动条样式 */
#messages-container::-webkit-scrollbar {
  width: 8px;
}

#messages-container::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-700 rounded-full;
}

#messages-container::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

/* 暗黑模式过渡 */
html.dark {
  color-scheme: dark;
}

html {
  @apply transition-colors duration-300;
}
</style>
