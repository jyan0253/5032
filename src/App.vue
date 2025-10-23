<template>
  <header
    v-if="showHeader()"
    class="py-3 border-bottom bg-light"
  >
    <div class="container text-center">
      <BHeader />
    </div>
  </header>

  <main class="app-container text-center">
    <router-view />
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router'
import BHeader from './components/BHeader.vue'

const route = useRoute()

function showHeader () {
  return route.meta?.hideHeader !== true
}
</script>

<style>
:root {
  --page-max: 900px;
}

.app-container {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 2rem 1rem;
}
</style>
