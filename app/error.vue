<!-- ~/error.vue -->
<script setup>
defineProps({
  error: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <!-- 错误码容器 -->
    <div class="mb-8 text-center">
      <!-- 错误码 -->
      <h1 class="mb-4 animate-pulse text-9xl text-red-600 font-bold">
        {{ error.statusCode || 500 }}
      </h1>

      <!-- 错误信息 -->
      <p class="mb-4 text-2xl text-gray-700 md:text-3xl">
        {{ error.message || 'Oops! Something went wrong' }}
      </p>
    </div>

    <!-- 返回按钮 -->
    <NuxtLink
      to="/"
      class="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium transition-colors duration-200 hover:bg-blue-700"
    >
      ← 返回首页
    </NuxtLink>
  </div>
</template>
