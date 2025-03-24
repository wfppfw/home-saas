<script setup lang="ts">
import { acceptCompletion, autocompletion } from '@codemirror/autocomplete'
import { defaultKeymap } from '@codemirror/commands'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { linter, lintGutter } from '@codemirror/lint'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, keymap } from '@codemirror/view'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { ESLint } from 'eslint'
// import { eslint } from 'eslint-linter-browserify'

import { ref } from 'vue'
import { Codemirror } from 'vue-codemirror'

const props = defineProps<{ code: string }>()
const emit = defineEmits(['update:code'])
const code = ref(props.code)
watch(() => props.code, (newCode) => {
  code.value = newCode
})
const selectedLang = ref('javascript')

const langExtensions = computed(() => {
  switch (selectedLang.value) {
    case 'javascript': return javascript()
    case 'python': return python()
    case 'html': return html()
    case 'css': return css()
    default: return javascript()
  }
})

const customKeymap = keymap.of([
  ...defaultKeymap,
  {
    key: 'Tab',
    run: (view) => {
      if (view.state.field(autocompletion()).active.some(a => a.state.selected)) {
        acceptCompletion(view)
        return true
      }
      return false
    },
  },
])

const customTheme = EditorView.theme({
  '&': {
    fontSize: '14px',
    fontFamily: 'Fira Code,OpenSans',
  },
  '.cm-content': {
    fontFamily: 'FiraCode',
  },
})

const extensions = computed(() => [
  langExtensions.value,
  dracula,
  customTheme,
  autocompletion(),
  customKeymap,
  lintGutter(),
])

function copyCode() {
  navigator.clipboard.writeText(code.value)
}

function runCode() {
  try {
    // WARNING: eval can be dangerous in production
    eval(code.value)
  }
  catch (error) {
    console.error('Execution error:', error)
  }
}

function handleReady() {
  console.log('CodeMirror is ready!')
}

function handleChange(value: string) {
  emit('update:code', value)
  console.log('value:', value)
}
</script>

<template>
  <div class="code-editor">
    <div class="toolbar flex items-center gap-2 border-b border-[#374151] bg-#282a36 p-2">
      <button
        class="border border-[#374151] rounded px-3 py-1.5 text-sm transition-colors hover:bg-[#374151]"
        @click="copyCode"
      >
        📋 Copy
      </button>
      <button
        class="border border-[#374151] rounded px-3 py-1.5 text-sm transition-colors hover:bg-[#374151]"
        @click="runCode"
      >
        ▶️ Run
      </button>
      <select
        v-model="selectedLang"
        class="ml-auto border border-[#374151] rounded bg-transparent px-3 py-1.5 text-sm hover:bg-[#374151]"
      >
        <option value="javascript">
          JavaScript
        </option>
        <option value="python">
          Python
        </option>
        <option value="html">
          HTML
        </option>
        <option value="css">
          CSS
        </option>
      </select>
    </div>

    <Codemirror
      v-model="code"
      :style="{ height: '400px' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @ready="handleReady"
      @change="handleChange"
    />
  </div>
</template>

<style scoped>
.code-editor {
  text-align: left; /* 强制左对齐 */

  margin: 20px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #374151;
}
</style>
