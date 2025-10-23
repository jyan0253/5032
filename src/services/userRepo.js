import { db } from '../firebase'
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'


export async function upsertUserOnRegister(user, role = 'member') {
  if (!user) return
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email ?? null,
    role,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp()
  }, { merge: true })
}


export async function touchUserOnLogin(user) {
  if (!user) return
  await updateDoc(doc(db, 'users', user.uid), {
    lastLoginAt: serverTimestamp()
  })
}
