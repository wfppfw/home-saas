<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'error',
    validator: v => ['error', 'warning', 'success'].includes(v),
  },
})

const themeClasses = computed(() =>
  'dark:bg-gray-800 dark:text-gray-100 bg-white text-gray-900',
)

const typeClasses = computed(() => {
  return {
    error: 'border-red-500 dark:border-red-400',
    warning: 'border-yellow-500 dark:border-yellow-400',
    success: 'border-green-500 dark:border-green-400',
  }[props.type]
})
</script>

<template>
  <transition name="fade">
    <div
      v-if="message"
      class="error-toast fixed bottom-4 right-4 rounded-lg p-4 shadow-lg"
      :class="[themeClasses, typeClasses]"
    >
      <div class="flex items-center gap-2">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

  <style>
  .fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.error-toast {
  @apply border-l-4;
  backdrop-filter: blur(8px);
}
</style>
