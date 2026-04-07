<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import IconSearch from './IconSearch.vue'
import IconAdd from './IconAdd.vue'
import PopUpAddUser from './popUpAddUser.vue'
import { useModal } from 'vue-final-modal'
import IconEdit from './IconEdit.vue'
import IconDelete from './IconDelete.vue'
import { RouterLink } from 'vue-router'
// import PopUpAddUser from './popUpAddUser.vue'

const users = ref<any[]>([])
const loading = ref<boolean>(false)
const isFetching = ref<boolean>(false)
const limit = ref<number>(10)
const usersPerPage: number = 15
const allUsersFetched = ref<boolean>(false)

const getUsers = async () => {
  if (isFetching.value || allUsersFetched.value) return
  isFetching.value = true

  try {
    const response = await axios.get(`https://dummyjson.com/users?limit=${limit.value}`)
    console.log(response)

    if (response.status !== 200) {
      throw new Error('Failed to get users')
    }

    const allUsers = response.data.users
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (allUsers.length) {
      users.value.push(...allUsers.slice(0, usersPerPage))
      limit.value++
    } else {
      allUsersFetched.value = true
    }
  } catch (err) {
    console.log(err)
    toast.error('Check Internet Connection...')
  } finally {
    isFetching.value = false
    loading.value = false
  }
}

// Detect scroll to bottom
const handleScroll = () => {
  const scrollY = window.scrollY
  const viewportHeight = window.innerHeight
  const fullHeight = document.documentElement.scrollHeight

  if (scrollY + viewportHeight >= fullHeight * 0.9) {
    getUsers()
  }
}

onMounted(() => {
  loading.value = true
  getUsers()
  // window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const search = ref('')
const searchedUser = ref([])
const error = ref('')

const getSearchedUser = async () => {
  if (!search.value.trim()) {
    toast.warning('Invalid Input')
    return
  }

  try {
    loading.value = true
    searchedUser.value = []
    error.value = ''

    const response = await axios.get(`https://dummyjson.com/users/search?q=${search.value}`)
    console.log('You searched:', response)

    searchedUser.value = response.data.users

    if (!response.data.users.length) {
      error.value = 'No User Found!'
    }
  } catch (err) {
    console.error(err)
    toast.error('Check Internet Connection...')
  } finally {
    loading.value = false
  }
}

const openPopUp = () => {
  const { open, close } = useModal({
    component: PopUpAddUser,
    attrs: {
      onConfirm() {
        close()
      },

      onUserAdded(newUser: any[]) {
        users.value.unshift(newUser) // add new user to the top
        close()
      },
    },
  })

  open()
}
</script>

<template>
  <div class="w-full shadow bg-white dark:bg-gray-800 rounded-xl p-5">
    <h2 class="text-[20px]">All Users</h2>
    <div class="flex flex-row justify-between items-center">
      <div class="relative w-full max-w-sm mt-2.5">
        <IconSearch
          class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300"
        />

        <input
          v-model="search"
          @keyup.enter="getSearchedUser"
          type="search"
          placeholder="Search..."
          class="w-full pl-10 pr-3 py-2 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700 outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor"
        />
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="openPopUp()"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-mainColor rounded-lg hover:opacity-90 focus:ring-2 focus:ring-mainColor/50 outline-none transition-colors"
        >
          <IconAdd class="w-5 h-5" />
          Add User
        </button>
      </div>
    </div>

    <div v-if="loading" class="overflow-x-auto mt-5 animate-fadeUp">
      <table class="min-w-full border-collapse text-sm">
        <thead>
          <tr class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <th class="text-left px-5 py-3 font-semibold">Name</th>
            <th class="text-left px-5 py-3 font-semibold">Email</th>
            <th class="text-left px-5 py-3 font-semibold">Profession</th>
            <th class="text-left px-5 py-3 font-semibold">Username</th>
            <th class="text-left px-5 py-3 font-semibold">Status</th>
            <th class="text-left px-5 py-3 font-semibold">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="n in 6"
            :key="n"
            :class="[n % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900']"
            class="animate-pulse"
          >
            <td class="px-5 py-3 flex items-center gap-3">
              <div class="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              <div class="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </td>
            <td class="px-5 py-3">
              <div class="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </td>
            <td class="px-5 py-3">
              <div class="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </td>
            <td class="px-5 py-3">
              <div class="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </td>
            <td class="px-5 py-3">
              <div class="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            </td>
            <td class="px-5 py-3">
              <div class="flex flex-row gap-3">
                <div class="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div class="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="overflow-x-auto animate-fadeUp">
      <table class="min-w-full border-collapse text-sm mt-5">
        <thead>
          <tr class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <th class="text-left px-5 py-3 font-semibold">Name</th>
            <th class="text-left px-5 py-3 font-semibold">Email</th>
            <!-- <th class="text-left px-5 py-3 font-semibold">Gender</th> -->
            <th class="text-left px-5 py-3 font-semibold">Profession</th>
            <th class="text-left px-5 py-3 font-semibold">Username</th>
            <th class="text-left px-5 py-3 font-semibold">Status</th>
            <th class="text-left px-5 py-3 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in users"
            :key="user.email"
            :class="[index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900']"
          >
            <td class="px-5 py-3 flex items-center gap-3">
              <img
                :src="user.image"
                class="w-7 h-7 rounded-full object-cover border border-gray-200 dark:border-gray-600"
              />
              <span class="text-gray-800 dark:text-gray-100 font-medium">
                {{ user.name?.first || user.firstName }}
                {{ user.name?.last || user.lastName }}
              </span>
            </td>
            <td class="px-5 py-3 text-gray-600 dark:text-gray-300">
              {{ user.email }}
            </td>
            <td class="px-5 py-3 text-gray-600 dark:text-gray-300" v-if="false">
              {{ user.gender }}
            </td>
            <td class="px-5 py-3 text-gray-600 dark:text-gray-300">
              {{ user.company.title }}
            </td>
            <td class="px-5 py-3 text-gray-600 dark:text-gray-300">
              {{ user.username }}
            </td>
            <td class="px-5 py-3">
              <span
                :class="[
                  'text-xs font-medium px-3 py-1 rounded-full',
                  Math.random() > 0.5
                    ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100',
                ]"
              >
                {{ Math.random() > 0.5 ? 'Active' : 'Pending' }}
              </span>
            </td>
            <td class="px-5 py-3 text-gray-600 dark:text-gray-300">
              <div class="flex flex-row gap-2">
                <IconEdit class="mx-auto w-6 h-6 text-gray-700" />
                <IconDelete class="mx-auto w-6 h-6 text-gray-700" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="isFetching" class="flex justify-center items-center h-40">
        <div
          class="animate-spin rounded-full h-10 w-10 border-2 border-mainColor border-t-transparent"
        ></div>
      </div>

      <div v-if="allUsersFetched" class="flex justify-center py-6">
        <p class="text-mainColor text-lg font-semibold">You’ve reached the end of the list!</p>
      </div>
    </div>
  </div>
</template>
