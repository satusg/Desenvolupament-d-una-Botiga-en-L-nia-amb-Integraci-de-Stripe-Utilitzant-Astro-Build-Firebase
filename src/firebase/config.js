// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
export const clientOauth = await import('@/ClientOauth.json');
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCr4JVM1h9B8HS7sOYk6ebQyhkJOKwnPks",
  authDomain: "rare-citadel-428216-c5.firebaseapp.com",
  projectId: "rare-citadel-428216-c5",
  storageBucket: "rare-citadel-428216-c5.appspot.com",
  messagingSenderId: "764852390513",
  appId: "1:764852390513:web:dd3f30f2bbcbe210b1e9d0"
};

// Initialize Firebase
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(firebaseApp);