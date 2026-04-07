<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const images = ref<string[]>([
  '/authviewImg.jpg',
  '/authView2.jpg',
  '/authviewImg3.jpg',
  '/authView-new2.jpg',
])

let slideId: number | undefined
const currentSlide = ref<number>(0)

const startSlide = (): void => {
  slideId = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % images.value.length
  }, 7000)
}

onMounted(() => {
  if (images.value.length > 0) startSlide()
})

onBeforeUnmount(() => {
  if (slideId) clearInterval(slideId)
})
</script>

<template>
  <main class="relative min-h-dvh h-dvh flex overflow-hidden">
    <div class="relative flex-1 min-h-full w-1/2 overflow-hidden">
      <Transition name="slide" mode="in-out">
        <div
          :key="images[currentSlide]"
          class="absolute inset-0 bg-cover bg-center"
          :style="{ backgroundImage: `url('${images[currentSlide]}')` }"
        >
          <div class="absolute inset-0 bg-black/40" />
        </div>
      </Transition>

      <div
        class="absolute inset-0 z-10 flex flex-col justify-between h-full px-12 py-10 text-white"
      >
        <div class="flex items-start">
          <div class="flex items-center space-x-3">
            <div class="bg-white rounded-full p-2 shadow-md">
              <img src="/logo.ico" alt="logo" class="w-6 h-6" />
            </div>
            <h2 class="text-2xl font-semibold tracking-wide text-white">Hub</h2>
          </div>
        </div>
        <div class="flex flex-col items-start justify-end w-[85%] pb-10">
          <h2 class="text-[32px] font-bold leading-tight">Your Dashboard</h2>
          <p class="mt-4 text-[15px] leading-relaxed opacity-90">
            Manage your tasks, monitor your progress, and access your important information quickly.
            Keep everything under control, see what's next on your agenda, and make every day
            productive.
          </p>
          <div class="flex gap-2 mt-8">
            <span
              v-for="(image, index) in images"
              :key="index"
              @click="currentSlide = index"
              class="w-[7px] h-[7px] rounded-full cursor-pointer transition-all duration-300"
              :class="[
                currentSlide === index ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/70',
              ]"
            ></span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col bg-white min-h-full">
      <RouterView />
    </div>
  </main>
</template>
