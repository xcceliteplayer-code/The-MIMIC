import { db, auth } from './app.js';
import { doc, setDoc, updateDoc, onSnapshot, getDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initHorrorGame, triggerMatchPhase } from './game3d.js';

let currentRoomId = null;

function generateRoomCode() {
    const chars = 'X8M4KP23456789ABCDEFGHJKLMNPQRST';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
}

export async function createRoom() {
    const user = auth.currentUser;
    if (!user) return;
    currentRoomId = generateRoomCode();
    const roomRef = doc(db, "rooms", currentRoomId);
    
    await setDoc(roomRef, {
        hostId: user.uid,
        status: "lobby",
        players: [{ uid: user.uid, username: user.displayName || "Ryzennn", avatar: user.photoURL || "", ready: true }]
    });
    listenRoom(currentRoomId);
    return currentRoomId;
}

export async function joinRoom(roomId) {
    const user = auth.currentUser;
    if (!user) return false;
    const roomRef = doc(db, "rooms", roomId.toUpperCase());
    const snap = await getDoc(roomRef);

    if (!snap.exists() || snap.data().players.length >= 10) {
        alert("Room Penuh atau Tidak Ada!");
        return false;
    }

    await updateDoc(roomRef, {
        players: arrayUnion({ uid: user.uid, username: user.displayName, avatar: user.photoURL, ready: false })
    });
    currentRoomId = roomId.toUpperCase();
    listenRoom(currentRoomId);
    return true;
}

function listenRoom(roomId) {
    onSnapshot(doc(db, "rooms", roomId), (snapshot) => {
        if (!snapshot.exists()) return;
        const data = snapshot.data();
        
        // Render UI Daftar Player Room
        const listDiv = document.getElementById("player-list");
        listDiv.innerHTML = "";
        data.players.forEach(p => {
            listDiv.innerHTML += `
                <div class="player-slot">
                    <img src="${p.avatar}" class="p-avatar">
                    <div><b>${p.username}</b><br>${p.ready ? '🟢 READY' : '🔴 WAITING'}</div>
                </div>`;
        });

        // Deteksi jika Host memulai game
        if (data.status === "ingame") {
            document.getElementById("room-screen").classList.remove("active");
            document.getElementById("game-container").classList.add("active");
            initHorrorGame("house"); // Mulai Map Default "The House"
            setTimeout(() => triggerMatchPhase("HIDING"), 2000); // Trigger Fase Ketakutan Awal
        }
    });
}

// Handler Tombol Start Game oleh Host Room
document.getElementById("btn-start-game").addEventListener("click", async () => {
    if (currentRoomId) {
        await updateDoc(doc(db, "rooms", currentRoomId), { status: "ingame" });
    }
});