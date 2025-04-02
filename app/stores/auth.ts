import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { id: number, username: string } | null,
    token: null as string | null,
    isAuthenticated: false,
    userInfo: {
      avatar: '',
      username: '',
      email: '',
      // ... 其他字段
    },
  }),

  actions: {
    async login(username: string, password: string) {
      try {
        const { data, error } = await useFetch('/api/auth/login', {
          method: 'POST',
          body: { username, password },
        })

        if (error.value)
          throw error.value
        console.log(data.value)
        this.token = data.value.token
        this.user = data.value.user
        this.isAuthenticated = true

        // 存储到 localStorage
        localStorage.setItem('moon_token', this.token)
        localStorage.setItem('moon_user', JSON.stringify(this.user))

        return { success: true }
      }
      catch (error) {
        return { success: false, error }
      }
    },

    logout() {
      this.$reset()
      localStorage.removeItem('moon_token')
      localStorage.removeItem('moon_user')
      // navigateTo('/login')
    },

    setInfo(info: string) {
      localStorage.setItem('moon_user', JOSN.stringify({ ...JSON.parse(localStorage.getItem('moon_user') as string), ...JSON.parse(info) }))
      this.user = JSON.parse(localStorage.getItem('moon_user') as string)
    },

    getAvatar() {
      return JSON.parse(JSON.parse(localStorage.getItem('moon_user') as string)?.info).avatar
    },
    getUserInfo() {
      return JSON.parse(localStorage.getItem('moon_user') as string)
    },

    async syncUserInfo() {
      try {
        // 从 localStorage 获取最新数据
        const localData = JSON.parse(localStorage.getItem('moon_user') as string) || {}

        // 可选：添加 API 请求获取最新数据
        // const { data } = await useFetch('/api/userinfo')
        // this.userInfo = data.value

        // 更新 store 状态
        this.userInfo = {
          avatar: JSON.parse(localData.info).avatar,
          username: localData.username,
          email: localData.email,
          // ... 其他字段
        }
      }
      catch (error) {
        console.error('用户信息同步失败:', error)
      }
    },

    checkAuth() {
      const token = localStorage.getItem('moon_token')
      const user = localStorage.getItem('moon_user')

      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        this.isAuthenticated = true
      }
    },

    // 登录状态判断逻辑
    isLoggedIn() {
      return this.isAuthenticated && this.token !== null
    },

    // 获取当前用户
    // currentUser() {
    //   return this.user
    // },
  },

  getters: {
    currentUser: state => state.user,
    authToken: state => state.token,
  },
})
