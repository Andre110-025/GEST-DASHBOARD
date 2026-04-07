<script setup>
import { ref } from 'vue'
import Logo from '@/components/Logo.vue'
import IconDashboard from './IconDashboard.vue'
import IconUsers from './IconUsers.vue'
import IconTodo from './IconTodo.vue'
import IconBlog from './IconBlog.vue'
import IconWatchList from './IconWatchList.vue'
import IconMusic from './IconMusic.vue'
import IconSettings from './IconSettings.vue'
import IconProfile from './IconProfile.vue'

const isOpen = ref(false)
const toggleMenu = () => (isOpen.value = !isOpen.value)
const closeMenu = () => (isOpen.value = false)
</script>

<template>
  <!-- Hamburger button (mobile only) -->
  <button
    @click="toggleMenu"
    class="fixed top-3 left-3 z-[200] lg:hidden bg-mainColor text-white p-2 rounded-lg shadow-lg"
  >
    <svg
      v-if="!isOpen"
      xmlns="http://www.w3.org/2000/svg"
      class="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>

  <!-- Backdrop (mobile only) -->
  <div v-if="isOpen" @click="closeMenu" class="fixed inset-0 z-[100] bg-black/40 lg:hidden" />

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed bottom-0 left-0 top-0 z-[150] w-64 overflow-y-auto bg-mainColor dark:bg-gray-800 py-5 px-5 flex flex-col transition-transform duration-300',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <div class="flex items-center justify-center -mt-[20px]">
      <Logo class="w-[120px]" />
    </div>
    <div class="flex-1 space-y-3.5 overflow-y-auto py-5">
      <RouterLink :to="{ name: 'overview' }" class="dashBgNav text-white" @click="closeMenu">
        <IconDashboard />
        Home
      </RouterLink>
    </div>

    <div class="divide-y divide-gray-300">
      <p class="text-center text-white dark:text-white">GEST 2026</p>
    </div>
  </aside>
</template>
