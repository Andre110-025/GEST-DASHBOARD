<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useModal } from 'vue-final-modal'
import { toast } from 'vue3-toastify'
import axios from 'axios'
import IconAddProduct from './IconAddProduct.vue'
import IconSearch from './IconSearch.vue'
import PopUpAddProduct from './popUpAddProduct.vue'

const products = ref<any[]>([])
const loading = ref<boolean>(false)
const isFetching = ref<boolean>(false)
const limit = ref<number>(10)
const productsPerPage: number = 12
const allProductsFetched = ref<boolean>(false)

const getProducts = async (): Promise<void> => {
  if (isFetching.value || allProductsFetched.value) return
  isFetching.value = true

  try {
    const response = await axios.get(`https://dummyjson.com/products?limit=${limit.value}`)
    console.log('Products are:', response)

    if (response.status !== 200) {
      throw new Error('Failed to get products')
    }

    const allProducts = response.data.products.sort(() => Math.random() - 0.5)
    await new Promise((resolve) => setTimeout(resolve, 3000))

    if (allProducts.length) {
      products.value.push(...allProducts.slice(0, productsPerPage))
      limit.value++
    } else {
      allProductsFetched.value = true
    }
  } catch (err) {
    console.error(err)
    toast.error('Check Internet Connection...')
  } finally {
    isFetching.value = false
    loading.value = false
  }
}

const handleScroll = () => {
  const scrollY = window.scrollY
  const viewportHeight = window.innerHeight
  const fullHeight = document.documentElement.scrollHeight

  if (scrollY + viewportHeight >= fullHeight * 0.9) {
    getProducts()
  }
}

onMounted(() => {
  loading.value = true
  getProducts()
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const search = ref('')
const searchedProduct = ref<any[]>([])
const error = ref('')

const getSearchedProduct = async () => {
  if (!search.value.trim()) {
    toast.warning('Invalid Input')
  }

  try {
    loading.value = true
    searchedProduct.value = []
    error.value = ''

    const response = await axios.get(`https://dummyjson.com/products/search?q=${search.value}`)
    console.log('You searched:', response)

    searchedProduct.value = response.data.products

    if (!searchedProduct.value.length) {
      error.value = 'No Product Found!'
    }
  } catch (err) {
    console.error(err)
    toast.error('Check Internet Connection...')
  } finally {
    loading.value = false
  }
}

const openPopUp = () => {
  const { open, close } = useModal({
    component: PopUpAddProduct,
    attrs: {
      onConfirm() {
        close()
      },

      onProductAdd(newProduct: any[]) {
        products.value.unshift(newProduct)
        close()
      },
    },
  })

  open()
}
</script>

<template>
  <div class="w-full shadow bg-white dark:bg-gray-800 rounded-xl p-5">
    <h2>Manage Products</h2>
    <div class="flex flex-row justify-between items-center">
      <div class="relative w-full max-w-sm mt-2.5">
        <IconSearch
          class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300"
        />

        <input
          v-model="search"
          @keyup.enter="getSearchedProduct"
          type="search"
          placeholder="Search..."
          class="w-full pl-10 pr-3 py-2 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700 outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor"
        />
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="openPopUp()"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-mainColor rounded-lg hover:opacity-90 focus:ring-2 focus:ring-mainColor/50 outline-none transition-colors"
        >
          <IconAddProduct class="w-5 h-5" />
          Add Product
        </button>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      <div
        v-for="n in 9"
        :key="n"
        class="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md relative shimmer-card"
      >
        <div class="w-full h-56 bg-gray-200 dark:bg-gray-800 shimmer"></div>
        <div class="p-5 space-y-4">
          <div class="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded shimmer"></div>
          <div class="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded shimmer"></div>

          <div class="flex items-center justify-between mt-4">
            <div class="h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded shimmer"></div>
            <div class="flex gap-1">
              <div
                v-for="n in 5"
                :key="n"
                class="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded shimmer"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p v-if="error" class="text-center text-red-500 mt-6 animate-fadeUp">
      {{ error }}
    </p>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      <div
        v-for="product in searchedProduct.length ? searchedProduct : products"
        :key="product.id"
        class="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-fadeUp"
      >
        <div class="relative">
          <img
            :src="product.thumbnail"
            :alt="product.title"
            class="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          <span
            class="absolute top-3 left-3 bg-mainColor/90 text-white text-[11px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full shadow-md"
          >
            -{{ product.discountPercentage }}%
          </span>

          <span
            class="absolute top-3 right-3 text-[11px] px-3 py-1 rounded-full font-semibold"
            :class="
              product.availabilityStatus === 'In Stock'
                ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
            "
          >
            {{ product.availabilityStatus }}
          </span>
        </div>

        <div class="p-5">
          <h3 class="text-base font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
            {{ product.title }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ product.brand }}
          </p>

          <div class="mt-4 flex justify-between items-center">
            <div>
              <p class="text-lg font-bold text-mainColor">${{ product.price }}</p>
            </div>

            <div class="flex items-center gap-1">
              <svg
                v-for="n in 5"
                :key="n"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                class="w-4 h-4"
                :class="
                  n <= Math.round(product.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-700'
                "
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.116 3.423a1 1 0 00.95.69h3.6c.969 0 1.371 1.24.588 1.81l-2.915 2.118a1 1 0 00-.364 1.118l1.115 3.423c.3.921-.755 1.688-1.54 1.118l-2.915-2.118a1 1 0 00-1.176 0l-2.915 2.118c-.784.57-1.838-.197-1.539-1.118l1.115-3.423a1 1 0 00-.364-1.118L2.795 8.85c-.783-.57-.38-1.81.588-1.81h3.6a1 1 0 00.95-.69l1.116-3.423z"
                />
              </svg>
              <span class="text-xs text-gray-500 ml-1">{{ product.rating.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isFetching" class="flex justify-center items-center h-40">
      <div
        class="animate-spin rounded-full h-10 w-10 border-2 border-mainColor border-t-transparent"
      ></div>
    </div>

    <div v-if="allProductsFetched" class="flex justify-center py-6">
      <p class="text-mainColor text-lg font-semibold">You’ve reached the end of the list!</p>
    </div>
  </div>
</template>
