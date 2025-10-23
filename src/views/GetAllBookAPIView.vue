<template>
  <section class="container py-4 text-start" style="max-width: 720px;">
    <h1 class="mb-3">Get All Book API</h1>
    <p class="text-muted">
      All books returned by the Cloud Function are displayed as JSON.
    </p>
    <router-link to="/" class="btn btn-outline-secondary btn-sm mb-3">
      Back to application
    </router-link>

    <div v-if="loading" class="alert alert-info" role="alert">
      Loading books&hellip;
    </div>
    <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <pre v-else class="bg-dark text-light p-3 rounded small">
{{ formattedResponse }}
    </pre>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

const ENDPOINT_ALL =
  'https://us-central1-fit5032-week6-ab58e.cloudfunctions.net/getAllBooks'

const loading = ref(true)
const errorMessage = ref('')
const apiPayload = ref(null)

async function loadAllBooks () {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await axios.get(ENDPOINT_ALL)
    apiPayload.value = response.data
  } catch (error) {
    console.error('Error fetching books:', error)
    errorMessage.value =
      error?.response?.data?.error ||
      error?.message ||
      'Failed to load books'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAllBooks()
})

const formattedResponse = computed(() =>
  apiPayload.value ? JSON.stringify(apiPayload.value, null, 2) : ''
)
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>

