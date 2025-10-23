<template>
  <div class="container py-4" style="max-width:520px;">
    <h2 class="text-center mb-3">Add a Book</h2>

    <form @submit.prevent="save">
      <div class="mb-3">
        <label for="isbn" class="form-label">ISBN</label>
  
        <input id="isbn" v-model.number="isbn" type="number" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input id="name" v-model.trim="name" type="text" class="form-control" required />
      </div>

      <button class="btn btn-primary w-100" type="submit" :disabled="saving">
        <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
        Save
      </button>

      <p v-if="ok" class="text-success mt-2">{{ msg }}</p>
      <p v-else-if="msg" class="text-danger mt-2">{{ msg }}</p>
    </form>
    <hr class="my-4" />
    <BookList />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase' 
import BookList from '../components/BookList.vue' 

const isbn = ref(null)
const name = ref('')
const saving = ref(false)
const ok = ref(false)
const msg = ref('')

async function save () {
  msg.value = ''; ok.value = false; saving.value = true
  try {

    if (isbn.value === null || name.value.trim() === '') {
      msg.value = 'Both fields are required.'
      return
    }

    const docRef = await addDoc(collection(db, 'books'), {
      isbn: Number(isbn.value),     
      name: name.value.trim(),
      createdAt: serverTimestamp()
    })

    ok.value = true
    msg.value = `Saved ✔ (id: ${docRef.id})`
  
    isbn.value = null
    name.value = ''
  } catch (e) {
    console.error('Add book failed:', e)
    msg.value = 'Failed to save. See console for details.'
  } finally {
    saving.value = false
  }
}
</script>
