import { defineNuxtPlugin } from '#app'
import { ContentLoader } from 'vue-content-loader'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('ContentLoader', ContentLoader)
})
