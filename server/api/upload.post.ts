// ~/server/api/upload.post.ts
export default defineEventHandler(async (event) => {
  const body = await readRawBody(event)
  return { size: body?.length || 0 }
})
