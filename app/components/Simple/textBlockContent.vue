<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="text-block">
    <h1 class="title">
      <span class="blankBtn" title="Easter egg">Blank</span> of  end

      <div class="eggText">
        Press "
        <Icon class="mt-[5px]" name="ph:arrow-up-bold" />
        <Icon name="ph:arrow-up-bold" />
        <Icon name="ph:arrow-down-bold" />
        <Icon name="ph:arrow-down-bold" />
        <Icon name="ph:arrow-left-bold" />
        <Icon name="ph:arrow-right-bold" />
        <Icon name="ph:arrow-left-bold" />
        <Icon name="ph:arrow-right-bold" />
        <span>B</span>
        <span>A</span>
        "
      </div>
    </h1>
    <p class="description">
      {{ description }}
    </p>
  </div>
</template>

<style scoped>
/* 修改 .eggText 部分 */
.eggText {
  display: none;
  position: absolute;
  left: 50%; /* 定位到父容器水平中点 */
  top: 250%;
  font-size: 2rem;
  color: #666;
  transform: translateX(-50%); /* 通过偏移实现真正居中 */
  white-space: nowrap; /* 防止内容换行破坏居中 */
  gap: 0.25rem;

  opacity: 0.7;
  /* 新增以下 Flex 对齐属性 */
  /* display: flex; */
  justify-content: center; /* 内容水平居中 */
  align-items: center; /* 垂直居中（可选） */
}

/* 移除 Icon 组件的额外 margin */
.eggText .icon {
  margin: 0 !important;
  vertical-align: middle; /* 确保图标对齐 */
}

.title {
  position: relative; /* 为绝对定位提供参考 */
}

.blankBtn:hover + .eggText {
  display: flex; /* 悬停时显示 */
}
.blankBtn {
  cursor: url('/pointer.svg'), pointer !important;
}

.blankBtn:hover {
  color: #4f46e5;
}
.text-block {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 8px;
  word-wrap: break-word;
}

.description {
  font-size: 1rem;
  color: #666;
  word-wrap: break-word;
}

@media (max-width: 640px) {
  .title {
    font-size: 1.5rem;
  }

  .description {
    font-size: 0.875rem;
  }
}
</style>
