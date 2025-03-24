<script setup lang="ts">
// import { dracula } from '@uiw/codemirror-theme-dracula'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: 'javascript',
  },
})
const emit = defineEmits(['update:modelValue'])
// import '@uiw/codemirror-theme-dracula/dist/dracula.css'
definePageMeta({
  layout: 'clean',
})
const editorContainer = ref<HTMLElement>()
let editor: any = null

// 动态加载 CodeMirror 核心（避免 SSR 问题）
async function initEditor() {
  if (!import.meta.client)
    return

  const { EditorView, basicSetup } = await import('codemirror')
  // const { indentUnit, indentOnInput } = await import('@codemirror/language')
  // const { defaultHighlightStyle, syntaxHighlighting } = await import('@codemirror/language')
  const { foldGutter } = await import('@codemirror/fold') // 代码折叠
  const { javascript } = await import('@codemirror/lang-javascript')
  const { dracula } = await import('@uiw/codemirror-theme-dracula')
  const { keymap } = await import('@codemirror/view')
  const { acceptCompletion, autocompletion } = await import('@codemirror/autocomplete')
  const { defaultKeymap } = await import('@codemirror/commands')

  const customTheme = EditorView.theme({
  // 设置编辑器整体字体
    '&': {
      fontSize: '14px',
      fontFamily: 'Fira Code,OpenSans', // 使用 Fira Code 字体
    },
    // 确保内容区域继承字体
    '.cm-content': {
      fontFamily: 'FiraCode,OpenSans',
    },
  })

  editor = new EditorView({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      javascript(),
      dracula,
      customTheme,

      autocompletion(), // 启用自动补全功能

      // foldGutter(),
      // syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      // indentUnit.of('  '),
      // indentOnInput(),

      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          emit('update:modelValue', update.state.doc.toString())
        }
      }),
    ],
    parent: editorContainer.value,
  })
}

onMounted(async () => {
  await nextTick()
  initEditor()
})

onBeforeUnmount(() => {
  editor?.destroy()
})
</script>

<template>
  <ClientOnly>
    <div
      ref="editorContainer"
      class="editorContainer overflow-hidden border border-gray-200 rounded-lg [&_.cm-gutters]:bg-gray-50"
    />
  </ClientOnly>
</template>

<style>
/* 确保编辑器容器没有居中样式 */
.editorContainer {
  text-align: left; /* 强制左对齐 */
}
/* .cm-editor.cm-focused {
  outline: none !important;
}

.cm-scroller {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.6;
} */
</style>
