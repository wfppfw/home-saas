<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

const messages = ref([
  {
    text: '你好！有什么可以帮助您的？',
    isUser: false,
    timestamp: new Date(Date.now() - 60000),
    attachments: [],
  },
  {
    text: '我想了解关于Nuxt 3的最新功能',
    isUser: true,
    timestamp: new Date(),
    attachments: [],
  },
])

const newMessage = ref('')
const messagesContainer = ref(null)
const showEmojiPicker = ref(false)
const attachments = ref([])
const fileInput = ref(null)
const docInput = ref(null)
const previewImage = ref(null)

const emojis = ref(['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'])

// 消息发送功能
function sendMessage() {
  if (!newMessage.value.trim() && !attachments.value.length)
    return

  const newMsg = {
    text: newMessage.value,
    isUser: true,
    timestamp: new Date(),
    attachments: [...attachments.value],
  }

  messages.value.push(newMsg)

  newMessage.value = ''
  attachments.value = []

  nextTick(() => {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  })
}

// 时间格式化
function formatTime(date) {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 表情功能
function toggleEmojiPicker() {
  showEmojiPicker.value = !showEmojiPicker.value
}

function insertEmoji(emoji) {
  newMessage.value += emoji
  showEmojiPicker.value = false
}

// 文件处理
function handleFileUpload(e) {
  const files = e.target.files
  if (files.length) {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        attachments.value.push({
          file,
          preview: URL.createObjectURL(file),
          type: file.type,
        })
      }
    })
  }
}

function handleDocUpload(e) {
  const files = e.target.files
  if (files.length) {
    Array.from(files).forEach((file) => {
      attachments.value.push({
        file,
        name: file.name,
        type: file.type,
      })
    })
  }
}

function removeAttachment(index) {
  attachments.value.splice(index, 1)
}

// 图片预览功能
function openImagePreview(imageUrl) {
  previewImage.value = imageUrl
  document.body.style.overflow = 'hidden'
}

function closeImagePreview() {
  previewImage.value = null
  document.body.style.overflow = 'auto'
}

// 键盘事件监听
onMounted(() => {
  window.addEventListener('keyup', (e) => {
    if (e.key === 'Escape' && previewImage.value) {
      closeImagePreview()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('keyup', () => {})
})
</script>

<template>
  <div class="h-[600px] w-[800px] flex flex-col rounded-xl bg-white shadow-xl">
    <!-- 聊天消息容器 -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="flex"
        :class="message.isUser ? 'justify-end' : 'justify-start'"
      >
        <!-- 消息气泡 -->
        <div
          class="max-w-[70%] rounded-lg p-3 space-y-1"
          :class="[
            message.isUser
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-white rounded-bl-none shadow',
            message.isUser ? 'ml-10' : 'mr-10',
          ]"
        >
          <!-- 附件预览 -->
          <div v-if="message.attachments?.length" class="mb-2 flex flex-col gap-2">
            <div
              v-for="(file, fileIndex) in message.attachments"
              :key="fileIndex"
              class="group cursor-pointer relative"
              @click="file.type.startsWith('image/') && openImagePreview(file.preview)"
            >
              <img
                v-if="file.type.startsWith('image/')"
                :src="file.preview"
                class="h-32 w-32 border rounded-lg object-cover transition-all hover:shadow-lg"
              >
              <div v-else class="h-32 w-32 flex items-center justify-center border rounded-lg bg-gray-100">
                <div class="i-carbon-document text-2xl text-gray-500" />
              </div>
              <div v-if="file.type.startsWith('image/')" class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <div class="i-carbon-zoom-in text-xl text-white" />
              </div>
            </div>
          </div>

          <div class="text-sm">
            {{ message.text }}
          </div>
          <div
            class="text-xs opacity-70"
            :class="message.isUser ? 'text-blue-100' : 'text-gray-500'"
          >
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="relative border-t p-4">
      <!-- 表情选择面板 -->
      <div v-if="showEmojiPicker" class="absolute bottom-full left-0 grid grid-cols-8 mb-2 max-h-[200px] w-full gap-2 overflow-y-auto rounded-lg bg-white p-3 shadow-lg">
        <button
          v-for="emoji in emojis"
          :key="emoji"
          class="rounded p-1 text-xl hover:bg-gray-100"
          @click="insertEmoji(emoji)"
        >
          {{ emoji }}
        </button>
      </div>

      <div class="flex items-center gap-2">
        <!-- 左侧功能按钮 -->
        <div class="flex gap-1">
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept="image/*"
            @change="handleFileUpload"
          >
          <button
            class="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-500"
            @click="$refs.fileInput.click()"
          >
            <div class="i-carbon-image text-lg" />
          </button>

          <input
            ref="docInput"
            type="file"
            class="hidden"
            @change="handleDocUpload"
          >
          <button
            class="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-500"
            @click="$refs.docInput.click()"
          >
            <div class="i-carbon-document text-lg" />
          </button>

          <button
            class="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-500"
            @click="toggleEmojiPicker"
          >
            <div class="i-carbon-face-activated text-lg" />
          </button>
        </div>

        <!-- 输入框 -->
        <input
          v-model="newMessage"
          placeholder="输入消息..."
          class="flex-1 border rounded-full bg-gray-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          @keyup.enter="sendMessage"
        >

        <!-- 发送按钮 -->
        <button
          class="h-9 w-9 flex items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600"
          @click="sendMessage"
        >
          <div class="i-carbon-send-alt text-lg" />
        </button>
      </div>

      <!-- 文件预览 -->
      <div v-if="attachments.length" class="mt-2 flex flex-wrap gap-2">
        <div
          v-for="(file, index) in attachments"
          :key="index"
          class="group relative"
        >
          <img
            v-if="file.type.startsWith('image/')"
            :src="file.preview"
            class="cursor-pointer h-16 w-16 border rounded-lg object-cover transition-transform hover:scale-105"
            @click="openImagePreview(file.preview)"
          >
          <div v-else class="h-16 w-16 flex items-center justify-center border rounded-lg bg-gray-100">
            <div class="i-carbon-document text-2xl text-gray-500" />
          </div>
          <button
            class="absolute h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity -right-2 -top-2 group-hover:opacity-100"
            @click="removeAttachment(index)"
          >
            <div class="i-carbon-close text-xs" />
          </button>
        </div>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <div
      v-if="previewImage"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      @click.self="closeImagePreview"
    >
      <div class="relative max-h-[90vh] max-w-[90vw]">
        <img
          :src="previewImage"
          class="max-h-full max-w-full object-contain"
          alt="预览大图"
        >
        <button
          class="absolute right-0 h-8 w-8 text-white transition-colors -top-8 hover:text-gray-200"
          @click="closeImagePreview"
        >
          <div class="i-carbon-close text-2xl" />
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full hover:bg-gray-400;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
