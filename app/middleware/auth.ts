export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  // 每次路由变化时检查认证状态
  auth.checkAuth()

  // 需要登录的页面
  // if (to.meta.requiresAuth && !auth.isLoggedIn()) {
  //   return navigateTo('/login?redirect=' + encodeURIComponent(to.fullPath))
  // }

  // 已登录用户禁止访问登录/注册页
  if (['/login', '/register'].includes(to.path) && auth.isLoggedIn()) {
    return navigateTo('/')
  }
})
