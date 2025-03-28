<!-- components/ImageModal.vue -->
<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  images: Array,
  currentIndex: Number,
})

const emit = defineEmits(['close'])

const current = ref(props.currentIndex)
const zoomLevel = ref(1)

const currentImage = computed(() => props.images[current.value] || {})
const isGIF = computed(() => currentImage.value.url?.endsWith('.gif'))
const canZoom = computed(() => zoomLevel.value === 1 && !isGIF.value)

function toggleZoom() {
  zoomLevel.value = canZoom.value ? 2 : 1
}

function download() {
  const link = document.createElement('a')
  link.href = currentImage.value.url
  link.download = `comment-${Date.now()}${isGIF.value ? '.gif' : '.jpg'}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function close() {
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90" @click.self="close">
    <button class="absolute right-4 top-4 text-3xl text-white" @click="close">
      &times;
    </button>

    <div class="relative max-h-[90vh] max-w-4xl">
      <button
        v-if="images.length > 1"
        class="absolute left-4 top-1/2 text-3xl text-white -translate-y-1/2"
        @click.stop="current = (current - 1 + images.length) % images.length"
      >
        &lt;
      </button>

      <img
        :src="currentImage.url"
        class="max-h-[90vh] max-w-full object-contain"
        :class="{ 'cursor-zoom-in': canZoom }"
        @click.stop="toggleZoom"
      >

      <button
        v-if="images.length > 1"
        class="absolute right-4 top-1/2 text-3xl text-white -translate-y-1/2"
        @click.stop="current = (current + 1) % images.length"
      >
        &gt;
      </button>

      <div class="absolute bottom-4 left-1/2 text-white -translate-x-1/2">
        {{ current + 1 }} / {{ images.length }}
      </div>

      <button
        class="absolute right-16 top-4 rounded bg-black/50 p-2 text-white hover:bg-black/70"
        @click.stop="download"
      >
        ⬇️ 下载
      </button>

      <span
        v-if="isGIF"
        class="absolute left-4 top-4 rounded bg-black/50 px-2 py-1 text-sm text-white"
      >
        GIF
      </span>
    </div>
  </div>
</template>
