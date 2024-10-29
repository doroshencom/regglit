// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // Importación correcta de Firestore

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAdsdmaUQIDb-eQ3BPHmfw1g7aE8ycBays",
  authDomain: "regglit.firebaseapp.com",
  projectId: "regglit",
  storageBucket: "regglit.appspot.com",
  messagingSenderId: "1057680733970",
  appId: "1:1057680733970:web:f5276401c6ea579702e5cb",
  measurementId: "G-YZ621ZFQJG"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app); // Asegura que se está inicializando con `getFirestore`

export { db };
