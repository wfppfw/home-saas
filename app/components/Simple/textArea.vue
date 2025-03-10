<script setup>
import { computed, ref, useSlots } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '用户协议与隐私政策',
  },
  width: {
    type: String,
    default: '600px',
  },
  height: {
    type: String,
    default: '400px',
  },
  content: { // 新增内容prop，用于传入HTML格式文本
    type: String,
    required: true,
  },
})

// 处理内容中的标签样式（如数字转为带样式的标签）
const processedContent = computed(() => {
  return props.content
  // 示例：将数字自动转换为带样式的标签（可扩展正则逻辑）
//   return props.content.replace(/(\d+)/g, '<span class="tag">$1</span>') // <button class="citation-flag" data-index="7"><button class="citation-flag" data-index="10">
})
</script>

<template>
  <!-- <div class="agreement-container" :style="{ width, height }">

  </div> -->
  <div class="content">
    <div class="scroll-content" v-html="processedContent" /> <!-- 使用v-html渲染处理后的内容<button class="citation-flag" data-index="7"> -->
  </div>
</template>

  <style scoped>
/* h1,
h2,
h3,
h4,
ul,
ol,
li {
  font-size: revert !important;
} */

.scroll-content :slotted(h1) {
  color: #ffeb3b;
  font-size: 2em !important;
  /* all: revert !important; */
}
.scroll-content :slotted(h2) {
  color: #ffeb3b;
  font-size: 1.5em !important;
  /* all: revert !important; */
}

.agreement-container {
  border: 1px solid #ebedf0;
  border-radius: 8px;
  overflow: hidden;
}

.header {
  padding: 20px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebedf0;
}

.content {
  height: calc(100% - 60px);
  overflow-y: auto;
  overflow-x: auto;
}

.scroll-content {
  padding: 20px;
  line-height: 1.6;
  font-size: 14px;
  color: #666;
}

/* 标签样式定义 */
.tag {
  display: inline-block;
  padding: 2px 6px;
  margin: 0 3px;
  background-color: #ffeb3b; /* 明亮黄色<button class="citation-flag" data-index="3"> */
  border-radius: 4px;
  font-size: 0.8em;
  color: #212121;
  text-decoration: none;
  vertical-align: middle;
}
</style>
