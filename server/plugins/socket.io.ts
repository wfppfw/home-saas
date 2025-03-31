import { Server as Engine } from 'engine.io'
import { defineEventHandler } from 'h3'
import { Server } from 'socket.io'

export default defineNitroPlugin((nitroApp) => {
  const engine = new Engine()
  const io = new Server()
  const users = new Map<string, any>()
  io.bind(engine)

  io.on('connection', (socket) => {
    // ...
    console.log('connection!!!!!!!!!!!!')
    io.emit('users', Array.from(users.values()))

    socket.on('join', (username) => {
      users.set(socket.id, { id: socket.id, name: username })
      io.emit('user-joined', username)
      io.emit('users', Array.from(users.values()))
    })

    socket.on('disconnect', () => {
      users.delete(socket.id)
      io.emit('users', Array.from(users.values()))
    })
  })

  nitroApp.router.use('/socket.io/', defineEventHandler({
    handler(event) {
      engine.handleRequest(event.node.req, event.node.res)
      event._handled = true
    },
    websocket: {
      open(peer) {
        // @ts-expect-error private method and property
        engine.prepare(peer._internal.nodeReq)
        // @ts-expect-error private method and property
        engine.onWebSocket(peer._internal.nodeReq, peer._internal.nodeReq.socket, peer.websocket)
      },
    },
  }))
})
