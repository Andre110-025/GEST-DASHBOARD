import { ref, onMounted, onUnmounted } from 'vue'

const deferredPrompt = ref(null)
const canInstall = ref(false)
const isInstalled = ref(false)

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('🚨 GLOBAL EVENT CAPTURED')
  e.preventDefault()
  deferredPrompt.value = e
  canInstall.value = true
})

window.addEventListener('appinstalled', () => {
  console.log('🚀 PWA was installed successfully')
  canInstall.value = false
  isInstalled.value = true
})

export function usePWAInstall() {
  const checkIfInstalled = () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isStandaloneIOS = window.navigator.standalone === true
    isInstalled.value = isStandalone || isStandaloneIOS
    return isInstalled.value
  }

  const installApp = async () => {
    if (!deferredPrompt.value) {
      showNativeInstructions()
      return
    }

    try {
      await deferredPrompt.value.prompt()
      const { outcome } = await deferredPrompt.value.userChoice
      if (outcome === 'accepted') {
        canInstall.value = false
        isInstalled.value = true
        deferredPrompt.value = null
      }
    } catch (error) {
      console.error('Install error:', error)
    }
  }

  const showNativeInstructions = () => {
    const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    if (isIOS) {
      alert('To install: Tap the "Share" icon (📤) and then "Add to Home Screen".')
    } else {
      alert('Tap the menu (⋮) and look for "Install app" or "Add to Home Screen".')
    }
  }

  onMounted(() => {
    checkIfInstalled()
    // We don't necessarily need to add the listener here anymore
    // because the global one above handles it for all components
  })

  // Return the GLOBAL refs
  return { canInstall, installApp, isInstalled }
}
