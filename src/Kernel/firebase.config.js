// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

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
const authInstance = getAuth(app);
const storageInstance = getStorage(app);

export { db, authInstance, storageInstance };
