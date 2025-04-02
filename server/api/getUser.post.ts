import { UserService } from '../services/user.service'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // return UserService.updateUser(body.id, { username: body.username as string, info: body.info })

  // 参数验证
  if (!body.username) {
    throw createError({
      statusCode: 400,
      statusMessage: '用户名不能为空',
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
    // const isValid = await UserService.verifyPassword(user, body.password)
    // if (!isValid) {
    //   throw createError({
    //     statusCode: 401,
    //     statusMessage: '密码错误',
    //   })
    // }

    // 3. 生成 JWT
    // const token = jwt.sign(
    //   {
    //     userId: user.id,
    //     role: user.role,
    //   },
    //   config.jwtSecret, // 从 runtimeConfig 获取
    //   { expiresIn: '1h' },
    // )

    // 4. 返回响应
    return {
      statusCode: 200,
      user,
      message: '查询成功',
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.statusMessage || '服务器内部错误',
    })
  }
})
