<!-- components/InfoItem.vue -->
<script setup>
const props = defineProps({
  modelValue: String,
  label: String,
  icon: String,
  type: { type: String, default: 'text' },
  isLink: Boolean,
  rules: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)
const errorMessage = ref('')

function validate() {
  for (const rule of props.rules) {
    const result = rule(localValue.value)
    if (typeof result === 'string') {
      errorMessage.value = result
      return false
    }
  }
  errorMessage.value = ''
  return true
}

function focusInput() {
  nextTick(() => {
    document.querySelector('input')?.focus()
  })
}

watch(localValue, (val) => {
  emit('update:modelValue', val)
  validate()
})
</script>

<template>
  <div class="group flex items-center justify-between">
    <div class="flex flex-1 items-center gap-3">
      <div
        class="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
        :class="icon"
      />
      <div class="flex-1">
        <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">
          {{ label }}
        </div>
        <div class="relative">
          <a
            v-if="isLink"
            :href="modelValue"
            target="_blank"
            class="text-gray-900 transition-colors dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {{ modelValue }}
          </a>
          <input
            v-else
            v-model="localValue"
            :type="type"
            class="w-full border-none bg-transparent p-0 text-gray-900 dark:text-gray-100 focus:ring-0"
            @blur="validate"
          >
          <div v-if="errorMessage" class="absolute text-xs text-red-500 -bottom-5">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
    <button
      v-if="!isLink"
      class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400"
      @click="focusInput"
    >
      <div class="i-mdi-pencil h-5 w-5" />
    </button>
  </div>
</template>
