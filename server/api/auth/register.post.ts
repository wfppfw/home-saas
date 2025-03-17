// ~/server/api/auth/register.post.ts
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const { email, password, username } = await readBody(event)
  
  // 1. 检查用户是否存在
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: '该邮箱已注册'
    })
  }

  // 2. 加密密码
  const hashedPassword = bcrypt.hashSync(password, 10)

  // 3. 创建用户
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword
    }
  })

  // 4. 返回结果（排除密码）
  const { password: _, ...result } = user
  return result
})