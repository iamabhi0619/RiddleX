//npm install firebase


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnp-C01njl9J004ocJBFForbdJUIxj0Xs",
  authDomain: "riddlex-ak.firebaseapp.com",
  projectId: "riddlex-ak",
  storageBucket: "riddlex-ak.firebasestorage.app",
  messagingSenderId: "535817263631",
  appId: "1:535817263631:web:a60d0248fb8d5194dd617a",
  measurementId: "G-FFJER29B44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


//npm install -g firebase-tools


//riddlex-ak.firebasestorage.app
