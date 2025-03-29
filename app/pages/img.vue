<!-- 父组件使用示例 -->
<script setup>
const tabs = [
  { id: 'imgSize', label: '图片格式', badge: 'New' },
  { id: 'imgFormat', label: '图片尺寸' },
  { id: 'settings', label: '系统设置', badge: '3' },
]
</script>

<template>
  <div class="mx-auto max-w-3xl p-6">
    <ImageTools />
  </div>
</template>
