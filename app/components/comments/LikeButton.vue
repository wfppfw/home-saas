<!-- components/LikeButton.vue -->
<script setup>
import { ref } from 'vue'

const props = defineProps({
  comment: Object,
})

const animating = ref(false)

function toggleLike() {
  props.comment.isLiked = !props.comment.isLiked
  props.comment.likes += props.comment.isLiked ? 1 : -1
  animating.value = true
  setTimeout(() => animating.value = false, 1000)
}
</script>

<template>
  <button
    class="flex items-center gap-1 transition-colors hover:text-red-600"
    :class="{ 'text-red-600': comment.isLiked }"
    @click.stop="toggleLike"
  >
    <span class="relative">
      <span v-if="animating" class="absolute inset-0 animate-ping opacity-75">❤️</span>
      ❤️
    </span>
    <span class="text-sm">{{ comment.likes || 0 }}</span>
  </button>
</template>
