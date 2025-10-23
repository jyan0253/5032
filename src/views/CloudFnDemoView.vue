<template>
  <div class="container py-4" style="max-width:560px;">
    <h2 class="text-center mb-3">Cloud Function (HTTP)</h2>

    <!-- Add Book -->
    <h4 class="mb-2">Add Book via Function</h4>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label" for="isbn">ISBN</label>
        <input id="isbn" v-model.number="isbn" type="number"
               class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label" for="name">Name</label>
        <input id="name" v-model.trim="name" type="text"
               class="form-control" required />
      </div>
      <button class="btn btn-primary w-100" :disabled="loadingAdd">
        <span v-if="loadingAdd"
              class="spinner-border spinner-border-sm me-2"></span>
        Send to Cloud Function
      </button>
    </form>

    <div class="mt-2" v-if="msg">
      <div :class="ok ? 'text-success' : 'text-danger'">{{ msg }}</div>
      <pre v-if="payload" class="bg-light p-2 rounded small mt-2">
{{ payload }}
      </pre>
    </div>

    <hr class="my-4" />

    <!-- Book Counter -->
    <div class="text-center">
      <h2 class="display-6 mb-3">Book Counter</h2>
      <button class="btn btn-secondary mb-2"
              @click="getCount" :disabled="loadingCount">
        <span v-if="loadingCount"
              class="spinner-border spinner-border-sm me-2"></span>
        Get Book Count
      </button>
      <div class="lead">
        Total number of books: {{ count ?? '-' }}
      </div>
      <div v-if="errCount" class="text-danger small mt-2">
        {{ errCount }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ENDPOINT_ADD =
  'https://us-central1-fit5032-week6-ab58e.cloudfunctions.net/httpAddBook'
const ENDPOINT_COUNT =
  'https://us-central1-fit5032-week6-ab58e.cloudfunctions.net/countBooks'

const isbn = ref(null)
const name = ref('')

const loadingAdd = ref(false)
const ok = ref(false)
const msg = ref('')
const payload = ref('')

async function submit () {
  msg.value = ''
  payload.value = ''
  ok.value = false
  loadingAdd.value = true
  try {
    const body = { isbn: Number(isbn.value), name: name.value.trim() }
    const res = await fetch(ENDPOINT_ADD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    ok.value = res.ok && data.ok === true
    msg.value = ok.value
      ? `Success ✔ Saved as: ${data.saved.name} (ISBN: ${data.saved.isbn})`
      : `Failed: ${data.error || res.statusText}`
    payload.value = JSON.stringify(data, null, 2)
    if (ok.value) { isbn.value = null; name.value = '' }
  } catch (e) {
    msg.value = e?.message || 'Call failed'
  } finally {
    loadingAdd.value = false
  }
}

// —— Counter  —— //
const count = ref(null)
const loadingCount = ref(false)
const errCount = ref('')

async function getCount () {
  loadingCount.value = true
  errCount.value = ''
  try {
    const res = await fetch(ENDPOINT_COUNT, { method: 'GET' })
    const data = await res.json()
    if (!res.ok || data.ok !== true) {
      throw new Error(data.error || res.statusText)
    }
    count.value = data.count
  } catch (e) {
    errCount.value = e?.message || 'Failed to get count'
  } finally {
    loadingCount.value = false
  }
}
</script>
