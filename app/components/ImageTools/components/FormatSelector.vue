<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  formats: {
    type: Array,
    default: () => ['png', 'jpeg', 'webp'],
  },
  label: {
    type: String,
    default: '目标格式',
  },
  disabledFormats: Array,
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="format-selector">
    <label class="mb-2 block text-sm font-medium">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      class="select"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option
        v-for="format in formats"
        :key="format"
        :value="format"
        :disabled="disabledFormats?.includes(format)"
      >
        {{ format.toUpperCase() }}
      </option>
    </select>
  </div>
</template>

  <style>
  .select {
  @apply w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800
           dark:border-gray-700 focus:ring-2 focus:ring-blue-500
           focus:border-blue-500 transition-colors;
}
</style>
