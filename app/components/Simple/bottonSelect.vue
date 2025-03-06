<!-- components/CustomSelect.vue -->
<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array as () => Array<{ label: string, value: string | number }>,
    required: true,
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectContainer = ref<HTMLElement | null>(null)

// 当前选中项
const selectedLabel = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)?.label
})

// 切换下拉状态
function toggleDropdown() {
  isOpen.value = !isOpen.value
}

// 选择选项
function selectOption(option: { value: string | number }) {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

// 判断是否选中
function isSelected(option: { value: string | number }) {
  return option.value === props.modelValue
}

// 点击外部关闭
onClickOutside(selectContainer, () => {
  isOpen.value = false
})
</script>

<template>
  <div ref="selectContainer" class="relative w-full">
    <!-- 触发按钮 -->
    <button
      class="focus:ring-primary-200 hover:border-primary-500 w-full border rounded-lg bg-white px-4 py-2 text-left transition-colors dark:bg-gray-800 focus:outline-none focus:ring-2" :class="[
        isOpen ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600',
      ]"
      aria-haspopup="listbox"
      @click="toggleDropdown"
    >
      <div class="flex items-center justify-between">
        <span class="truncate">{{ selectedLabel || placeholder }}</span>
        <i
          class="i-carbon-chevron-down transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </button>

    <!-- 下拉菜单 -->
    <transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <ul
        v-show="isOpen"
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto border border-gray-200 rounded-lg bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
      >
        <li
          v-for="option in options"
          :key="option.value"
          class="cursor-pointer px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700" :class="[
            { 'bg-gray-100 dark:bg-gray-700': isSelected(option) },
          ]"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>
