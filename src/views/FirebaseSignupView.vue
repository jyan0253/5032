<template>
  <div class="container py-4" style="max-width:480px;">
    <h2 class="text-center mb-3">Create account</h2>

    <form @submit.prevent="signup">
      <div class="mb-3">
        <label class="form-label" for="email">Email</label>
        <input id="email" v-model.trim="email" type="email" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label" for="password">Password</label>
        <input id="password" v-model="password" type="password" class="form-control" required />
        <div class="form-text">At least 6 characters.</div>
      </div>

      <div class="mb-3">
        <label class="form-label" for="confirm">Confirm password</label>
        <input id="confirm" v-model="confirm" type="password" class="form-control" required />
        <div v-if="mismatch" class="text-danger small mt-1">Passwords do not match.</div>
      </div>

      <button class="btn btn-primary w-100" type="submit" :disabled="loading || mismatch">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        Create account
      </button>

      <div v-if="error" class="text-danger small mt-2">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { upsertUserOnRegister } from '../services/userRepo'

const email = ref('')
const password = ref('')
const confirm = ref('')
const loading = ref(false)
const error = ref('')
const mismatch = computed(() => password.value && confirm.value && password.value !== confirm.value)

const router = useRouter()
const route = useRoute()

async function signup () {
  if (mismatch.value) return
  error.value = ''
  loading.value = true
  try {
    const cred = await createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    await upsertUserOnRegister(cred.user, 'member') // 默认 member
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
    case 'auth/email-already-in-use': return 'This email is already in use.'
    case 'auth/weak-password': return 'Password should be at least 6 characters.'
    default: return 'Registration failed. Please try again.'
  }
}
</script>
