export default defineEventHandler(async (event) => {
  const { method } = event.node.req
  const query = getQuery(event)
  const body = method === 'GET' ? undefined : await readBody(event)

  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    status: 200,
    data: {
      method,
      query,
      body,
      headers: event.node.req.headers,
      timestamp: Date.now(),
    },
  }
})
