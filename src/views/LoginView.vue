<template>
  <div class="container py-4" style="max-width:480px;">
    <h2 class="text-center mb-3">Login</h2>
    <form @submit.prevent="onSubmit">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model.trim="username" class="form-control" placeholder="admin" />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" placeholder="123456" />
      </div>
      <div v-if="error" class="text-danger mb-2">{{ error }}</div>
      <button class="btn btn-primary w-100" type="submit">Sign in</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '@/auth'

const route = useRoute()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')

function onSubmit() {
  error.value = ''
  if (login(username.value, password.value)) {
    // 登录成功：重定向到原来想去的页面（若存在）
    const redirect = route.query.redirect || '/about'
    router.push(redirect)
  } else {
    error.value = 'Invalid credentials'
  }
}
</script>
