<script setup>
import { computed, ref } from 'vue'
import { useStyleTransfer } from '../utils/use-style-transfer'

const filters = ref({
  brightness: 1,
  contrast: 1,
  saturate: 1,
  hue: 0,
  blur: 0,
})

const cssCode = computed(() =>
  `filter: 
     brightness(${filters.value.brightness}) 
     contrast(${filters.value.contrast})
     saturate(${filters.value.saturate})
     hue-rotate(${filters.value.hue}deg)
     blur(${filters.value.blur}px)`,
)

const {
  contentImage,
  styleImage,
  applyStyleTransfer,
} = useStyleTransfer()

function applyPreset(preset) {
  filters.value = { ...preset }
}
</script>

<template>
  <div class="filter-tab">
    <FileUpload @file-changed="handleContent" />

    <template v-if="contentImage">
      <div class="filter-grid">
        <div class="controls">
          <FilterPresets @select="applyPreset" />
          <FilterControls v-model="filters" />
          <CssCode :code="cssCode" />
        </div>

        <div class="preview">
          <ImagePreview
            :src="contentImage"
            :filters="cssCode"
          />
          <StyleTransfer
            v-model:style-image="styleImage"
            @transfer="applyStyleTransfer"
          />
        </div>
      </div>
    </template>
  </div>
</template>
