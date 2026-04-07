import './assets/main.css'
import 'vue3-toastify/dist/index.css'
import 'vue-final-modal/style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVfm } from 'vue-final-modal'
import { useUserStore } from './stores/user'
import axios from 'axios'
import VueAwesomePaginate from 'vue-awesome-paginate'
import 'vue-awesome-paginate/dist/style.css'

import App from './App.vue'
import router from './router'
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

const app = createApp(App)
const pinia = createPinia()
const vfm = createVfm()

app.use(VueAwesomePaginate)
app.use(pinia)
app.use(router)
app.use(vfm)

// ✅ initAuth before mounting
const userStore = useUserStore()
userStore.initAuth()

app.mount('#app')
