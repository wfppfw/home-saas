import { UserService } from '~~/server/services/user.service'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody(event)

  // 过滤允许更新的字段
  const updateData = {
    username: body.username,
    role: body.role,
  }

  return UserService.updateUser(id, updateData)
})
