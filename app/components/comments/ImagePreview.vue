<!-- components/ImagePreview.vue -->
<script setup>
defineProps({
  image: {
    type: Object,
    required: true,
  },
})

defineEmits(['remove'])
</script>

<template>
  <div class="group relative">
    <img
      :src="image.url"
      class="h-20 w-20 border rounded object-cover transition-opacity hover:opacity-75"
    >
    <button
      class="absolute h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity -right-2 -top-2 group-hover:opacity-100"
      @click="$emit('remove')"
    >
      ×
    </button>
  </div>
</template>
