import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { createRoom, joinRoom } from './network.js';

// Menggunakan data konfigurasi proyek asli kamu
const firebaseConfig = {
    apiKey: "AIzaSyB7KhV9F1jesWByPkXGvK0Bn2x-b5Y8aEg",
    authDomain: "playmate-horror-game.firebaseapp.com",
    projectId: "playmate-horror-game",
    storageBucket: "playmate-horror-game.firebasestorage.app",
    messagingSenderId: "943732511413",
    appId: "1:943732511413:web:da40a436eda1f586d924fc",
    measurementId: "G-NH0M054KSN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginScreen = document.getElementById("login-screen");
const lobbyScreen = document.getElementById("lobby-screen");
const roomScreen = document.getElementById("room-screen");
const commandBox = document.getElementById("command-box");
const inputCommand = document.getElementById("input-command");
const btnMobileChat = document.getElementById("btn-mobile-chat");

// LOGIN GOOGLE ACTION
document.getElementById("btn-login-google").addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
        loginScreen.classList.remove("active");
        lobbyScreen.classList.add("active");
        document.getElementById("user-username").innerText = result.user.displayName;
        document.getElementById("user-avatar").src = result.user.photoURL;
    }).catch(err => console.error("Login Gagal:", err));
});

// EVENT BUTTON ROOM
document.getElementById("btn-create-room").addEventListener("click", async () => {
    const code = await createRoom();
    if (code) {
        lobbyScreen.classList.remove("active");
        roomScreen.classList.add("active");
        document.getElementById("room-id-display").innerText = code;
    }
});

document.getElementById("btn-join-room").addEventListener("click", async () => {
    const codeInput = document.getElementById("input-room-code").value.trim();
    if (!codeInput) return alert("Masukkan kode room!");
    const success = await joinRoom(codeInput);
    if (success) {
        lobbyScreen.classList.remove("active");
        roomScreen.classList.add("active");
        document.getElementById("room-id-display").innerText = codeInput.toUpperCase();
    }
});

// SISTEM COMMAND CHAT (PC: '/' | HP: Tombol UI)
window.addEventListener("keydown", (e) => {
    if (e.key === "/") { e.preventDefault(); bukaBox(); }
    if (e.key === "Escape") tutupBox();
});
if (btnMobileChat) btnMobileChat.addEventListener("click", bukaBox);

function bukaBox() { commandBox.classList.remove("hidden"); inputCommand.focus(); }
function tutupBox() { commandBox.classList.add("hidden"); inputCommand.value = ""; }

inputCommand.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && inputCommand.value.trim() !== "") {
        console.log("Command/Chat Terkirim: ", inputCommand.value);
        tutupBox();
    }
});

export { db, auth };