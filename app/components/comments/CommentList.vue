<!-- components/CommentList.vue -->
<script setup>
const props = defineProps({
  comments: Array,
})

const emit = defineEmits(['delete', 'show-images'])

function openImageModal(images, index) {
  emit('show-images', images, index)
}
</script>

<template>
  <div class="space-y-4">
    <CommentItem
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      :depth="0"
      @delete="$emit('delete', $event)"
      @show-images="openImageModal"
    />
  </div>
</template>
