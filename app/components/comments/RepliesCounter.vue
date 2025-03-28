<!-- components/RepliesCounter.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  replies: Array,
  expanded: Boolean,
})

const totalReplies = computed(() => {
  const count = replies =>
    replies.reduce((acc, reply) => acc + 1 + count(reply.replies), 0)
  return count(props.replies)
})
</script>

<template>
  <div class="flex items-center gap-2 text-gray-600">
    <span>共{{ totalReplies }}条回复</span>
    <button
      class="text-blue-600 hover:text-blue-700"
      @click="$emit('update:expanded', !expanded)"
    >
      {{ expanded ? '收起' : '展开' }}
    </button>
  </div>
</template>
