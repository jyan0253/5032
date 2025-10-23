<template>
  <ul class="nav nav-pills justify-content-center align-items-center">
    <li class="nav-item">
      <router-link to="/" class="nav-link" active-class="active">Home</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/about" class="nav-link" active-class="active">About</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/admin" class="nav-link" active-class="active">Admin</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/cloud" class="nav-link" active-class="active">Cloud Fn</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/WeatherCheck" class="nav-link" active-class="active">Get Weather</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/CountBookAPI" class="nav-link" active-class="active">CountBook API</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/GetAllBookAPI" class="nav-link" active-class="active">All Books API</router-link>
    </li>

    <li class="nav-item ms-2" v-if="isAuthenticated">
      <span class="badge bg-secondary">Role: {{ currentRole || '...' }}</span>
    </li>


    <li class="nav-item ms-3" v-if="!isAuthenticated">
      <router-link to="/login" class="btn btn-outline-primary btn-sm">Login</router-link>
      <router-link to="/register" class="btn btn-primary btn-sm ms-2">Register</router-link>
    </li>


    <li class="nav-item ms-3" v-else>
      <router-link to="/logout" class="btn btn-outline-secondary btn-sm">Logout</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/books/add" class="nav-link" active-class="active">Add Book</router-link>
    </li>

  </ul>
</template>

<script setup>
import { isAuthenticated, currentRole } from '../auth'
</script>
