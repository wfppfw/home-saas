<!-- components/CommentItem.vue -->
<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  comment: Object,
  depth: Number,
})

const emit = defineEmits(['delete', 'show-images'])

const showReply = ref(false)
const showReplies = ref(false)

function addReply(content, images) {
  props.comment.replies.push({
    id: Date.now(),
    content,
    images,
    author: '当前用户',
    time: new Date().toLocaleString(),
    likes: 0,
    isLiked: false,
    replies: [],
    replyTo: props.comment.author,
  })
  showReply.value = false
}

function toggleReply() {
  showReply.value = !showReply.value
}
</script>

<template>
  <div class="group relative border rounded-lg bg-white p-4 shadow-sm">
    <button
      class="absolute right-2 top-2 text-gray-500 opacity-0 hover:text-red-600 group-hover:opacity-100"
      @click="$emit('delete', comment.id)"
    >
      ×
    </button>

    <div class="flex items-start gap-3">
      <img :src="comment.authorAvatar" class="h-10 w-10 rounded-full bg-gray-200">

      <div class="flex-1">
        <div class="flex items-baseline gap-2">
          <h3 class="font-medium">
            {{ comment.author }}
          </h3>
          <span class="text-sm text-gray-500">{{ comment.time }}</span>
        </div>

        <CommentContent :content="comment.content" :images="comment.images" @show-images="$emit('show-images', comment.images, $event)" />

        <div class="mt-2 flex items-center gap-4 text-sm">
          <LikeButton :comment="comment" />
          <ReplyButton @click="toggleReply" />
          <RepliesCounter
            v-if="depth === 0 && comment.replies.length"
            v-model:expanded="showReplies"
            :replies="comment.replies"
          />
        </div>

        <ReplyInput
          v-if="showReply"
          @submit="addReply"
          @cancel="showReply = false"
        />
      </div>
    </div>

    <div v-if="showReplies" class="ml-12 mt-4 space-y-4">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :depth="depth + 1"
        @delete="$emit('delete', $event)"
        @show-images="$emit('show-images', $event)"
      />
    </div>
  </div>
</template>
