<script setup lang="ts">
import { computed, onMounted, ref, reactive } from 'vue'
import { useHelpers } from '../helper'
import { useVuelidate } from '@vuelidate/core'
import { useUserStore } from '../stores/user'
import { toast } from 'vue3-toastify'
import { RouterLink, useRouter } from 'vue-router'
import { required, email, minLength, helpers } from '@vuelidate/validators'
import axios from 'axios'
import IconEye from './IconEye.vue'
import IconHideEye from './IconHideEye.vue'
import LoadingAnime from './LoadingAnime.vue'

const loading = ref<boolean>(false)
const showPwd = ref<boolean>(false)
const router = useRouter()
const userStore = useUserStore()
const userData = ref(null)

type loginUser = {
  email: string
  password: string
}

const authData = reactive<loginUser>({
  email: '',
  password: '',
})

const rules = computed(() => ({
  email: { required, email },
  password: { required },
}))

const v$ = useVuelidate(rules, authData)

const submitLogin = async (): Promise<void> => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  try {
    loading.value = true

    const response = await axios.post('/api/v1/auth/login', authData)
    console.log(response)

    userData.value = response.data
    const token = response.data.token

    if (token) {
      userStore.setToken(token)
    }

    userStore.setUser(response.data.user)

    toast.success('Login successfully')
    setTimeout(() => {
      router.push({ name: 'overview' })
    }, 3000)
  } catch (error) {
    toast.error('Enter a valid Credential')
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex justify-end px-12 py-10">
    <RouterLink
      :to="{ name: 'signup' }"
      class="bg-mainColor w-[100px] h-[38px] flex items-center justify-center text-white font-semibold rounded-[20px] transition-all duration-300 hover:bg-mainColor hover:-translate-y-0.5 shadow-md hover:shadow-lg"
    >
      Sign Up
    </RouterLink>
  </div>

  <div class="flex flex-col justify-center mt-10 w-[500px] mx-auto text-center space-y-6">
    <div class="w-full text-left mb-4">
      <h2 class="text-[25px] font-semibold text-gray-800">Login</h2>
      <p class="text-sm text-gray-600">Log into your account to continue</p>
    </div>

    <form @submit.prevent="submitLogin" class="w-full space-y-4 mt-2.5">
      <div class="space-y-2">
        <label for="email" class="block text-sm font-medium text-gray-700 text-left"> Email </label>
        <input
          type="email"
          id="email"
          v-model="authData.email"
          class="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-black/80 focus:border-black outline-none transition-all duration-200 hover:bg-gray-100"
        />
      </div>

      <div class="space-y-2 relative">
        <label for="password" class="block text-sm font-medium text-gray-700 text-left">
          Password
        </label>
        <div class="relative">
          <input
            :type="showPwd ? 'text' : 'password'"
            id="password"
            v-model="authData.password"
            class="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-black/80 focus:border-black outline-none transition-all duration-200 hover:bg-gray-100"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition"
            @click="showPwd = !showPwd"
          >
            <IconEye v-if="!showPwd" />
            <IconHideEye v-else />
          </button>
        </div>
      </div>

      <button
        :disabled="loading || v$.$invalid"
        type="submit"
        class="w-full bg-mainColor text-white py-3 rounded-lg font-semibold shadow hover:bg-mainColor transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LoadingAnime v-if="loading" />
        <span class="text-sm font-medium text-white" v-if="!loading"> Login </span>
      </button>
    </form>
  </div>
</template>
