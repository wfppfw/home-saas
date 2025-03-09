<script setup>
defineProps({
  imageSrc: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  layout: {
    type: String,
    default: 'left', // 'left' 或 'right'
    validator: value => ['left', 'right'].includes(value),
  },
  imageSize: {
    type: String,
    default: 'normal', // 'normal' 或 'small'
    validator: value => ['normal', 'small'].includes(value),
  },
  textPosition: {
    type: String,
    default: 'right', // 仅PC端有效
    validator: value => ['left', 'right'].includes(value),
  },
})
</script>

<template>
  <div
    class="mt-8 flex flex-col gap-4 md:mt-15 md:gap-6"
    :class="[layout === 'right' ? 'md:flex-row-reverse' : 'md:flex-row']"
  >
    <!-- 文字区域 -->
    <div
      class="order-1 mt-20 flex flex-1 flex-col justify-center md:mt-10"
      :class="textPosition === 'left' ? 'md:order-1' : 'md:order-2'"
    >
      <h2 class="text-center text-lg font-bold md:text-left md:text-xl">
        Luminous whispers of <span style="color:#4F46E5">moonlight</span> brush tenderly across the veil of night.
      </h2>
      <p class="mt-2 max-w-3xl text-center text-sm text-gray-600 md:text-left md:text-base">
        {{ description }}
      </p>
    </div>

    <!-- 图片区域 -->
    <div
      class="leftImg order-2 mt-50 flex-shrink-0 md:order-1 md:mt-10"
      :class="imageSize === 'small' ? 'w-24 h-24 md:w-32 md:h-32' : 'w-48 h-48 md:w-64 md:h-64'"
    >
      <img
        src="/moon.svg"
        alt="moon"
        class="mx-auto h-full w-full rounded-lg object-cover"
      >

      <!-- <Index3d /> -->
    </div>
  </div>
</template>

<style scoped>
.leftImg {
  overflow: hidden;
  margin: auto;
  /* position: fixed;
  bottom: 0px;
  right: 50%; */
}

@media (min-width: 768px) {
  .leftImg {
    /* margin-left: 150px; 覆盖为桌面端样式 */
  }
}
</style>
