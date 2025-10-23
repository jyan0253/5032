<template>
  <section class="container py-4 text-start" style="max-width: 720px;">
    <h1 class="mb-3">Count Book API</h1>
    <p class="text-muted">
      Response returned from the Cloud Function is shown below as JSON.
    </p>
    <router-link to="/" class="btn btn-outline-secondary btn-sm mb-3">
      Back to application
    </router-link>

    <div v-if="loading" class="alert alert-info" role="alert">
      Loading latest book count&hellip;
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

const ENDPOINT_COUNT =
  'https://us-central1-fit5032-week6-ab58e.cloudfunctions.net/countBooks'

const loading = ref(true)
const errorMessage = ref('')
const apiPayload = ref(null)

async function getBookCountAPI () {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await axios.get(ENDPOINT_COUNT)
    apiPayload.value = response.data
  } catch (error) {
    const axiosError = error?.response?.data?.error
    errorMessage.value = axiosError || error?.message || 'Failed to load API data'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getBookCountAPI()
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
