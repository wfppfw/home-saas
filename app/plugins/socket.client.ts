import { io } from 'socket.io-client'

// eslint-disable-next-line unused-imports/no-unused-vars
export default defineNuxtPlugin((nuxtApp) => {
  const socket = io('http://localhost:3001', {
    autoConnect: false,
  })

  return {
    provide: {
      io: socket,
    },
  }
})
