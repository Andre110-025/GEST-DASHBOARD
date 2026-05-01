<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import IconNotFound from './IconNotFound.vue'
import Pagination from './Pagination.vue'

const route = useRoute()
const loading = ref(false)
const activities = ref<any[]>([])
const userName = ref('')
const email = ref('')
const currentPage = ref(1)
const totalItemsFromBackend = ref(0)
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  data: [],
})

const fetchOfficerActivities = async (page: number = 1) => {
  const userId = route.params.id
  email.value = String(route.query.email || '')

  // console.log(`ID: ${userId}, Email: ${email.value}`)

  loading.value = true

  try {
    const response = await axios.get(`allofficerscodeactivities/${userId}`, {
      params: { page: page },
    })

    // DRILL DOWN: root -> data -> data -> [...]
    const result = response.data.data
    pagination.value = result
    activities.value = result.data || []
    // totalItemsFromBackend.value = result.total || 0
    currentPage.value = result.current_page

    // Grab the name from the first activity record if it exists
    if (activities.value.length > 0) {
      userName.value = activities.value[0].name
    }
  } catch (err) {
    console.error('Error fetching activities:', err)
  } finally {
    loading.value = false
  }
}

const onClickHandler = (page: number) => {
  currentPage.value = page
  fetchOfficerActivities(page)
  // console.log('Navigating to page:', page)
}

const userInitials = computed(() => {
  if (!userName.value) return ''

  const names = userName.value.trim().split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }
  return names[0][0].toUpperCase()
})

onMounted(() => {
  fetchOfficerActivities()
})

watch(currentPage, (newPage) => {
  fetchOfficerActivities(newPage)
})
</script>

<template>
  <div class="p-6 dark:bg-gray-900 min-h-screen">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex flex-row gap-4 items-center">
        <div
          v-if="loading"
          class="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
        ></div>
        <div
          v-else-if="userName"
          class="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-mainColor to-teal-600 text-white font-bold text-xl shadow-lg border-2 border-white dark:border-gray-800 transition-transform hover:scale-105"
        >
          {{ userInitials }}
        </div>

        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Activity Log</h1>
          <div
            v-if="loading"
            class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"
          ></div>
          <p v-else-if="userName" class="text-mainColor dark:text-amber-200 font-medium text-sm">
            Name: {{ userName }}
          </p>
        </div>
      </div>

      <button
        @click="$router.back()"
        class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition shadow-sm w-fit"
      >
        <span>← Back to Dashboard</span>
      </button>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor mb-4"></div>
      <p class="text-gray-500">Loading activities...</p>
    </div>

    <div v-else>
      <div class="block lg:hidden space-y-4">
        <div v-if="activities.length > 0" class="space-y-4">
          <div
            v-for="log in activities"
            :key="log.id"
            class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 space-y-4 animate-fadeUp"
          >
            <div class="flex justify-between items-start">
              <div class="flex flex-col">
                <span
                  class="text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider font-bold"
                  >Action</span
                >
                <span class="font-bold text-gray-900 dark:text-gray-100">{{ log.action }}</span>
              </div>
              <span
                class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] uppercase font-bold rounded-md"
              >
                Success
              </span>
            </div>

            <div
              class="grid grid-cols-2 gap-4 text-sm border-t border-gray-50 dark:border-gray-700 pt-3"
            >
              <div class="flex flex-col">
                <span class="text-gray-500 dark:text-gray-400 text-xs">Date</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">
                  {{ new Date(log.created_at).toLocaleDateString() }}
                </span>
              </div>
              <div class="flex flex-col text-right">
                <span class="text-gray-500 dark:text-gray-400 text-xs">Time</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">
                  {{
                    new Date(log.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  }}
                </span>
              </div>
              <div class="flex flex-col col-span-2">
                <span class="text-gray-500 dark:text-gray-400 text-xs">Performed By</span>
                <span class="font-medium text-gray-800 dark:text-gray-200 truncate">{{
                  email
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="flex flex-col items-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
        >
          <div class="text-5xl mb-4"><IconNotFound /></div>
          <h3 class="text-gray-800 dark:text-white font-medium">No activity found</h3>
        </div>
      </div>

      <div
        class="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div v-if="activities.length > 0" class="overflow-x-auto animate-fadeUp">
          <table class="min-w-full text-sm">
            <thead>
              <tr
                class="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-600"
              >
                <th class="text-left px-6 py-4 font-semibold">Action</th>
                <th class="text-left px-6 py-4 font-semibold">Date</th>
                <th class="text-left px-6 py-4 font-semibold">Time</th>
                <th class="text-left px-6 py-4 font-semibold">Email</th>
                <th class="text-right px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
              <tr
                v-for="log in activities"
                :key="log.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td class="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">
                  {{ log.action }}
                </td>
                <td class="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {{ new Date(log.created_at).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {{
                    new Date(log.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  }}
                </td>
                <td class="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">
                  {{ email }}
                </td>
                <td class="px-6 py-4 text-right">
                  <span
                    class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-md"
                  >
                    Success
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="flex flex-col items-center py-20">
          <div class="text-5xl mb-4"><IconNotFound /></div>
          <h3 class="text-gray-800 dark:text-white font-medium">No activity found</h3>
          <p class="text-gray-500 text-sm">This user hasn't performed any actions yet.</p>
        </div>
      </div>
    </div>

    <!-- <div v-if="activities.length > 0" class="flex justify-center mt-6">
      <vue-awesome-paginate
        :total-items="totalItemsFromBackend"
        :items-per-page="10"
        :max-pages-shown="3"
        v-model="currentPage"
        :on-click="onClickHandler"
        pagination-container-class="flex items-center gap-2"
        paginate-buttons-class="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        active-button-class="bg-mainColor !text-white border-mainColor"
      />
    </div> -->

    <Pagination
      v-if="activities.length > 0 && !loading"
      :pagination="pagination"
      @page-changed="onClickHandler"
    />
  </div>
</template>
