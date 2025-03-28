export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as any[],
  }),

  actions: {
    async fetchUsers() {
      const { data } = await useFetch('/api/users')
      this.users = data.value || []
    },

    async createUser(userData: { username: string, password: string }) {
      await $fetch('/api/users', {
        method: 'POST',
        body: userData,
      })
      await this.fetchUsers()
    },

    async updateUser(id: number, updateData: any) {
      await $fetch(`/api/users/${id}`, {
        method: 'PUT',
        body: updateData,
      })
      await this.fetchUsers()
    },

    async deleteUser(id: number) {
      await $fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })
      await this.fetchUsers()
    },
  },
})
