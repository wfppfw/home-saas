import { defineStore } from 'pinia'

export const live2dStore = defineStore('live2dInfo', {
  state: () => {
    return {
      isShow: true,
      width: 200,
      height: 300,
      x: 0,
      y: 0,
      name: '',
    }
  },
  getters: {},
  actions: {},
})
