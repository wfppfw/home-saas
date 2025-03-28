<!-- components/CommentInput.vue -->
<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])
const content = ref('')
const previewImages = ref([])
const input = ref(null)

function insertEmoji(emoji) {
  const start = input.value.selectionStart
  const end = input.value.selectionEnd
  content.value = content.value.slice(0, start) + emoji + content.value.slice(end)
  input.value.focus()
  input.value.setSelectionRange(start + emoji.length, start + emoji.length)
}

function handleFiles(files) {
  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = () => {
      previewImages.value.push({
        url: reader.result,
        file,
      })
    }
    reader.readAsDataURL(file)
  })
}

function removePreviewImage(index) {
  previewImages.value.splice(index, 1)
}

function submitComment() {
  if (!content.value.trim() && !previewImages.value.length)
    return

  emit('submit', {
    content: content.value,
    images: previewImages.value.map(img => img.url),
  })

  content.value = ''
  previewImages.value = []
}
</script>

<template>
  <div class="mb-8">
    <div class="mb-2 flex gap-2">
      <FileUpload @files-selected="handleFiles" />
      <EmojiPicker @select="insertEmoji" />
    </div>

    <div v-if="previewImages.length" class="my-2 flex flex-wrap gap-2">
      <ImagePreview
        v-for="(img, index) in previewImages"
        :key="index"
        :image="img"
        @remove="removePreviewImage(index)"
      />
    </div>

    <textarea
      ref="input"
      v-model="content"
      class="w-full border rounded-lg p-3 shadow-sm"
      placeholder="写下你的评论..."
      rows="3"
    />

    <button
      class="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      @click="submitComment"
    >
      发布评论
    </button>
  </div>
</template>
