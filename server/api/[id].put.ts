import { db } from '../utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const stmt = db.prepare(`
    UPDATE users 
    SET username = @username, email = @email
    WHERE id = @id
  `)

  try {
    stmt.run({ ...body, id })
    return { success: true }
  }
  catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message.includes('UNIQUE')
        ? 'Username or email already exists'
        : 'Update failed',
    })
  }
})
