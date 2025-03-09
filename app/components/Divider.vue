<!-- components/Divider.vue -->
<script setup>
// eslint-disable-next-line unused-imports/no-unused-vars
const props = defineProps({
  // 方向：horizontal（默认） / vertical
  direction: {
    type: String,
    default: 'horizontal',
    validator: value => ['horizontal', 'vertical'].includes(value),
  },
  // 颜色
  color: {
    type: String,
    default: '#e0e0e0',
  },
  // 线粗（单位：px）
  thickness: {
    type: Number,
    default: 1,
  },
  // 外边距（CSS margin 值）
  spacing: {
    type: String,
    default: '16px 0',
  },
  // 自定义类名
  customClass: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div
    class="divider" :class="[
      direction === 'vertical' ? 'divider-vertical' : 'divider-horizontal',
      customClass,
    ]"
    :style="{
      'border-color': color,
      'border-width': `${thickness}px`,
      'margin': spacing,
    }"
  />
</template>

  <style scoped>
  .divider-horizontal {
  width: 100%;
  border-bottom: 0 solid transparent;
}

.divider-vertical {
  height: 100%;
  min-height: 1em;
  border-left: 0 solid transparent;
  display: inline-block;
  margin: 0 8px !important; /* 垂直分割线默认左右间距 */
}
</style>
