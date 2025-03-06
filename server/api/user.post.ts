import { db } from '../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const stmt = db.prepare(`
    INSERT INTO users (username, email)
    VALUES (@username, @email)
  `)

  try {
    const info = stmt.run(body)
    return {
      id: info.lastInsertRowid,
      ...body,
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message.includes('UNIQUE')
        ? 'Username or email already exists'
        : 'Create user failed',
    })
  }
})
