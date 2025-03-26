<script setup>
defineProps({
  avatar: {
    type: String,
    default: '',
  },
})

defineEmits(['open-selector'])
</script>

<template>
  <div class="mb-8 flex flex-col animate-fade-in items-center">
    <!-- 头像容器 -->
    <div
      class="group relative mb-4 h-24 w-24 cursor-pointer rounded-full bg-gray-200 transition-transform duration-300 hover:scale-105 dark:bg-gray-700"
      @click="$emit('open-selector')"
    >
      <!-- 头像图片 -->
      <img
        v-if="avatar"
        :src="avatar"
        class="h-full w-full rounded-full object-cover"
        alt="用户头像"
      >
      <!-- 头像遮罩层 -->
      <div class="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
        <div class="i-mdi-camera text-2xl text-white" />
      </div>
    </div>

    <!-- 更换头像按钮 -->
    <button
      class="flex items-center gap-1 text-sm text-blue-600 transition-colors dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
      @click="$emit('open-selector')"
    >
      <div class="i-mdi-pencil h-4 w-4" />
      {{ avatar ? '更换头像' : '上传头像' }}
    </button>
  </div>
</template>

  <style scoped>
  .animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
