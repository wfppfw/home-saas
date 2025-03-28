<!-- components/FileUpload.vue -->
<script setup>
import { ref } from 'vue'

const emit = defineEmits(['files-selected'])
const fileInput = ref(null)

function openFilePicker() {
  fileInput.value.click()
}

function handleFileChange(e) {
  const files = Array.from(e.target.files)
  if (files.length > 0) {
    emit('files-selected', files)
  }
  e.target.value = '' // 重置input以便重复选择相同文件
}
</script>

<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept="image/*"
      multiple
      @change="handleFileChange"
    >
    <button
      type="button"
      class="rounded-lg bg-gray-100 px-3 py-1 transition-colors hover:bg-gray-200"
      @click="openFilePicker"
    >
      📷 图片
    </button>
  </div>
</template>
