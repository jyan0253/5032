import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import { installAuthConsoleLogger } from './auth'

installAuthConsoleLogger('[Auth]') // 控制台打印当前用户与角色
createApp(App).use(router).mount('#app')
