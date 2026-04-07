<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useUserStore } from '../stores/user'
import axios from 'axios'
import IconSearch from './IconSearch.vue'
import IconAddPost from './IconAddPost.vue'
import { useModal } from 'vue-final-modal'
import PopupCreatePost from './PopupCreatePost.vue'
import IconNoPost from './IconNoPost.vue'

const post = ref<any[]>([])
const loading = ref<boolean>(false)
const id = ref<string>('68ff9971f918c85a0f24cb8c')
const userStore = useUserStore()

const getUserPost = async (): Promise<void> => {
  try {
    loading.value = true
    post.value = []

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const response = await axios.get(`/api/v1/posts/user/me`)
    console.log(response)

    post.value = response.data.posts || []
  } catch (err) {
    console.error(err)
    toast.error('Re-login to view blog')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getUserPost()
})

const openPopUp = () => {
  const { open, close } = useModal({
    component: PopupCreatePost,
    attrs: {
      onConfirm() {
        close()
      },
    },
  })

  open()
}
</script>

<template>
  <div class="w-full shadow bg-white dark:bg-gray-800 rounded-xl p-5">
    <div class="flex flex-row justify-between items-center mb-5">
      <h2>Stories by You</h2>
      <!-- <div class="relative w-full max-w-sm">
        <IconSearch
          class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300"
        />
        <input
          type="search"
          placeholder="Search..."
          class="w-full pl-10 pr-3 py-2 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700 outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor"
        />
      </div> -->

      <div class="flex items-center gap-2">
        <button
          @click="openPopUp()"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-mainColor rounded-lg hover:opacity-90 focus:ring-2 focus:ring-mainColor/50 outline-none transition-colors"
        >
          <IconAddPost class="w-5 h-5" />
          Create Post
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 animate-fadeUp"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm relative"
      >
        <div class="h-40 w-full bg-gray-200 dark:bg-gray-800 shimmer"></div>

        <div class="p-5 space-y-3">
          <div class="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded shimmer"></div>

          <div class="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded shimmer"></div>

          <div class="space-y-2 mt-3">
            <div class="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded shimmer"></div>
            <div class="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded shimmer"></div>
            <div class="h-4 w-4/6 bg-gray-300 dark:bg-gray-700 rounded shimmer"></div>
          </div>

          <div class="flex flex-wrap gap-2 mt-4">
            <div
              v-for="t in 3"
              :key="t"
              class="h-5 w-14 bg-gray-300 dark:bg-gray-700 rounded-md shimmer"
            ></div>
          </div>

          <div
            class="mt-5 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3"
          >
            <div class="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded shimmer"></div>
            <div class="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded shimmer"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 animate-fadeUp">
      <div
        v-for="item in post"
        :key="item.id"
        class="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      >
        <!-- Optional image -->
        <div class="h-40 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <img
            v-if="item.image"
            :src="item.image"
            alt="Blog cover"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div class="p-5 flex flex-col h-full">
          <!-- Title -->
          <h3
            class="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-mainColor transition-colors"
          >
            {{ item.title }}
          </h3>

          <!-- Description -->
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3 italic">
            {{ item.description }}
          </p>

          <!-- Body with inline read more -->
          <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
            <span v-if="!item.showFull">
              {{ item.body.slice(0, 150) }}
              <span v-if="item.body.length > 150">... </span>
              <button
                v-if="item.body.length > 150"
                @click="item.showFull = true"
                class="text-mainColor font-medium hover:underline inline-block"
              >
                Read more
              </button>
            </span>

            <span v-else>
              {{ item.body }}
              <button
                @click="item.showFull = false"
                class="text-mainColor font-medium hover:underline inline-block ml-1"
              >
                Show less
              </button>
            </span>
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in item.tags"
              :key="tag"
              class="px-2 py-1 text-xs rounded-md bg-mainColor/10 text-mainColor font-medium"
            >
              #{{ tag }}
            </span>
          </div>

          <!-- Footer -->
          <div
            class="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3"
          >
            <span>🕒 {{ item.reading_time }} min read</span>
            <span>{{ new Date(item.createdAt).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!loading && post.length === 0"
      class="flex flex-col items-center justify-center h-56 text-center"
    >
      <div class="relative mb-4">
        <div class="absolute inset-0 rounded-full bg-mainColor/20 animate-ping"></div>
        <IconNoPost />
      </div>

      <p class="text-gray-600 dark:text-gray-300 font-medium mb-1">No posts have been added yet</p>
      <p class="text-gray-400 dark:text-gray-500 text-sm mb-4">
        Create your first post to get started
      </p>

      <button
        @click="openPopUp()"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-mainColor rounded-lg hover:opacity-90 focus:ring-2 focus:ring-mainColor/50 outline-none transition-colors"
      >
        <IconAddPost class="w-5 h-5" />
        Add New Post
      </button>
    </div>
  </div>
</template>
