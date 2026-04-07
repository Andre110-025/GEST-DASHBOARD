<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import IconSearch from './IconSearch.vue'
import IconFavWatchList from './IconFavWatchList.vue'
import { useModal } from 'vue-final-modal'
import PopupWatchlist from './PopupWatchlist.vue'

const apiKey = '50a370a91e2223ab37cad6887ea2c296'
const baseUrl = 'https://api.themoviedb.org/3'

const movies = ref<Movie[]>([])
const watchlist = ref<Movie[]>([])
const loading = ref<boolean>(false)

interface Movie {
  id: number
  title: string
  poster_path?: string
  release_date?: string
  vote_average?: number
  overview?: string
}

const getMovies = async (count = 15) => {
  try {
    loading.value = true
    movies.value = []

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const response = await axios.get(
      `${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`,
    )

    if (response.status !== 200) throw new Error('Failed to get movies')

    movies.value = response.data.results.slice(0, count)
  } catch (error) {
    console.error(error)
    toast.error('Failed to fetch movies')
  } finally {
    loading.value = false
  }
}

const search = ref<string>('')
const searchedMovie = ref<any[]>([])
const error = ref<string>('')

const getSearchedMovie = async () => {
  if (!search.value) {
    toast.warning('Invalid Input ❌')
    return
  }

  try {
    loading.value = true
    searchedMovie.value = []
    error.value = ''

    const response = await axios.get(`${baseUrl}/search/movie`, {
      params: {
        api_key: apiKey,
        query: search.value,
      },
    })

    console.log('You searched:', response)

    if (response.status !== 200) {
      throw new Error('Failed to search movies')
    }

    searchedMovie.value = response.data.results

    if (response.data.results.length === 0) {
      error.value = '⚠️ No results found check for another movie'
    }
  } catch (err) {
    console.error(err)
    toast.error('Check Internet Connection...')
  } finally {
    loading.value = false
  }
}

const addToWatchlist = (movie: Movie) => {
  // check if an id is already there, not to add again
  if (watchlist.value.some((m) => m.id === movie.id)) {
    toast.info('Already in your watchlist')
    return
  }

  watchlist.value.push(movie)
  localStorage.setItem('watch_list', JSON.stringify(watchlist.value))
  toast.success('Added to watchlist')
}

const openPopUp = () => {
  const { open, close } = useModal({
    component: PopupWatchlist,
    attrs: {
      onConfirm() {
        close()
      },
      // movieWatchList: movies,
    },
  })

  open()
}

onMounted(() => {
  getMovies()
})
</script>

<template>
  <div
    class="w-full shadow bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 transition-colors"
  >
    <div class="flex items-center justify-between mb-5">
      <h2>Explore Movies</h2>
      <div class="flex items-center gap-2">
        <button
          @click="openPopUp()"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-mainColor rounded-lg hover:opacity-90 focus:ring-2 focus:ring-mainColor/50 outline-none transition-colors"
        >
          <IconFavWatchList class="w-5 h-5" />
          Your Watchlist
        </button>
      </div>
    </div>

    <div class="relative max-w-sm mb-6">
      <IconSearch
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-400"
      />
      <input
        v-model="search"
        @keyup.enter="getSearchedMovie"
        type="search"
        placeholder="Search for movies..."
        class="w-full pl-10 pr-3 py-2 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700 outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor"
      />
    </div>

    <div
      v-if="loading"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6 animate-fadeIn"
    >
      <div
        v-for="n in 10"
        :key="n"
        class="bg-gray-300 dark:bg-gray-800 rounded-xl animate-pulse overflow-hidden"
      >
        <div class="w-full h-[180px] sm:h-[240px] bg-gray-200 dark:bg-gray-700"></div>
        <div class="p-3 space-y-2">
          <div class="h-3 bg-gray-400 dark:bg-gray-600 rounded w-3/4"></div>
          <div class="h-3 bg-gray-400 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6 animate-fadeUp"
    >
      <div
        v-for="movie in searchedMovie.length ? searchedMovie : movies"
        :key="movie.id"
        class="group bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
      >
        <div class="relative h-[200px] sm:h-[260px] overflow-hidden">
          <img
            :src="`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`"
            :alt="movie.title"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div class="p-3">
          <h5 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
            {{ movie.title }}
          </h5>
          <p class="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5 truncate">
            Released: {{ new Date(movie.release_date).toLocaleDateString() }}
          </p>

          <div class="flex items-center justify-between mt-2">
            <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-300"
              >⭐ {{ movie.vote_average.toFixed(1) }}</span
            >
            <button
              @click="addToWatchlist(movie)"
              class="px-2.5 py-1 text-[11px] font-medium bg-mainColor text-white rounded-md hover:opacity-90 transition-all"
            >
              + Watchlist
            </button>
          </div>
        </div>
      </div>
    </div>

    <p class="text-[#911b1b] text-lg font-semibold text-center animate-fadeUp">
      {{ error }}
    </p>
  </div>
</template>
