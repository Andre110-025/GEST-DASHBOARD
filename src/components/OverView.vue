<script setup lang="ts">
// import { useDarkMode } from '@/composables/useDarkMode'
import IconManSitting from './IconManSitting.vue'
import IconProfit from './IconProfit.vue'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import IconArrow from './IconArrow.vue'
import IconSales from './IconSales.vue'
import RevenueChartBar from './RevenueChartBar.vue'
import IconPaypal from './IconPaypal.vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import IconWallet from './IconWallet.vue'
import IconTransfer from './IconTransfer.vue'
import IconMasterCard from './IconMasterCard.vue'
import FilterGEST from './FilterGEST.vue'
import IconEdit from './IconEdit.vue'
import IconEye from './IconEye.vue'
import { useRouter } from 'vue-router'
import Pagination from './Pagination.vue'

const router = useRouter()

const viewDetails = (user: any) => {
  router.push({
    name: 'playlist',
    params: { id: user.id },
    query: { email: user.email },
  })
}

const percent = ref(36)
const statsData = ref(null)
const gestLoading = ref(false)
const searchString = ref('')
const allGEST = ref<any[]>([])
const currentPage = ref(1)
const totalItemsFromBackend = ref(0)

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  data: [],
})

const getAllGEST = async (selected: string = '', page: number = 1) => {
  gestLoading.value = true
  searchString.value = selected

  try {
    console.log('Fetching data for:', selected)
    // gestLoading.value = true

    // const response = await axios.get(`allofficerscode`, {
    //   params: { search: selected, page: page },
    // })
    const response = await axios.get('allofficerscode', {
      params: { search: selected, page },
    })

    // console.log(response)
    // allGEST.value = response.data.data.data || []
    // totalItemsFromBackend.value = response.data.data.total || 0
    const data = response.data.data
    // const pagination = response.data.data

    pagination.value = data
    allGEST.value = data.data || []
    currentPage.value = data.current_page
    // currentPage.value = page
  } catch (err) {
    console.log(err)
    allGEST.value = [] // Clear data on error to prevent stale display
    toast.error('Check Internet Connection')
  } finally {
    gestLoading.value = false
  }
}

const onClickHandler = (page: number) => {
  getAllGEST(searchString.value, page)
}

const handleFilterChange = async (selectedID: string) => {
  searchString.value = selectedID // Save it so pagination uses it later
  await getAllGEST(selectedID, 1)
}

watch(currentPage, (newPage) => {
  getAllGEST(searchString.value, newPage)
})

const isExpired = (dueDate: string) => {
  if (!dueDate) return false
  const now = new Date()
  const expiry = new Date(dueDate)
  return expiry < now
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
// const handleFilterChange = async (selectedID: string) => {
//   try {
//     gestLoading.value = true
//     allGEST.value = [] // Clear old data while loading

//     // Using your second endpoint for activity/details
//     const response = await axios.get('allofficerscode', {
//       params: { search: selectedID },
//     })

//     // Map the response to your ref
//     allGEST.value = response.data.data
//   } catch (err) {
//     console.error(err)
//     toast.error('Failed to load officer data')
//   } finally {
//     gestLoading.value = false
//   }

//   await getAllGEST(selectedID, 1)
// }

onMounted(() => {
  getAllGEST()
})
</script>

<template>
  <div
    class="w-full min-h-screen flex flex-col gap-5 p-4 pt-14 lg:pt-4 dark:bg-gray-900 overflow-x-hidden"
  >
    <header
      class="w-full flex flex-row items-center h-[190px] shadow bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div class="flex flex-col p-6 flex-1 gap-2">
        <h2 class="text-lg text-mainColor dark:text-amber-200 font-semibold mb-2">
          Welcome to GEST OFFICERS DASHBOARD 🎉
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          You have done <span>{{ percent }}%</span> more sales today.<br />
          Check your overall performance so far.
        </p>
        <button
          class="w-[160px] px-4 py-2 bg-mainColor text-white rounded-lg shadow hover:bg-teal-700 transition"
        >
          View Status
        </button>
      </div>
      <div class="hidden sm:flex ml-auto h-full items-end pr-4">
        <img src="/illustration-john-light-1Av6zeMt.png" class="h-[90%] object-contain" />
      </div>
    </header>

    <div
      class="w-full min-h-screen flex flex-col gap-5 p-4 pt-14 lg:pt-4 dark:bg-gray-900 overflow-x-hidden"
    >
      <section class="w-full flex justify-end relative z-[100]">
        <FilterGEST @update:selected="handleFilterChange" />
      </section>

      <section class="flex-1 w-full">
        <div class="block lg:hidden mt-5">
          <div v-if="gestLoading" class="space-y-4">
            <div
              v-for="n in 6"
              :key="n"
              class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 space-y-3 animate-pulse"
            >
              <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="user in allGEST"
              :key="user.id"
              class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm active:scale-[0.99] transition overflow-hidden"
            >
              <div
                class="p-4 border-b border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-x-4"
              >
                <div class="flex flex-col">
                  <span
                    class="text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wide font-bold"
                    >Name</span
                  >
                  <span class="font-semibold text-gray-900 dark:text-gray-100 truncate">{{
                    user.full_name
                  }}</span>
                </div>
                <div class="flex flex-col text-right">
                  <span
                    class="text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wide font-bold"
                    >Due Date</span
                  >
                  <span
                    v-if="user.subscription && user.subscription.next_due_date"
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ml-auto mt-1"
                    :class="
                      isExpired(user.subscription.next_due_date)
                        ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                    "
                  >
                    {{ isExpired(user.subscription.next_due_date) ? 'Expired: ' : '' }}
                    {{ formatDate(user.subscription.next_due_date) }}
                  </span>
                  <span v-else class="text-gray-400 italic text-[10px] mt-1">No Plan yet</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-x-4 gap-y-4 p-4 text-sm">
                <div class="flex flex-col">
                  <span class="text-gray-500 dark:text-gray-400 text-xs">Email</span>
                  <span
                    class="font-medium text-gray-800 dark:text-gray-200 break-all line-clamp-1"
                    >{{ user.email }}</span
                  >
                </div>
                <div class="flex flex-col text-right">
                  <span class="text-gray-500 dark:text-gray-400 text-xs">Phone</span>
                  <span class="font-medium text-gray-800 dark:text-gray-200">{{
                    user.phone_number
                  }}</span>
                </div>
                <div class="flex flex-col col-span-2">
                  <span class="text-gray-500 dark:text-gray-400 text-xs">Business Name</span>
                  <span class="font-medium text-gray-800 dark:text-gray-200 truncate">{{
                    user.business_name
                  }}</span>
                </div>
              </div>

              <div class="px-4 pb-4 flex justify-end">
                <button
                  @click="viewDetails(user)"
                  class="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <IconEye class="w-5 h-5 text-mainColor dark:text-amber-200" />
                </button>
              </div>
            </div>

            <div
              v-if="allGEST.length === 0"
              class="text-center py-10 text-sm text-gray-500 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700"
            >
              No records found. Please select a GEST-ID to filter.
            </div>
          </div>
        </div>

        <div class="hidden lg:block overflow-x-auto mt-5">
          <table class="min-w-full border-collapse text-sm">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <th class="text-left px-5 py-3 font-semibold">Name</th>
                <th class="text-left px-5 py-3 font-semibold">Email</th>
                <th class="text-left px-5 py-3 font-semibold">Phone</th>
                <th class="text-left px-5 py-3 font-semibold">Business Name</th>
                <th class="text-left px-5 py-3 font-semibold">Due Date</th>
                <th class="text-left px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody v-if="gestLoading">
              <tr
                v-for="n in 6"
                :key="n"
                class="bg-white dark:bg-gray-800 animate-pulse border-b border-gray-100 dark:border-gray-700"
              >
                <td class="px-5 py-4 flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td class="px-5 py-4">
                  <div class="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td class="px-5 py-4">
                  <div class="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td class="px-5 py-4">
                  <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td class="px-5 py-4">
                  <div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td class="px-5 py-4">
                  <div class="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr
                v-for="user in allGEST"
                :key="user.id"
                class="bg-white dark:bg-gray-800 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors animate-fadeUp"
              >
                <td class="px-5 py-4">
                  <span class="text-gray-800 dark:text-gray-100 font-medium">{{
                    user.full_name
                  }}</span>
                </td>
                <td class="px-5 py-4 text-gray-600 dark:text-gray-300">{{ user.email }}</td>
                <td class="px-5 py-4 text-gray-600 dark:text-gray-300">{{ user.phone_number }}</td>
                <td class="px-5 py-4 text-gray-600 dark:text-gray-300">{{ user.business_name }}</td>
                <td class="px-5 py-4">
                  <span
                    v-if="user.subscription && user.subscription.next_due_date"
                    class="px-3 py-1 rounded-full text-xs font-semibold"
                    :class="
                      isExpired(user.subscription.next_due_date)
                        ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                    "
                  >
                    {{ isExpired(user.subscription.next_due_date) ? 'Expired: ' : '' }}
                    {{ formatDate(user.subscription.next_due_date) }}
                  </span>
                  <span v-else class="text-gray-400 italic text-xs">No Plan yet</span>
                </td>
                <td class="px-5 py-4">
                  <button
                    @click="viewDetails(user)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <IconEye class="w-5 h-5 text-mainColor dark:text-amber-200" />
                  </button>
                </td>
              </tr>

              <tr v-if="allGEST.length === 0">
                <td colspan="6" class="px-5 py-10 text-center text-gray-400">
                  No records found. Please select a GEST-ID to filter.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- <div v-if="allGEST.length > 0" class="flex justify-center mt-6">
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
          v-if="allGEST.length > 0 && !gestLoading"
          :pagination="pagination"
          @page-changed="onClickHandler"
        />
      </section>
    </div>
  </div>
</template>
