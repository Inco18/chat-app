import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "chat-app-b6731.firebaseapp.com",
  projectId: "chat-app-b6731",
  storageBucket: "chat-app-b6731.appspot.com",
  messagingSenderId: "1059547522703",
  appId: "1:1059547522703:web:76e06a24d4811c756eb2fa",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
