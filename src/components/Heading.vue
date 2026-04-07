<script setup>
import IconDarkMode from './IconDarkMode.vue'
import IconDarkNotification from './IconDarkNotification.vue'
import IconLightMode from './IconLightMode.vue'
import IconNotification from './IconNotification.vue'
import IconSearch from './IconSearch.vue'
import IconDownloadBtn from './IconDownloadBtn.vue'
import { ref, onMounted } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { usePWAInstall } from '@/composables/usePWAInstall'

const { isDark, toggleDarkMode } = useDarkMode()
const { canInstall, installApp, isInstalled } = usePWAInstall()

const showDownloadBtn = ref(false)

onMounted(() => {
  const isPWA = window.matchMedia('(display-mode: standalone)').matches

  if (!isPWA) {
    showDownloadBtn.value = true
  }
})

const checkIfInstalled = () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  // ...
  isInstalled.value = isStandalone || isStandaloneIOS
}
</script>

<template>
  <header
    class="h-[60px] flex flex-row justify-between items-center px-5 shadow bg-white dark:bg-gray-800 rounded-lg"
  >
    <!-- Search -->
    <div class="relative w-full max-w-md">
      <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <IconSearch class="w-5 h-5 text-gray-400" />
      </span>
      <input
        type="search"
        placeholder="Search..."
        class="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor dark:bg-gray-800 dark:text-white"
      />
    </div>

    <!-- Dark/Light Toggle -->
    <div class="flex flex-row items-center gap-1 sm:gap-2">
      <template v-if="!isInstalled && canInstall">
        <button
          @click="installApp"
          class="rounded-xl bg-mainColor text-white font-semibold shadow-md flex flex-row items-center justify-center px-3 py-2 transition-transform active:scale-95"
          title="Install the App"
        >
          <IconDownloadBtn class="w-5 h-5" />
        </button>
      </template>

      <button
        @click="toggleDarkMode($event)"
        class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
      >
        <component
          :is="isDark ? IconLightMode : IconDarkMode"
          class="w-6 h-6 text-mainColor dark:text-gray-200"
        />
      </button>

      <button
        class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
      >
        <component
          :is="isDark ? IconNotification : IconNotification"
          class="w-6 h-6 text-mainColor dark:text-gray-200"
        />
      </button>
    </div>
    <!-- <div class="flex flex-row items-center">
      <div>
        <div v-if="!isInstalled">
          <button
            v-if="canInstall"
            @click="installApp"
            class="rounded-xl bg-mainColor text-white font-semibold shadow-lg flex flex-row items-center gap-2 py-2 min-[450px]:py-3"
            title="Install the App"
          >
            <IconDownloadBtn />
          </button>
        </div>

        <div v-else>.</div>
      </div>
      <button
        @click="toggleDarkMode($event)"
        class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
      >
        <component
          :is="isDark ? IconLightMode : IconDarkMode"
          class="w-6 h-6 text-mainColor dark:text-gray-200"
        />
      </button>
      <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
        <component
          :is="isDark ? IconNotification : IconNotification"
          class="w-6 h-6 text-mainColor dark:text-gray-200"
        />
      </button>
    </div> -->
  </header>
</template>
