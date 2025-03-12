// server/middleware/font-cache.ts
export default defineEventHandler((event) => {
  const path = event.node.req.url

  if (path?.includes('.woff2')) {
    event.node.res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    event.node.res.setHeader('Vary', 'Accept-Encoding')
  }
})
