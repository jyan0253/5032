<template>
  <div class="container py-4" style="max-width:480px;">
    <h2 class="text-center mb-3">Sign in</h2>

    <form @submit.prevent="signin">
      <div class="mb-3">
        <label class="form-label" for="email">Email</label>
        <input id="email" v-model.trim="email" type="email" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label" for="password">Password</label>
        <input id="password" v-model="password" type="password" class="form-control" required />
      </div>

      <button class="btn btn-primary w-100" type="submit" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        Sign in with Email
      </button>

      <div v-if="error" class="text-danger small mt-2">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { touchUserOnLogin } from '../services/userRepo'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const router = useRouter()
const route = useRoute()

async function signin () {
  error.value = ''
  loading.value = true
  try {
    const cred = await signInWithEmailAndPassword(getAuth(), email.value, password.value)
    await touchUserOnLogin(cred.user)
    router.push(route.query.redirect || '/about')
  } catch (e) {
    error.value = mapError(e)
  } finally {
    loading.value = false
  }
}

function mapError (e) {
  switch (e?.code) {
    case 'auth/invalid-email': return 'Invalid email format.'
    case 'auth/user-disabled': return 'This user is disabled.'
    case 'auth/user-not-found':
    case 'auth/wrong-password': return 'Incorrect email or password.'
    default: return 'Sign-in failed. Please try again.'
  }
}
</script>
