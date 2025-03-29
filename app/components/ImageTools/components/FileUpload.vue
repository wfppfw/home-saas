<!-- components/ImageTools/FileUpload.vue -->
<script setup>
const emit = defineEmits(['file-changed'])
const fileInput = ref(null)

function handleFileChange(e) {
  const file = e.target.files[0]
  if (file)
    emit('file-changed', file)
}

function triggerUpload() {
  fileInput.value.click()
}
</script>

<template>
  <div class="file-upload">
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      class="hidden"
      @change="handleFileChange"
    >
    <button
      class="btn-secondary w-full"
      @click="triggerUpload"
    >
      {{ label || '上传图片' }}
    </button>
  </div>
</template>
