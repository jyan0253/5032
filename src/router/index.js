import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import AdminView from '../views/AdminView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseSignupView from '../views/FirebaseSignupView.vue'
import LogoutView from '../views/LogoutView.vue'
import AddBookView from '../views/AddBookView.vue'
import CloudFnDemoView from '../views/CloudFnDemoView.vue'
import WeatherView from '../views/WeatherView.vue'
import CountBookAPIView from '../views/CountBookAPIView.vue'
import GetAllBookAPIView from '../views/GetAllBookAPIView.vue'

import { getAuth } from 'firebase/auth'
import { currentRole, authReady } from '../auth'

const routes = [
  { path: '/', name: 'home', component: HomeView },


  { path: '/about', name: 'about', component: AboutView, meta: { requiresAuth: true } },

 
  { path: '/admin', name: 'admin', component: AdminView, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/cloud', name: 'cloud', component: CloudFnDemoView, meta: { requiresAuth: true } },
  { path: '/CountBookAPI', name: 'CountBookAPI', component: CountBookAPIView, meta: { hideHeader: true } },
  { path: '/GetAllBookAPI', name: 'GetAllBookAPI', component: GetAllBookAPIView, meta: { hideHeader: true } },
  { path: '/WeatherCheck', name: 'GetWeather', component: WeatherView },
  { path: '/login', name: 'login', component: FirebaseSigninView },
  { path: '/register', name: 'register', component: FirebaseSignupView },
  { path: '/logout', name: 'logout', component: LogoutView, meta: { requiresAuth: true } },
  { path: '/books/add', name: 'addBook', component: AddBookView /*, meta: { requiresAuth: true } */ },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes })

router.beforeEach(async (to) => {
  await authReady 
  const user = getAuth().currentUser

  if (to.meta.requiresAuth && !user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.roles && Array.isArray(to.meta.roles)) {
    const role = currentRole.value
    if (!role || !to.meta.roles.includes(role)) {
      console.warn('[Auth] blocked by role check:', role, '=>', to.fullPath)
      return { name: 'home' } 
    }
  }
})

export default router
