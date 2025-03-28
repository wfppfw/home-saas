import { UserService } from '../services/user.service'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return UserService.createUser(body.username, body.password)
})
