import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJSsupCgPYN1Vm4tUKwGbnM3H6hneoZQc",
  authDomain: "vyuuhatechnologies.firebaseapp.com",
  databaseURL: "https://vyuuhatechnologies-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vyuuhatechnologies",
  storageBucket: "vyuuhatechnologies.firebasestorage.app",
  messagingSenderId: "1015311029222",
  appId: "1:1015311029222:web:26462b2a0453bbaf5cbc27"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();