// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrzDgvicYzxHQi3ZDEv9K6gS62hF3BV-I",
  authDomain: "chatpdf-2a47d.firebaseapp.com",
  projectId: "chatpdf-2a47d",
  storageBucket: "chatpdf-2a47d.firebasestorage.app",
  messagingSenderId: "249821316098",
  appId: "1:249821316098:web:b9ce7e04bf2243e483531b",
  measurementId: "G-SY889YQYN3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// BEFORE
export { storage } 