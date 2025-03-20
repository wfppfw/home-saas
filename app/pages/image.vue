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
    <SimpleTextTab
      :tabs="tabs"
      initial-tab="profile"
    >
      <template #dashboard>
        <div class="space-y-4">
          <ImgSizeTool />
        </div>
      </template>

      <template #profile>
        <div class="space-y-4">
          <ImgFormatTool />
        </div>
      </template>

      <template #settings>
        <div class="space-y-4">
          <h3 class="text-xl text-gray-800 font-semibold dark:text-gray-200">
            系统设置
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            这里是系统设置内容...
          </p>
        </div>
      </template>
    </SimpleTextTab>
  </div>
</template>
