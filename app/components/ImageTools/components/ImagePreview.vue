<!-- components/ImageTools/ImagePreview.vue -->
<script setup>
import { watchEffect } from 'vue'

const props = defineProps({
  src: String,
  filters: String,
  label: String,
})

const canvas = ref(null)

watchEffect(async () => {
  if (props.src && canvas.value) {
    const img = await loadImage(props.src)
    const ctx = canvas.value.getContext('2d')
    canvas.value.width = img.width
    canvas.value.height = img.height
    ctx.filter = props.filters || 'none'
    ctx.drawImage(img, 0, 0)
  }
})

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = src
  })
}
</script>

<template>
  <div class="preview-container">
    <canvas ref="canvas" :style="canvasStyle" />
    <div v-if="label" class="preview-label">
      {{ label }}
    </div>
  </div>
</template>
