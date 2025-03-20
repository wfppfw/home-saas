// ~/server/api/ping.get.ts
export default defineEventHandler((event) => {
  // 显式处理 HEAD 请求
  if (event.method === 'HEAD') {
    event.node.res.setHeader('Content-Type', 'text/plain')
    event.node.res.statusCode = 200
    event.node.res.end()
    return
  }
  console.warn('222')
  // 处理 GET 请求
  return 'pong'
})
