<script setup>
import { RouterView } from 'vue-router'
import LoadingTopBar from './components/LoadingTopBar.vue'
import { useLoadingStore } from './stores/loadingStore'
import { onMounted } from 'vue'
import { ModalsContainer } from 'vue-final-modal'

const loadingStore = useLoadingStore()

onMounted(() => {
  loadingStore.startLoading()

  setTimeout(() => {
    loadingStore.finishLoading()
  }, 5000)
})
</script>

<template>
  <LoadingTopBar color="#05716c" :height="3" />
  <div v-if="!loadingStore.isLoading">
    <RouterView />
  </div>
  <ModalsContainer />
</template>
