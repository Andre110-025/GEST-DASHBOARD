<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import IconCancel from './IconCancel.vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { computed, reactive, ref } from 'vue'
import { toast } from 'vue3-toastify'
import axios from 'axios'
import IconUpload from './IconUpload.vue'

const emit = defineEmits(['confirm'])

const customerData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  gender: '',
  profession: '',
  username: '',
  image: '',
})

const rules = computed(() => ({
  email: { email, required },
  firstName: { required },
  lastName: { required },
  gender: { required },
  profession: { required },
  username: { required },
  image: { required },
}))

const v$ = useVuelidate(rules, customerData)

// const handleUserAdded = (newUser: any[]) => {
//   users.value.unshift(newUser)
// }

const addNewUser = async (): Promise<void> => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  const payload = {
    firstName: customerData.firstName,
    lastName: customerData.lastName,
    email: customerData.email,
    username: customerData.username,
    image: customerData.image,
    profession: customerData.profession,
    gender: customerData.gender,
    company: {
      name: 'Freelancer',
      department: 'General',
      title: 'Staff',
      address: {
        address: '',
        city: '',
        coordinates: { lat: 0, lng: 0 },
        postalCode: '',
        state: '',
      },
    },
    phone: '',
    age: 20,
    birthDate: '2000-01-01',
    password: '12345678',
  }

  try {
    const response = await axios.post('https://dummyjson.com/users/add', payload)
    console.log(response)

    if (response.status == 201) {
      toast.success('User added Successful')
      emit('user-added', response.data)
      ;((customerData.firstName = ''),
        (customerData.lastName = ''),
        (customerData.email = ''),
        (customerData.gender = ''),
        (customerData.profession = ''),
        (customerData.username = ''))

      setTimeout(() => emit('confirm'), 3000)
    } else {
      toast.error('Error creating user')
    }
  } catch (err) {
    console.log(err)
    toast.error('Check Internet Connection...')
  }
}

const imagePreview = ref('')

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return

  // show preview
  imagePreview.value = URL.createObjectURL(file)

  // convert to Base64 so you can send it in JSON
  const reader = new FileReader()
  reader.onload = () => {
    customerData.image = reader.result // base64 string
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full items-center justify-center"
    content-class="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
    w-full max-w-[520px] rounded-2xl shadow-lg p-6"
    overlay-class="bg-black/50 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div>
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Add User</h2>
        <button
          @click="emit('confirm')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <IconCancel class="w-6 h-6" />
        </button>
      </div>

      <!-- Form -->
      <form class="flex flex-col gap-4" @submit.prevent="addNewUser">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Name</label>
          <div class="flex gap-3">
            <input
              v-model="customerData.firstName"
              type="text"
              placeholder="First name"
              class="w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor"
            />

            <input
              v-model="customerData.lastName"
              type="text"
              placeholder="Last name"
              class="w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Email</label>
          <input
            v-model="customerData.email"
            type="email"
            placeholder="Enter email address"
            class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">
            Upload Profile Picture
          </label>

          <label
            for="fileUpload"
            class="flex items-center justify-center w-full h-[120px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-mainColor transition"
          >
            <div class="text-center">
              <IconUpload class="mx-auto w-10 h-10 text-gray-400" />
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                <span class="font-medium text-mainColor">Click to upload</span> or drag & drop
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPEG (max 2MB)</p>
            </div>
          </label>

          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="hidden"
          />

          <div v-if="imagePreview" class="mt-3 flex justify-center">
            <img
              :src="imagePreview"
              alt="Preview"
              class="w-24 h-24 rounded-full object-cover border border-gray-300 dark:border-gray-700 shadow-sm"
            />
          </div>
        </div>

        <div class="flex gap-3">
          <div class="w-1/2">
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Gender</label>
            <input
              v-model="customerData.gender"
              type="text"
              placeholder="Enter gender"
              class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor"
            />
          </div>

          <div class="w-1/2">
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Profession</label>
            <input
              v-model="customerData.profession"
              type="text"
              placeholder="Enter profession"
              class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Username</label>
          <input
            v-model="customerData.username"
            type="text"
            placeholder="Enter username"
            class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor"
          />
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            @click="emit('confirm')"
            class="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            :disabled="v$.$invalid"
            type="submit"
            class="px-4 py-2 text-sm rounded-lg bg-mainColor text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>
