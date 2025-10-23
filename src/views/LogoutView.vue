<template>
  <div class="container py-4" style="max-width:520px;">
    <h2 class="text-center mb-3">Log out</h2>

    <div class="card">
      <div class="card-body">
        <p class="mb-1"><strong>Current user:</strong> {{ email }}</p>
        <p class="mb-3"><strong>Role:</strong> {{ role || '(none)' }}</p>

        <button class="btn btn-outline-secondary w-100" @click="doLogout" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Sign out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { signOut, getAuth } from 'firebase/auth'
import { currentUser, currentRole } from '../auth'

const router = useRouter()
const loading = ref(false)
const email = computed(() => currentUser.value?.email ?? '(not signed in)')
const role  = computed(() => currentRole.value ?? null)

onMounted(() => {
  console.log('[Auth] Logout page loaded. Current:', {
    email: email.value, role: role.value, uid: currentUser.value?.uid
  })
})

async function doLogout() {
  loading.value = true
  try {
    await signOut(getAuth())
    console.log('[Auth] Signed out by user.')
    router.push('/login')
  } finally {
    loading.value = false
  }
}
</script>
