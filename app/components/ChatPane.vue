<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import DOMPurify from 'dompurify'
import { onMounted } from 'vue'
import { toast } from 'vue3-toastify'

const props = defineProps({
  text: {
    type: String,
  },
})
// 初始化 markdown 解析器
const md = useMarkdown()

const content = props.text || ''

// 渲染后的 HTML
const renderedContent = md.render(content)

// 复制功能
async function copyToClipboard(html: string) {
  try {
    // 移除潜在危险内容
    const cleanHTML = DOMPurify.sanitize(html)

    console.warn(cleanHTML)
    // 创建富文本格式粘贴板内容
    // const blob = new Blob([cleanHTML], { type: 'text/html' })
    // const data = [new ClipboardItem({ 'text/html': blob })]
    // console.warn(data)
    // await navigator.clipboard.write(data)
    // toast.success('复制成功!', {
    //   position: 'top-center',
    //   autoClose: 400,
    //   closeButton: false, // 显示关闭按钮
    // })

    // const text = new DOMParser()
    //   .parseFromString(html, 'text/html')
    //   .body
    //   .textContent || ''
    await navigator.clipboard.writeText(cleanHTML)
    toast.success('复制成功!', {
      position: 'top-center',
      autoClose: 400,
      closeButton: false, // 显示关闭按钮
    })
  }

  catch (err) {
    // 降级方案：纯文本复制
    const text = new DOMParser()
      .parseFromString(html, 'text/html')
      .body
      .textContent || ''
    await navigator.clipboard.writeText(text)
    // toast.success('复制成功!', {
    //   position: 'top-center',
    //   autoClose: 400,
    //   closeButton: false, // 显示关闭按钮
    // })
  }
}

// 运行功能
function executeCode(code: string) {
  // 安全示例：弹出代码内容
  toast.success('开始运行!', { autoClose: 1000 })
}

// 绑定事件
onMounted(() => {
  // 复制按钮
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const code = decodeURIComponent(btn.getAttribute('data-code') || '')
      copyToClipboard(code)
    })
  })

  // 运行按钮
  document.querySelectorAll('.run-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const code = decodeURIComponent(btn.getAttribute('data-code') || '')
      executeCode(code)
    })
  })
})
</script>

<template>
  <div v-html="renderedContent" />
</template>

<style>
/* 引入主题样式 */
/* @import 'highlight.js/styles/github.css'; */

@media (prefers-color-scheme: light) {
  .hljs-code-block {
    background: #f5f5f5;
  }
  .code-toolbar {
    background: rgba(0, 0, 0, 0.05);
  }
}
@media (max-width: 768px) {
  .hljs-code-block {
    font-size: 0.85em;
    line-height: 1.4;
  }
  .code-buttons {
    gap: 4px;
  }
  .copy-btn,
  .run-btn {
    font-size: 0.7em;
    padding: 3px 8px;
  }
}

/* 处理超长代码 */
.hljs {
  overflow-wrap: anywhere; /* 强制折行 */
  hyphens: auto; /* 连字符 */
}

/* 特定语言例外处理 */
.language-python .hljs-string {
  white-space: pre; /* 保留 Python 多行字符串格式 */
}

/* 差异高亮样式 */
.hljs-addition {
  background: #1a472a;
} /* 新增行 */
.hljs-deletion {
  background: #4a2734;
} /* 删除行 */

/* 语法高亮增强 */
/* .hljs {
color: #abb2bf;
} */
</style>
