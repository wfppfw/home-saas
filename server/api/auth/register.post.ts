import { createError, defineEventHandler, readBody } from 'h3'
import { UserService } from '../../services/user.service'

// /api/auth/register
// {
//   "username": "testuser",
//   "password": "Test1234"
// }

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 输入验证
  if (!body.username || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: '用户名和密码不能为空',
    })
  }

  // 用户名长度验证
  if (body.username.length < 2 || body.username.length > 7) {
    throw createError({
      statusCode: 400,
      data: { // 使用data.message替代statusMessage
        message: '用户名长度要求2~7',
        code: 'INVALID_PASSWORD_LENGTH',
      },
    })
  }

  // 密码强度验证
  if (body.password.length < 8) {
    throw createError({
      statusCode: 400,
      data: { // 使用data.message替代statusMessage
        message: '密码至少需要8个字符',
        code: 'INVALID_PASSWORD_LENGTH',
      },
    })
  }

  try {
    // 检查用户是否存在
    console.log('0sss')
    const existingUser = UserService.findUserByUsername(body.username)
    console.log(existingUser)
    if (existingUser) {
      throw createError({
        statusCode: 409,
        data: { // 使用data.message替代statusMessage
          message: '用户名已被注册',
          code: 'User had register',
        },
      })
    }

    // 创建用户
    const newUser = await UserService.createUser(body.username, body.password)

    return {
      status: 201,
      message: '注册成功',
      data: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        createdAt: newUser.created_at,
      },
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '注册失败',
    })
  }
})
