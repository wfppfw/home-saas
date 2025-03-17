// ~/server/api/auth/login.post.ts
import bcrypt from 'bcryptjs'
import { generateToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  const { name, password } = await readBody(event)

  // 1. 查询用户（示例使用虚拟数据）
  //   const user = await prisma.user.findUnique({
  //     where: { name },
  //   })
  const user = { name: '1', password: '2', id: '3' }

  // 2. 验证用户
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw createError({
      statusCode: 401,
      message: '用户名或密码错误',
    })
  }

  // 3. 生成 Token
  const token = generateToken({
    userId: user.id,
    name: user.name,
  })

  // 4. 返回用户数据（排除密码）
  const { password: _, ...safeUser } = user
  return {
    token,
    user: safeUser,
  }
})
