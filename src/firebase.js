import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  query,
  setDoc,
  getDocs,
  collection,
  addDoc,
  where,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEXif6bmBF9y6-PyRZO1sJT3ZoB9g4CzI",
  authDomain: "card2business.firebaseapp.com",
  projectId: "card2business",
  storageBucket: "card2business.appspot.com",
  messagingSenderId: "1057466957786",
  appId: "1:1057466957786:web:4b470b94ab40b25a944ae3",
  measurementId: "G-XS0N0FPLP6",
};

// Initialize Firebase app with error handling
let app, db, storage, auth, analytics;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);

  // Initialize Analytics only if window is defined (for browser environments)
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    analytics = getAnalytics(app);
  } else {
    console.warn(
      "Firebase Analytics not initialized: window or document not defined."
    );
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Exporting all necessary Firebase services and Firestore methods
export {
  db,
  storage,
  auth,
  analytics,
  collection,
  setDoc,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
};
