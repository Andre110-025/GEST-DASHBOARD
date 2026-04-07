<script setup>
import Heading from '@/components/Heading.vue'
import SideBar from '@/components/sideBar.vue'
import InternetConnection from '../components/InternetConnection.vue'
import { RouterView } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isBrowserOnline = ref(navigator.onLine)

const checkNetwork = () => {
  isBrowserOnline.value = navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', checkNetwork)
  window.addEventListener('offline', checkNetwork)
})

onBeforeUnmount(() => {
  window.removeEventListener('online', checkNetwork)
  window.removeEventListener('offline', checkNetwork)
})

const reloadPage = () => {
  checkNetwork()

  if (isBrowserOnline.value) {
    location.reload()
  }
}
</script>

<template>
  <div class="flex min-h-[100dvh]">
    <SideBar />

    <div class="flex-1 flex flex-col lg:ml-64 bg-gray-100 dark:bg-gray-900 min-w-0">
      <div class="m-3 space-y-5">
        <div class="pl-14 lg:pl-0">
          <Heading />
        </div>

        <main class="flex-1 overflow-y-auto contentArea">
          <InternetConnection v-if="!isBrowserOnline" :reloadPage="reloadPage" />

          <div v-else>
            <RouterView />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
