import { db } from '../utils/db'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  const stmt = db.prepare('DELETE FROM users WHERE id = ?')
  const result = stmt.run(id)

  if (result.changes === 0) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    })
  }

  return { success: true }
})
