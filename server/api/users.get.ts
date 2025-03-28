import { UserService } from '../services/user.service'

export default defineEventHandler(async (event) => {
  // 鉴权中间件
  const user = event.context.user
  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, message: '无权访问' })
  }

  return UserService.getAllUsers()
})
