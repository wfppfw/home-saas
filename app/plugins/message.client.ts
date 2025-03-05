import type { MessageType } from '~/components/Message/type'
// plugins/message.client.ts
import Message from '@/components/Message/index.vue'
import { createSSRApp } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  let messageInstance: any = null

  const show = (type: MessageType, content: string, duration?: number) => {
    if (!messageInstance) {
      // 创建挂载容器
      const wrapper = document.createElement('div')
      document.body.appendChild(wrapper)

      // 使用 createSSRApp 创建应用实例
      messageInstance = createSSRApp(Message).mount(wrapper)
    }
    messageInstance.show(type, content, duration)
  }

  // 提供全局调用方法
  nuxtApp.provide('message', {
    success: (c: string, d?: number) => show('success', c, d),
    warning: (c: string, d?: number) => show('warning', c, d),
    error: (c: string, d?: number) => show('error', c, d),
    info: (c: string, d?: number) => show('info', c, d),
  })
})
