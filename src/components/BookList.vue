<template>
  <div class="mt-4">
    <h2 class="mb-3">Books with ISBN &gt; {{ minIsbn }}</h2>


    <div class="row g-2 align-items-end mb-3">
      <div class="col-auto">
        <label class="form-label mb-1">Min ISBN</label>
        <input v-model.number="minIsbn" type="number" class="form-control" style="width: 140px" />
      </div>
      <div class="col-auto">
        <label class="form-label mb-1">Limit</label>
        <input v-model.number="limitN" type="number" class="form-control" style="width: 120px" />
      </div>
      <div class="col-auto">
        <button class="btn btn-outline-primary" @click="loadBooks" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
          Refresh
        </button>
      </div>
    </div>

    <ul>
      <li v-for="b in books" :key="b.id" class="mb-1">
    
        <div v-if="editingId !== b.id">
          <strong>{{ b.name }}</strong> - ISBN: {{ b.isbn }}
          <button class="btn btn-link btn-sm" @click="startEdit(b)">Edit</button>
          <button class="btn btn-link btn-sm text-danger" @click="remove(b)">Delete</button>
        </div>

   
        <div v-else class="d-flex gap-2 flex-wrap">
          <input v-model.trim="editName" class="form-control" style="max-width: 240px" />
          <input v-model.number="editIsbn" type="number" class="form-control" style="max-width: 140px" />
          <button class="btn btn-sm btn-success" @click="saveEdit(b)">Save</button>
          <button class="btn btn-sm btn-secondary" @click="cancelEdit">Cancel</button>
        </div>
      </li>
    </ul>

    <p v-if="!loading && books.length === 0" class="text-muted">No results.</p>
    <p v-if="error" class="text-danger">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  collection, query, where, orderBy, limit, getDocs,
  updateDoc, deleteDoc, doc
} from 'firebase/firestore'
import { db } from '../firebase'

const books   = ref([])
const loading = ref(false)
const error   = ref('')


const minIsbn = ref(1000)
const limitN  = ref(20)

async function loadBooks () {
  loading.value = true
  error.value = ''
  try {

    const q = query(
      collection(db, 'books'),
      where('isbn', '>', Number(minIsbn.value) || 0),
      orderBy('isbn', 'asc'),
      limit(Number(limitN.value) || 20)
    )
    const snap = await getDocs(q)
    books.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e) {
    console.error('Query failed:', e)
    error.value = 'Query failed. See console.'
  } finally {
    loading.value = false
  }
}


loadBooks()
watch([minIsbn, limitN], () => loadBooks())


const editingId = ref(null)
const editName  = ref('')
const editIsbn  = ref(null)

function startEdit (b) {
  editingId.value = b.id
  editName.value  = b.name || ''
  editIsbn.value  = b.isbn || null
}
function cancelEdit () {
  editingId.value = null
  editName.value  = ''
  editIsbn.value  = null
}
async function saveEdit (b) {
  try {
    await updateDoc(doc(db, 'books', b.id), {
      name: editName.value.trim(),
      isbn: Number(editIsbn.value)
    })

    b.name = editName.value.trim()
    b.isbn = Number(editIsbn.value)
    cancelEdit()
  } catch (e) {
    console.error('Update failed:', e)
    error.value = 'Update failed.'
  }
}


async function remove (b) {
  if (!confirm('Delete this book?')) return
  try {
    await deleteDoc(doc(db, 'books', b.id))
    books.value = books.value.filter(x => x.id !== b.id)
  } catch (e) {
    console.error('Delete failed:', e)
    error.value = 'Delete failed.'
  }
}
</script>
