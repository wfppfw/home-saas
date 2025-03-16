// plugins/toast.client.js
import { defineNuxtPlugin } from '#app'
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css' // 引入默认样式 [[3]]

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 3000, // 默认自动关闭时间
    position: 'top-right', // 弹出位置
  })

  // 注入全局 $toast 方法（可选）
  return {
    provide: {
      toast,
    },
  }
})
