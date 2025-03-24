<script setup>
import { defaultKeymap } from '@codemirror/commands'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'

const editorEl = ref<HTMLElement>(null)

definePageMeta({
  layout: 'clean',
})

onMounted(async () => {
  await nextTick()
  let startState = EditorState.create({
    doc: 'Hello World',
    extensions: [keymap.of(defaultKeymap)],
  })

  let view = new EditorView({
    state: startState,
    parent: editorEl,
  })
})
</script>

<template>
  <div>
    <ClientOnly>
      <div ref="editorEl" class="editor-container h-96 border rounded" />
    </ClientOnly>
  </div>
</template>

  <style>

</style>
