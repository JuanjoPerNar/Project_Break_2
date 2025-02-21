// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDw0XFpM3q0Em-JiUrPqXf_3zZPmqEyos8",
  authDomain: "tiendaderopa-b4ef0.firebaseapp.com",
  projectId: "tiendaderopa-b4ef0",
  storageBucket: "tiendaderopa-b4ef0.firebasestorage.app",
  messagingSenderId: "294785417120",
  appId: "1:294785417120:web:58ba94fe388e4a6d8e2ec5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = { app }