/* eslint-disable unused-imports/no-unused-vars */
import hljs from 'highlight.js'
import bash from 'highlight.js/lib/languages/bash'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import typescript from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
// composables/useMarkdown.ts
import MarkdownIt from 'markdown-it'

import 'highlight.js/styles/atom-one-dark.css'

// 注册语言（同步方式）
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('html', html)

export function useMarkdown() {
  const md = new MarkdownIt({
    typographer: true, // 启用排版优化
    quotes: '“”‘’', // 中文引号转换
    linkify: true, // 自动链接识别
    breaks: false, // 禁用自动换行（由 CSS 控制）
    html: true,
    highlight: (str: string, lang: string) => {
      // 顶部工具栏
      const header = `
        <div class="code-header">
          <span class="code-lang">${lang || 'text'}</span>
          <button class="copy-btn" data-code="${encodeURIComponent(str)}">⎘ 复制</button>
        </div>
      `

      // 底部运行栏
      const footer = `
        <div class="code-footer">
          <button class="run-btn" data-code="${encodeURIComponent(str)}">▶ 运行代码</button>
        </div>
      `

      // 代码高亮
      let codeContent
      try {
        console.warn(lang)
        // codeContent = md.utils.escapeHtml(str)
        codeContent = lang && hljs.getLanguage(lang)
          ? hljs.highlight(str, { language: lang }).value
          : md.utils.escapeHtml(str)
      }
      catch (e) {
        codeContent = md.utils.escapeHtml(str)
      }

      // 格式化代码内容（添加自动换行）
      return `
        <pre class="hljs-code-block">
          ${header}
          <code class="hljs">${codeContent}</code>
          ${footer}
        </pre>
      `
    },
  })

  return md
}
