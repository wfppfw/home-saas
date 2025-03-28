import { UserService } from '~~/server/services/user.service'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  return UserService.deleteUser(id)
})
