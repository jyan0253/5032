// src/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'


// 使用你项目的 Web 配置
const firebaseConfig = {
  apiKey: 'AIzaSyAmC1lMm4ong-7isSswAwosE5as-4j5d9Y',
  authDomain: 'fit5032-week6-ab58e.firebaseapp.com',
  projectId: 'fit5032-week6-ab58e',
  storageBucket: 'fit5032-week6-ab58e.firebasestorage.app',
  messagingSenderId: '701510955078',
  appId: '1:701510955078:web:9ddf4814dad514e6309a47',
}

// 只初始化一次
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// 导出 Auth
export const auth = getAuth(app)

// 导出 Firestore（更稳：网络受限时自动降级长轮询）
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false,
  // 如仍被公司网络拦截，可改为：
  // experimentalForceLongPolling: true,
})

