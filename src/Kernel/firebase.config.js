// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyC31qtcgL32JRSBTeXxrMP3MfoGx4Yt4Rc',
  authDomain: 'josle5e.firebaseapp.com',
  databaseURL: 'https://josle5e-default-rtdb.firebaseio.com',
  projectId: 'josle5e',
  storageBucket: 'josle5e.firebasestorage.app',
  messagingSenderId: '143574372151',
  appId: '1:143574372151:web:3c26be32fe62bcc8b6d4b2',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
const db = getFirestore(app);

// ✅ Inicializar Auth de forma segura
let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  if (error.code === 'auth/already-initialized') {
    authInstance = getAuth(app);
  } else {
    throw error;
  }
}

const storageInstance = getStorage(app);

export { db, authInstance, storageInstance };