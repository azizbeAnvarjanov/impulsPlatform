import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqfNS4jPUN8KklhP7oC_ZNeoJLSmWzr24",
  authDomain: "ta-minot.firebaseapp.com",
  projectId: "ta-minot",
  storageBucket: "ta-minot.firebasestorage.app",
  messagingSenderId: "990415642175",
  appId: "1:990415642175:web:717ac45e1773d25bd1628a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
