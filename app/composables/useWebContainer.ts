import { useAsyncState } from '@vueuse/core'
import { WebContainer } from '@webcontainer/api'
import { ref } from 'vue'

export function useWebContainer() {
  const { state: webcontainer, execute: initWebContainer } = useAsyncState(
    async () => {
      const wc = await WebContainer.boot()
      await wc.mount({
        'index.js': {
          file: { contents: 'console.log("Hello WebContainer!")' },
        },
      })
      return wc
    },
    null,
    { immediate: false },
  )

  const output = ref('')
  const isRunning = ref(false)

  async function runCode(code: string) {
    if (!webcontainer.value || isRunning.value)
      return

    isRunning.value = true
    output.value = ''

    try {
      // 更新文件内容
      await webcontainer.value.fs.writeFile('index.js', code)

      // 执行代码
      const process = await webcontainer.value.spawn('node', ['index.js'])
      const reader = process.output.getReader()

      while (true) {
        const { done, value } = await reader.read()
        if (done)
          break
        output.value += new TextDecoder().decode(value)
      }

      await process.exit
    }
    catch (err) {
      output.value = `Error: ${err instanceof Error ? err.message : String(err)}`
    }
    finally {
      isRunning.value = false
    }
  }

  return {
    webcontainer,
    initWebContainer,
    runCode,
    output,
    isRunning,
  }
}
