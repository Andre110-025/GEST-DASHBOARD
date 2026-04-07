import axios from 'axios'
import { defineStore } from 'pinia'

interface User {
  _id: string
  first_name: string
  last_name: string
  email: string
  password?: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as User | null,
    token: null as string | null, //means it might be null or string
    // this will be null or save userInfo when logged in
  }),

  getters: {
    isLoggedIn: (state) => !!state.userInfo,
    // convert it's to a boolean, if user is logged in, else null
  },

  actions: {
    setUser(user: User) {
      console.log('Saving user:', user)
      this.userInfo = user
      localStorage.setItem('user_info', JSON.stringify(user))
    }, // replace current dets

    setToken(token: string) {
      console.log('Saving token:', token)
      this.token = token
      localStorage.setItem('auth_token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    // Initialize on app load (persistent login)
    initAuth() {
      const token = localStorage.getItem('auth_token')
      const user = localStorage.getItem('user_info')

      if (token) {
        this.token = token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }

      if (user) {
        this.userInfo = JSON.parse(user)
        console.log('Restored user from localStorage:', this.userInfo)
      }
    },

    clearUser() {
      this.userInfo = null
      this.token = null
      localStorage.removeItem('auth_token')
      delete axios.defaults.headers.common['Authorization']
    }, // clear everythings incase of logout
  },
})
