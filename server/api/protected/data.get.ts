// ~/server/api/protected/data.get.ts
export default defineEventHandler((event) => {
  // 通过中间件验证后的用户信息
  const user = event.context.auth

  return {
    message: `欢迎回来，${user.email}`,
    secretData: '这是受保护的数据',
    user,
  }
})
