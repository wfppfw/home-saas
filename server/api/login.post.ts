import { defineEventHandler, readBody } from 'h3'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // 模拟数据库用户验证（实际应查询数据库）
  const mockUser = {
    id: 1,
    username: 'admin',
    password: 'admin123',
  }

  if (body.username === mockUser.username && body.password === mockUser.password) {
    const token = jwt.sign(
      { userId: mockUser.id },
      config.jwtSecret,
      { expiresIn: '1h' },
    )

    return {
      statusCode: 200,
      token,
      user: {
        id: mockUser.id,
        username: mockUser.username,
      },
    }
  }

  throw createError({
    statusCode: 401,
    statusMessage: 'Invalid credentials',
  })
})
