import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCK4wSHNBtqQdVKOtELkgL_qL0Pxc31ynQ",
  authDomain: "final-44f10.firebaseapp.com",
  projectId: "final-44f10",
  storageBucket: "final-44f10.firebasestorage.app",
  messagingSenderId: "42239191082",
  appId: "1:42239191082:web:3291a23a48de906c493b53"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }