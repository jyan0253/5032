import { ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export const isAuthenticated = ref(false)
export const currentUser = ref(null)
export const currentRole = ref(null)

// 路由等待首次鉴权完成，避免首帧误判
let _resolveOnce
export const authReady = new Promise((resolve) => { _resolveOnce = resolve })
let _inited = false

export function installAuthConsoleLogger(prefix = '[Auth]') {
  return onAuthStateChanged(auth, async (user) => {
    try {
      currentUser.value = user
      isAuthenticated.value = !!user

      if (!user) {
        currentRole.value = null
        console.log(`${prefix} SIGNED OUT`)
        if (!_inited) { _inited = true; _resolveOnce?.() }
        return
      }

      try {
        const snap = await getDoc(doc(db, 'users', user.uid))
        currentRole.value = snap.exists() ? (snap.data().role ?? 'member') : 'member'
      } catch (e) {
        console.error(`${prefix} Firestore user fetch failed:`, e)
        currentRole.value = 'member'
      } finally {
        console.log(`${prefix} SIGNED IN`, {
          uid: user.uid, email: user.email, role: currentRole.value
        })
        if (!_inited) { _inited = true; _resolveOnce?.() }
      }
    } catch (e) {
      console.error(`${prefix} auth state handler failed:`, e)
      if (!_inited) { _inited = true; _resolveOnce?.() }
    }
  })
}
