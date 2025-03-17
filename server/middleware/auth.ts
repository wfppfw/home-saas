/* eslint-disable unused-imports/no-unused-vars */
// ~/server/middleware/auth.ts
import { verifyToken } from '../utils/jwt'

export default defineEventHandler((event) => {
  // 1. 排除登录/注册路由
  if (event.path?.startsWith('/api/auth'))
    return

  // 2. 获取 Token
  const token = getHeader(event, 'Authorization')?.split(' ')[1]

  // 3. 验证 Token
  try {

    // if (!token) throw new Error()
    // const decoded = verifyToken(token)
    // event.context.auth = decoded

  }
  catch (error) {
    throw createError({
      statusCode: 401,
      message: '请先登录',
    })
  }
})
