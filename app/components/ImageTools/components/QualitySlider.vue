<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 1,
  },
  step: {
    type: Number,
    default: 0.1,
  },
  label: {
    type: String,
    default: '质量',
  },
  unit: {
    type: String,
    default: '%',
  },
})

defineEmits(['update:modelValue'])

const displayValue = computed(() => {
  const value = props.modelValue * (props.unit === '%' ? 100 : 1)
  return props.unit === '%'
    ? `${Math.round(value)}%`
    : value.toFixed(1)
})
</script>

<template>
  <div class="quality-slider space-y-2">
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium">
        {{ label }} ({{ displayValue }})
      </label>
      <span class="text-xs text-gray-500">
        {{ min }}-{{ max }}{{ unit }}
      </span>
    </div>
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      class="slider"
      @input="$emit('update:modelValue', parseFloat($event.target.value))"
    >
  </div>
</template>

  <style>
  .slider {
  @apply w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
           dark:bg-gray-700;

  &::-webkit-slider-thumb {
    @apply w-4 h-4 bg-blue-500 rounded-full appearance-none cursor-pointer
             transition-all hover:scale-125;
  }

  &::-moz-range-thumb {
    @apply w-4 h-4 bg-blue-500 rounded-full cursor-pointer
             transition-all hover:scale-125;
  }
}
</style>
