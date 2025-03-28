<!-- components/CommentContent.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: String,
  images: Array,
})

const parsedContent = computed(() => {
  const emojiRegex = /(\p{Emoji_Presentation})/gu
  return props.content.split(emojiRegex).map(part => ({
    type: emojiRegex.test(part) ? 'emoji' : 'text',
    content: part,
  }))
})
</script>

<template>
  <div class="mt-2 whitespace-pre-wrap text-gray-800">
    <template v-for="(part, index) in parsedContent" :key="index">
      <span v-if="part.type === 'text'">{{ part.content }}</span>
      <span v-else class="emoji">{{ part.content }}</span>
    </template>

    <div v-if="images.length" class="mt-2 flex flex-wrap gap-2">
      <img
        v-for="(img, index) in images"
        :key="index"
        :src="img"
        class="cursor-pointer max-h-[200px] max-w-[200px] border rounded object-cover"
        @click="$emit('show-images', images, index)"
      >
    </div>
  </div>
</template>
