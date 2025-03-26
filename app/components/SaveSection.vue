<script setup>
defineProps({
  isDirty: {
    type: Boolean,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['save'])
</script>

<template>
  <transition name="save-button">
    <div
      v-if="isDirty"
      class="mt-8 flex justify-end border-t border-gray-100 pt-6 dark:border-gray-700"
    >
      <button
        :disabled="isLoading"
        class="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white transition-all duration-300 disabled:cursor-not-allowed dark:bg-blue-700 hover:bg-blue-700 disabled:opacity-50 dark:hover:bg-blue-800"
        @click="$emit('save')"
      >
        <!-- 加载动画 -->
        <svg
          v-if="isLoading"
          class="h-5 w-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>

        <!-- 保存图标 -->
        <div v-else class="i-mdi-content-save h-5 w-5" />

        <!-- 按钮文字 -->
        {{ isLoading ? '保存中...' : '保存修改' }}
      </button>
    </div>
  </transition>
</template>

  <style scoped>
  .save-button-enter-active,
.save-button-leave-active {
  transition: all 0.3s ease;
  transform: translateY(0);
}

.save-button-enter-from,
.save-button-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
