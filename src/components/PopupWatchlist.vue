<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import { toast } from 'vue3-toastify'

interface Movie {
  id: number
  title: string
  poster_path?: string
  release_date?: string
  vote_average?: number
  overview?: string
}

const movieWatchList = ref<Movie[]>([])

const loadWatchlist = () => {
  const savedMovie = localStorage.getItem('watch_list')
  movieWatchList.value = savedMovie ? JSON.parse(savedMovie) : []
  // so get array of saved movies, or set as empty arr
}

const removeMovie = (id: number) => {
  movieWatchList.value = movieWatchList.value.filter((m) => m.id !== id)
  // save em again
  localStorage.setItem('watch_list', JSON.stringify(movieWatchList.value))
  toast.success('Removed from watchlist ❌')
}

onMounted(() => {
  loadWatchlist()
})
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
    <div class="p-5 bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-lg w-full">
      <h2 class="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">🎥 My Watchlist</h2>

      <div v-if="!movieWatchList.length" class="text-center text-gray-500 dark:text-gray-400">
        No movies yet — add some 🍿
      </div>

      <div v-else class="space-y-3 max-h-[60vh] overflow-y-auto">
        <div
          v-for="movie in movieWatchList"
          :key="movie.id"
          class="flex items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-700 pb-2"
        >
          <div class="flex items-center gap-3">
            <img
              :src="`https://image.tmdb.org/t/p/w92${movie.poster_path}`"
              class="w-10 h-14 object-cover rounded"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {{ movie.title }}
            </span>
          </div>
          <button
            @click="removeMovie(movie.id)"
            class="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>
