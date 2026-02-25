import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDigIbvHcsKqXpKQKJKi5DQVJwd7B_66y0",
  authDomain: "islamic-app-5b22c.firebaseapp.com",
  projectId: "islamic-app-5b22c",
  storageBucket: "islamic-app-5b22c.firebasestorage.app",
  messagingSenderId: "593570968843",
  appId: "1:593570968843:web:10a923e0c7ad502f891e0e",
  measurementId: "G-RR62JFSS8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Export services
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
