<!-- components/Message/index.vue -->
<script setup lang="ts">
import type { MessageType } from './types'

const messages = ref<Array<{ id: number, type: MessageType, content: string }>>([])

const typeClasses = {
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
}

const iconClasses = {
  success: 'text-green-500 dark:text-green-300',
  warning: 'text-yellow-500 dark:text-yellow-300',
  error: 'text-red-500 dark:text-red-300',
  info: 'text-blue-500 dark:text-blue-300',
}

let id = 0

function show(type: MessageType, content: string, duration = 3000) {
  const msgId = id++
  messages.value.push({ id: msgId, type, content })

  if (duration > 0) {
    setTimeout(() => {
      close(msgId)
    }, duration)
  }
}

function close(id: number) {
  messages.value = messages.value.filter(msg => msg.id !== id)
}

// 暴露方法给全局
defineExpose({ show })
</script>

<template>
  <div class="fixed right-4 top-4 z-1000 max-w-90vw">
    <TransitionGroup name="message">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="mb-3 w-80 flex items-start border border-gray-100 rounded-lg bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        :class="typeClasses[msg.type]"
      >
        <span :class="iconClasses[msg.type]" class="mr-3 flex-shrink-0 text-lg">
          <i v-if="msg.type === 'success'" class="i-carbon-checkmark-filled" />
          <i v-if="msg.type === 'warning'" class="i-carbon-warning-filled" />
          <i v-if="msg.type === 'error'" class="i-carbon-close-filled" />
          <i v-if="msg.type === 'info'" class="i-carbon-information-filled" />
        </span>

        <div class="min-w-0 flex-1">
          <p class="text-sm text-gray-900 font-medium dark:text-gray-100">
            {{ msg.content }}
          </p>
        </div>

        <button
          class="ml-4 rounded-full p-1 transition-colors -mr-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="close(msg.id)"
        >
          <i class="i-carbon-close text-base text-gray-400 dark:text-gray-300" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

  <style>
  .message-enter-active,
.message-leave-active {
  @apply transition-all duration-300 ease-out;
}

.message-enter-from {
  @apply opacity-0 translate-x-10;
}

.message-leave-to {
  @apply opacity-0 translate-x-10;
}
</style>
