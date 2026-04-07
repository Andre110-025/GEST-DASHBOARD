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

const router = useRouter()
const userStore = useUserStore()
const loading = ref<boolean>(false)
const showPwd = ref<boolean>(false)
const userData = ref(null)

type User = {
  first_name: string
  last_name: string
  email: string
  password: string
}
const authData = reactive<User>({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
})
const { containsLowercase, containsUppercase, containsSpecial, containsNumber } = useHelpers()
const rules = computed(() => ({
  first_name: { required },
  last_name: { required },
  email: { required, email },
  password: {
    required,
    minLength: helpers.withMessage('Password must be at least 6 characters long', minLength(6)),
    containsUpperCase: helpers.withMessage('Password must include an uppercase', containsUppercase),
    containsLowerCase: helpers.withMessage('Password must include lowercase', containsLowercase),
    containsNumber: helpers.withMessage('Password must include numbers', containsNumber),
    containsSpecial: helpers.withMessage(
      'Password must include any of (#?!@$()`~%^&*-+=)',
      containsSpecial,
    ),
  },
}))
const v$ = useVuelidate(rules, authData)

const submitSignIn = async (): Promise<void> => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  try {
    loading.value = true

    const response = await axios.post('/api/v1/auth/signup', authData)
    console.log(response)

    userData.value = response.data

    userStore.setUser({ ...authData }) // push to my store lol

    toast.success('Account created successfully')
    setTimeout(() => {
      router.push({ name: 'overview' })
    }, 3000)
  } catch (error) {
    toast.error('An error was encountered')
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex justify-end px-12 py-10">
    <RouterLink
      :to="{ name: 'login' }"
      class="bg-mainColor w-[100px] h-[38px] flex items-center justify-center text-white font-semibold rounded-[20px] transition-all duration-300 hover:bg-mainColor hover:-translate-y-0.5 shadow-md hover:shadow-lg"
    >
      Login
    </RouterLink>
  </div>

  <div class="flex flex-col justify-center max-w-[600px] mx-auto text-center space-y-6">
    <div class="w-full text-left mb-4">
      <h2 class="text-[25px] font-semibold text-gray-800">Sign Up</h2>
      <p class="text-sm text-gray-600">Create your account to get started</p>
    </div>

    <form @submit.prevent="submitSignIn" class="w-full space-y-4 mt-2.5">
      <!-- Name Row -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1 space-y-2">
          <label class="block text-sm font-medium text-gray-700 text-left"> First Name </label>
          <input
            type="text"
            v-model="authData.first_name"
            class="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-black/80 focus:border-black outline-none transition-all duration-200 hover:bg-gray-100"
          />
        </div>

        <div class="flex-1 space-y-2">
          <label class="block text-sm font-medium text-gray-700 text-left"> Last Name </label>
          <input
            type="text"
            v-model="authData.last_name"
            class="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-black/80 focus:border-black outline-none transition-all duration-200 hover:bg-gray-100"
          />
        </div>
      </div>

      <!-- Email -->
      <div class="space-y-2">
        <label for="email" class="block text-sm font-medium text-gray-700 text-left"> Email </label>
        <input
          type="email"
          v-model="authData.email"
          id="email"
          @input="v$.email.$touch()"
          @blur="v$.email.$touch()"
          class="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-black/80 focus:border-black outline-none transition-all duration-200 hover:bg-gray-100"
        />
        <p v-if="v$.email.$error" class="text-xs text-red-500 text-start">
          {{ v$.email.$errors[0]?.$message }}
        </p>
      </div>

      <!-- Password -->
      <div class="space-y-2 relative">
        <label for="password" class="block text-sm font-medium text-gray-700 text-left">
          Password
        </label>
        <div class="relative">
          <input
            :type="showPwd ? 'text' : 'password'"
            v-model="authData.password"
            id="password"
            @input="v$.password.$touch()"
            @blur="v$.password.$touch()"
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

      <ul v-if="v$.password.$error" class="my-3 flex flex-col gap-1 text-xs text-start">
        <li v-for="(item, i) in v$.password.$errors" :key="i" class="text-red-500">
          {{ item.$message }}
        </li>
      </ul>

      <button
        :disabled="loading || v$.$invalid"
        type="submit"
        class="w-full bg-mainColor text-white py-3 rounded-lg font-semibold shadow hover:bg-mainColor transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LoadingAnime v-if="loading" />
        <span class="text-sm font-medium text-white" v-if="!loading"> Sign Up </span>
      </button>
    </form>
  </div>
</template>
