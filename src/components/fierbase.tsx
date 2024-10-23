// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; // Import Firebase Authentication

const firebaseConfig = {
  apiKey: "AIzaSyAoxgQRsr-Xf5Ayb3lGL6R8N3qUQhAjigk",
  authDomain: "mystore-9951e.firebaseapp.com",
  projectId: "mystore-9951e",
  storageBucket: "mystore-9951e.appspot.com",
  messagingSenderId: "689075636656",
  appId: "1:689075636656:web:81d3157045168f8a636e75",
  measurementId: "G-9K92M0S1S2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Export Firestore, Storage, and Authentication instances
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app); // Initialize and export Firebase Authentication
