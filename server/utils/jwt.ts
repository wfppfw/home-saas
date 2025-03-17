// ~/server/utils/jwt.ts
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'your-secret-key'

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h', // Token 有效期
  })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (error) {
    throw createError({
      statusCode: 401,
      message: '无效的 Token',
    })
  }
}
