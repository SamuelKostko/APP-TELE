// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQYQSCER62zcEbbbGqUiEWwTtvYyskLaQ",
  authDomain: "pizarra-tv.firebaseapp.com",
  projectId: "pizarra-tv",
  storageBucket: "pizarra-tv.firebasestorage.app",
  messagingSenderId: "786036060916",
  appId: "1:786036060916:web:35520c5f9081d0661ea4a1",
  measurementId: "G-260NWFNZR1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
