<!-- components/CommentSection.vue -->
<script setup>
import { ref } from 'vue'
import CommentInput from './CommentInput.vue'
import CommentList from './CommentList.vue'
import ImageModal from './ImageModal.vue'

const comments = ref([]) // 初始化数据

// 图片查看相关状态
const showImageModal = ref(false)
const modalImages = ref([])
const currentImageIndex = ref(0)

function openImageModal(images, index = 0) {
  modalImages.value = images
  currentImageIndex.value = index
  showImageModal.value = true
}

function closeImageModal() {
  showImageModal.value = false
}

function addComment(newComment) {
  comments.value.push({
    id: Date.now(),
    ...newComment,
    likes: 0,
    isLiked: false,
    replies: [],
    time: new Date().toLocaleString(),
  })
}

function handleDelete(commentId) {
  comments.value = comments.value.filter(c => !findComment(c, commentId))
}

function findComment(comment, targetId) {
  if (comment.id === targetId)
    return true
  return comment.replies.some(reply => findComment(reply, targetId))
}
</script>

<template>
  <div class="mx-auto max-w-2xl p-4 space-y-6">
    <CommentInput @submit="addComment" />
    <CommentList :comments="comments" @delete="handleDelete" />
    <ImageModal v-if="showImageModal" :images="modalImages" :current-index="currentImageIndex" @close="closeImageModal" />
  </div>
</template>
