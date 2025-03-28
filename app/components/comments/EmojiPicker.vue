<!-- components/EmojiPicker.vue -->
<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select'])

const emojis = ref([
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '😂',
  '🤣',
  '😇',
  '😉',
  '😊',
  '😍',
  '🥰',
  '😘',
  '😋',
  '😛',
  '😜',
  '🤪',
  '😎',
  '🥳',
  '😏',
  '😒',
  '😞',
  '😔',
  '😟',
  '😕',
  '🙁',
  '😣',
  '😖',
  '😫',
  '😩',
  '🥺',
  '😢',
  '😭',
  '😤',
  '😠',
  '😡',
  '🤬',
  '🤯',
  '😳',
  '🥵',
  '🥶',
  '😱',
  '😨',
  '😰',
  '😥',
  '😓',
  '🤗',
  '🤔',
  '🤭',
  '🤫',
  '🤥',
  '😶',
  '😐',
  '😑',
  '😬',
  '🙄',
  '😯',
  '😦',
  '😧',
  '😮',
  '😲',
  '🥱',
  '😴',
  '🤤',
  '😪',
  '😵',
  '🤐',
  '🥴',
  '🤢',
  '🤮',
  '🤧',
  '😷',
  '🤒',
  '🤕',
  '🤑',
  '🤠',
  '😈',
  '👿',
  '👹',
])

function selectEmoji(emoji) {
  emit('select', emoji)
}
</script>

<template>
  <div v-if="show" class="emoji-picker absolute bottom-full z-10 mb-2 border rounded-lg bg-white p-2 shadow-lg">
    <div class="grid grid-cols-8 max-h-[200px] gap-1 overflow-y-auto">
      <button
        v-for="(emoji, index) in emojis"
        :key="index"
        class="rounded p-1 text-xl hover:bg-gray-100"
        @click="selectEmoji(emoji)"
      >
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

  <style>
  .emoji-picker {
  width: 300px;
}
</style>
