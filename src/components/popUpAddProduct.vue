<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { computed, reactive, ref } from 'vue'
import { toast } from 'vue3-toastify'
import axios from 'axios'
import IconCancel from './IconCancel.vue'
import IconUpload from './IconUpload.vue'

const emit = defineEmits(['confirm'])

type product = {
  image: string
  discountPercentage: Number
  availabilityStatus: string
  title: string
  brand: string
  price: Number
}

const productData = reactive<product>({
  image: '',
  discountPercentage: 0,
  availabilityStatus: '',
  title: '',
  brand: '',
  price: 0,
})

const rules = computed(() => ({
  image: { required },
  discountPercentage: { required },
  availabilityStatus: { required },
  title: { required },
  brand: { required },
  price: { required },
}))

const v$ = useVuelidate(rules, productData)

const addNewProduct = async (): Promise<void> => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  const payload = {
    image: productData.image,
    discountPercentage: productData.discountPercentage,
    availabilityStatus: productData.availabilityStatus,
    title: productData.title,
    brand: productData.brand,
    price: productData.price,
    category: 'electronics',
    description:
      'The AeroSmart Pro Smartwatch combines style and functionality. Track your fitness, monitor heart rate, and stay connected with notifications — all in a sleek, waterproof design.',
    dimensions: { width: 8.2, height: 10.5, depth: 1.3 },
    id: 101,
    images: [
      'https://cdn.dummyjson.com/product-images/electronics/smartwatch/1.webp',
      'https://cdn.dummyjson.com/product-images/electronics/smartwatch/2.webp',
    ],
    meta: {
      createdAt: '2025-02-15T10:45:00.000Z',
      updatedAt: '2025-03-10T08:30:00.000Z',
      barcode: '8237450198271',
      qrCode: 'https://cdn.dummyjson.com/public/qr-code.png',
    },
    minimumOrderQuantity: 10,
    rating: 4.3,
    returnPolicy: '30-day return policy',
    shippingInformation: 'Ships in 2-4 business days',
    sku: 'ELE-AER-SMA-101',
    stock: 120,
    tags: ['smartwatch', 'electronics', 'wearable'],
    thumbnail: 'https://cdn.dummyjson.com/product-images/electronics/smartwatch/thumbnail.webp',
    warrantyInformation: '1 year warranty',
    weight: 0.35,
  }

  try {
    const response = await axios.post('https://dummyjson.com/products/add', payload)
    console.log(response)

    if (response.status == 201) {
      toast.success('Product added Successful')
      emit('productAdd', response.data)

      setTimeout(() => {
        emit('confirm')
      }, 3000)
    } else {
      toast.error('Error adding product')
    }
  } catch (err) {
    console.log(err)
    toast.error('Check Internet Connection...')
  }
}

const imagePreview = ref('')

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return

  // show preview
  imagePreview.value = URL.createObjectURL(file)

  // convert to Base64 so you can send it in JSON
  const reader = new FileReader()
  reader.onload = () => {
    productData.image = reader.result // base64 string
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full items-center justify-center"
    content-class="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
    w-full max-w-[520px] rounded-2xl shadow-lg p-6"
    overlay-class="bg-black/50 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div>
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Add Product</h2>
        <button
          @click="emit('confirm')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <IconCancel class="w-6 h-6" />
        </button>
      </div>

      <!-- Form -->
      <form class="flex flex-col gap-4" @submit.prevent="addNewProduct">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Product Title</label>
          <input
            v-model="productData.title"
            type="text"
            placeholder="Enter product title"
            class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor"
          />
        </div>

        <div class="flex gap-3">
          <div class="w-1/2">
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Brand</label>
            <input
              v-model="productData.brand"
              type="text"
              placeholder="Enter brand name"
              class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor"
            />
          </div>

          <div class="w-1/2">
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Availability</label>
            <select
              v-model="productData.availabilityStatus"
              class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor"
            >
              <option disabled value="">Select status</option>
              <option>In Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3">
          <div class="w-1/2">
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Price ($)</label>
            <input
              v-model="productData.price"
              type="number"
              step="0.01"
              placeholder="Enter price"
              class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor"
            />
          </div>

          <div class="w-1/2">
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Discount (%)</label>
            <input
              v-model="productData.discountPercentage"
              type="number"
              step="0.01"
              placeholder="Enter discount"
              class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-mainColor focus:border-mainColor"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">
            Upload Product Image
          </label>

          <label
            for="fileUpload"
            class="flex items-center justify-center w-full h-[120px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-mainColor transition"
          >
            <div class="text-center">
              <IconUpload class="mx-auto w-10 h-10 text-gray-400" />
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                <span class="font-medium text-mainColor">Click to upload</span> or drag & drop
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPEG (max 2MB)</p>
            </div>
          </label>

          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="hidden"
          />

          <div v-if="imagePreview" class="mt-3 flex justify-center">
            <img
              :src="imagePreview"
              alt="Preview"
              class="w-24 h-24 rounded-xl object-cover border border-gray-300 dark:border-gray-700 shadow-sm"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            @click="emit('confirm')"
            class="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            :disabled="v$.$invalid"
            type="submit"
            class="px-4 py-2 text-sm rounded-lg bg-mainColor text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>
