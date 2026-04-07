<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import IconChevronDown from './IconChevronDown.vue'
import { toast } from 'vue3-toastify'

const emit = defineEmits(['update:selected', 'update:search'])

const GEST = ref<any[]>([])
const selected = ref('') // current site selected
const showOptions = ref(false)
// const selectedSearch = ref(null)
const target = ref(null)

const toggleDropdown = () => (showOptions.value = !showOptions.value)
const select = (id: string) => {
  selected.value = id
  showOptions.value = false

  emit('update:selected', id)
}

const handleClickOutside = (e: MouseEvent) => {
  if (target.value && !target.value.contains(e.target as Node)) showOptions.value = false
}

const getGEST = async (): Promise<void> => {
  try {
    // loading.value = true
    // GEST.value = []

    const response = await axios.get('distinctoode')
    console.log(response)
    GEST.value = response.data.data
  } catch (err) {
    console.log(err)
    toast.error('Check Internet Connection')
  } finally {
    // loading.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  getGEST()
})
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="relative w-[250px]" ref="target">
    <button
      @click="toggleDropdown"
      class="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow text-sm font-medium dark:text-white transition-all active:scale-95"
    >
      <span class="truncate">{{ selected || 'Select GEST-ID' }}</span>
      <IconChevronDown
        :class="{ 'rotate-180': showOptions }"
        class="w-4 h-4 transition-transform duration-200"
      />
    </button>

    <div
      v-if="showOptions"
      class="absolute z-[9999] left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow max-h-60 overflow-y-auto"
    >
      <div
        v-for="(id, index) in GEST"
        :key="index"
        @click="select(id)"
        class="px-4 py-2 hover:bg-teal-50 dark:hover:bg-teal-900/30 cursor-pointer text-sm dark:text-gray-200 border-b last:border-0 border-gray-50 dark:border-gray-700"
      >
        {{ id }}
      </div>
    </div>
  </div>
</template>
