import { defineEventHandler, readBody } from 'h3'

// server/api/auth/login.post.ts
import jwt from 'jsonwebtoken'
import { UserService } from '~~/server/services/user.service'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // 参数验证
  if (!body.username || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: '用户名和密码不能为空',
    })
  }

  try {
    // 1. 查询数据库用户
    const user = UserService.findUserByUsername(body.username)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: '用户不存在',
      })
    }

    // 2. 验证密码
    const isValid = await UserService.verifyPassword(user, body.password)
    if (!isValid) {
      throw createError({
        statusCode: 401,
        statusMessage: '密码错误',
      })
    }

    // 3. 生成 JWT
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      config.jwtSecret, // 从 runtimeConfig 获取
      { expiresIn: '1h' },
    )

    // 4. 返回响应
    return {
      statusCode: 200,
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '服务器内部错误',
    })
  }
})
