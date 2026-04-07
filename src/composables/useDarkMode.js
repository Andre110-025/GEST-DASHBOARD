import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  onMounted(() => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      isDark.value = saved === 'dark'
    }
    updateHtmlClass()
  })

  // this guy handles the switch login and also saves the preference to localStorage
  watch(isDark, () => {
    updateHtmlClass()
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  })

  const toggleDarkMode = (event) => {
    // 1. Instant fallback if not supported
    if (!document.startViewTransition) {
      isDark.value = !isDark.value
      return
    }

    // 2. Get the click position
    const x = event?.clientX ?? window.innerWidth
    const y = event?.clientY ?? 0

    // 3. Trigger the transition
    const transition = document.startViewTransition(() => {
      isDark.value = !isDark.value
    })

    // 4. Force the animation to be "Faster"
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          // Start as a tiny dot at your mouse, grow to cover everything
          clipPath: [`circle(0% at ${x}px ${y}px)`, `circle(150% at ${x}px ${y}px)`],
        },
        {
          duration: 400, // Lower this number (ms) to make it "faster"
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Snappier feel
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }

  // const toggleDarkMode = (event) => {
  //   // checks if the browser supports view transitions, if not it just toggles the dark mode without animation
  //   if (!document.startViewTransition) {
  //     isDark.value = !isDark.value
  //     return
  //   }

  //   // if it does support view transitions, it captures the click position to create a circular reveal effect from that point
  //   const x = event?.clientX ?? window.innerWidth
  //   const y = event?.clientY ?? 0

  //   // calculates the maximum distance from the click point to the corners of the viewport to determine the radius of the circular reveal
  //   const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  //   // start the transition
  //   const transition = document.startViewTransition(() => {
  //     isDark.value = !isDark.value
  //   })

  //   // run the drip/rush animation
  //   transition.ready.then(() => {
  //     const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]

  //     document.documentElement.animate(
  //       {
  //         clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
  //       },
  //       {
  //         duration: 500,
  //         easing: 'ease-in-out',
  //         pseudoElement: isDark.value
  //           ? '::view-transition-old(root)'
  //           : '::view-transition-new(root)',
  //       },
  //     )
  //   })
  // }

  const updateHtmlClass = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return { isDark, toggleDarkMode }
}
