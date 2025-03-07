<script setup lang="ts">
import { live2dStore } from '../../stores/live2dCat'

const live2d = live2dStore()
</script>

<template>
  <div
    v-show="live2d.isShow"
    :style="{ left: `${live2d.x}px`, bottom: `${live2d.y}px` }"
    class="fixd-cat-pane"
  >
    <canvas
      v-show="live2d.isShow"
      id="live2d"
      :width="live2d.width"
      :height="live2d.height"
    />
  </div>
</template>

<style>
.fixd-cat-pane {
  position: fixed;
  z-index: 100;
}
</style>
