
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore }  from "firebase-admin/firestore";
import { getFirestore }  from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDNFwrzG7zdAahHkYLwoVknTxTJQPYsru8",
    authDomain: "interview-prep-c48d7.firebaseapp.com",
    projectId: "interview-prep-c48d7",
    storageBucket: "interview-prep-c48d7.firebasestorage.app",
    messagingSenderId: "438090506205",
    appId: "1:438090506205:web:29e00ad2c9ad2fa8876034",
    measurementId: "G-VQS4EK04WB"
};

// Initialize Firebase
const app = !getApps().length ?  initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);