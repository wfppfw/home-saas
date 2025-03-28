import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { id: number, username: string } | null,
    token: null as string | null,
    isAuthenticated: false,
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
