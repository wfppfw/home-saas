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
      class="order-1 flex flex-1 flex-col justify-center"
      :class="textPosition === 'left' ? 'md:order-1' : 'md:order-2'"
    >
      <h2 class="text-center text-lg font-bold md:text-left md:text-xl">
        The auspicious <span style="color:#4F46E5;">kitty</span> confers heavenly grace upon thee.
      </h2>
      <p class="mt-2 max-w-3xl text-center text-sm text-gray-600 md:text-left md:text-base">
        {{ description }}
      </p>
    </div>

    <!-- 图片区域 -->
    <div
      class="order-2 flex-shrink-0 md:order-1"
      :class="imageSize === 'small' ? 'w-48 h-48 md:w-64 md:h-64' : 'w-64 h-64 md:w-96 md:h-96'"
    >
      <!-- <img
        :src="imageSrc"
        alt=""
        class="h-full w-full rounded-lg object-cover"
      > -->

      <Index3d />
    </div>
  </div>
</template>
