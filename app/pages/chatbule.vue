<template>
  <div class="demo-container p-6 space-y-8">
    <!-- 基础示例 -->
    <HoverBubble>
      <template #trigger>
        <button class="btn-primary btn">
          悬停查看提示
        </button>
      </template>
      <div class="px-3 py-2">
        这是一个基础提示内容
      </div>
    </HoverBubble>

    <!-- 高级示例 -->
    <HoverBubble
      position="right"
      :delay="200"
      :offset="12"
      bubble-class="bg-indigo-100 dark:bg-indigo-900"
      :bubble-props="{
        arrowPlacement: 'end',
        rounded: 'rounded-xl',
        size: 'lg',
      }"
    >
      <template #trigger>
        <div class="icon-wrapper">
          <Icon name="mdi:information-outline" class="text-2xl" />
        </div>
      </template>
      <div class="flex items-start gap-2 p-2">
        <Icon name="mdi:alert-circle" class="shrink-0 text-red-500" />
        <div>
          <h3 class="font-semibold">
            重要提示
          </h3>
          <p class="mt-1 text-sm">
            当前操作不可逆转，请确认！
          </p>
        </div>
      </div>
    </HoverBubble>
  </div>
</template>

<style>
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg
         hover:bg-blue-700 transition-colors;
}

.icon-wrapper {
  @apply p-2 rounded-full bg-gray-100 dark:bg-gray-700
         hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer;
}
</style>
