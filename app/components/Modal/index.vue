<script setup>
const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: '',
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: '500px',
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])

function handleOverlayClick() {
  if (props.closeOnClickOverlay) {
    emit('close')
  }
}

// 处理 ESC 键关闭
function handleEscape(e) {
  if (e.key === 'Escape' && props.show) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <ClientOnly>
    <teleport to="body">
      <transition enter-active-class="transition-opacity duration-200" leave-active-class="transition-opacity duration-200">
        <div
          v-if="show"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          @click.self="handleOverlayClick"
        >
          <div
            class="max-h-[90vh] flex flex-col rounded-lg bg-white shadow-xl"
            :style="{ maxWidth: width }"
          >
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-200 p-4">
              <slot name="header">
                <h3 class="text-lg text-gray-900 font-semibold">
                  {{ title }}
                </h3>
              </slot>

              <button
                v-if="showClose"
                class="rounded-full p-1 transition-colors hover:bg-gray-100"
                @click="$emit('close')"
              >
                <div class="i-heroicons-x-mark-20-solid h-5 w-5 text-gray-500" />
              </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-4">
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="flex justify-end gap-2 border-t border-gray-200 p-4"
            >
              <slot name="footer" />
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </ClientOnly>
</template>
