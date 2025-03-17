export default defineEventHandler((event) => {
  // 获取客户端 IP
  const getClientIP = () => {
    const headers = event.node.req.headers
    // 优先从 X-Forwarded-For 获取经过代理后的真实 IP
    const xForwardedFor = headers['x-forwarded-for']
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim()
    }
    return event.node.req.socket?.remoteAddress || 'unknown'
  }

  return {
    status: 200,
    data: {
      ip: getClientIP(),
      timestamp: new Date().toISOString(),
      time: Date.now(),
    },
  }
})
