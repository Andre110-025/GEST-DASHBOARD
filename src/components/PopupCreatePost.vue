<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { toast } from 'vue3-toastify'
import axios from 'axios'
import LoadingAnime from './LoadingAnime.vue'

const emit = defineEmits(['confirm'])
const loading = ref<boolean>(false)

type blog = {
  title: string
  description: string
  tags: string
  body: string
}

const blogData = reactive<blog>({
  title: '',
  description: '',
  tags: '',
  body: '',
})

const rules = computed(() => ({
  title: { required },
  description: { required },
  tags: { required },
  body: { required },
}))

const v$ = useVuelidate(rules, blogData)

const createBlog = async (): Promise<void> => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  const payload = {
    ...blogData,
    tags: blogData.tags.split(',').map((tag) => tag.trim()),
  }

  try {
    loading.value = true

    const response = await axios.post('/api/v1/posts', payload)
    console.log(response)

    if (response.status == 201) {
      toast.success('Blog created successfully')

      setTimeout(() => {
        emit('confirm')
      }, 3000)
    } else {
      toast.error('Error creating post')
    }
  } catch (err) {
    console.log(err)
    toast.error('Check Internet Connection...')
  } finally {
    loading.value = false
  }
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
    <div class="space-y-3">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center">
        Create New Blog Post
      </h2>

      <form class="flex flex-col gap-4" @submit.prevent="createBlog">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Title</label
          >
          <input
            v-model="blogData.title"
            type="text"
            placeholder="Enter blog title"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Description</label
          >
          <textarea
            v-model="blogData.description"
            rows="2"
            placeholder="Short description about the post"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Tags</label
          >
          <input
            v-model="blogData.tags"
            type="text"
            placeholder="e.g. subheading, point, webdev (comma separated)"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Content</label
          >
          <textarea
            v-model="blogData.body"
            rows="6"
            placeholder="Write your blog content here..."
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3 pt-3">
          <button
            @click="emit('confirm')"
            class="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            type="button"
          >
            Cancel
          </button>
          <button
            :disabled="v$.$invalid || loading"
            class="px-4 py-2 text-sm rounded-lg bg-mainColor text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            <LoadingAnime v-if="loading" />
            <span class="text-sm font-medium text-white" v-if="!loading">Publish</span>
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>
