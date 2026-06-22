import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// UBAH BAGIAN INI: Pakai getDatabase (Realtime), bukan getFirestore
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { createRoom, joinRoom } from './network.js';

const firebaseConfig = {
    apiKey: "AIzaSyB7KhV9F1jesWByPkXGvK0Bn2x-b5Y8aEg",
    authDomain: "playmate-horror-game.firebaseapp.com",
    projectId: "playmate-horror-game",
    storageBucket: "playmate-horror-game.firebasestorage.app",
    messagingSenderId: "943732511413",
    appId: "1:943732511413:web:da40a436eda1f586d924fc",
    measurementId: "G-NH0M054KSN",
    // Tambahkan URL database aslimu di sini
    databaseURL: "https://playmate-horror-game-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Inisialisasi Realtime Database
const db = getDatabase(app); 

export { db, auth };
