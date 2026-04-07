<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { toast } from 'vue3-toastify'

const router = useRouter()
const userStore = useUserStore()
const isLoggingOut = ref(false)

const logout = () => {
  if (isLoggingOut.value) return
  isLoggingOut.value = true

  toast.loading('Logging out user...')

  setTimeout(() => {
    userStore.clearUser()
    toast.success('Logged out successfully 👋')
    router.push({ name: 'login' })
  }, 2000)
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors"
  >
    <div
      class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-sm text-center border border-gray-200 dark:border-gray-800 animate-fadeUp"
    >
      <div
        class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-mainColor to-red-500 flex items-center justify-center text-white text-2xl font-bold"
      >
        {{ userStore.userInfo?.first_name?.charAt(0)?.toUpperCase() || 'U' }}
      </div>

      <h2 class="text-xl font-semibold mb-2">
        {{ userStore.userInfo?.first_name || 'Guest User' }}
      </h2>
      <p class="text-sm mb-6 text-gray-600 dark:text-gray-400">
        You’re currently logged in. Click below to log out.
      </p>

      <button
        @click="logout"
        :disabled="isLoggingOut"
        class="w-full px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <LoadingAnime v-if="isLoggingOut" />
        <span class="text-sm font-medium text-white" v-if="!isLoggingOut">Log Out</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeUp {
  animation: fadeUp 0.5s ease-out;
}
</style>
