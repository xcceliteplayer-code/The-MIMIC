let aiVoiceMemory = [];

const tvGlitchSound = new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav'], // Audio statis gratis internet
    volume: 0.4,
    loop: true
});

export function startGlitchSFX() {
    tvGlitchSound.play();
    setTimeout(() => tvGlitchSound.stop(), 4000);
}

// LOGIKA PROXIMITY VOICE CHAT (15m = 100% | 30m = 50% | 50m = 0%)
export function calcProximityVolume(distance) {
    if (distance <= 15) return 1.0;
    if (distance > 15 && distance <= 30) return 1.0 - ((distance - 15) / 15) * 0.5;
    if (distance > 30 && distance <= 50) return 0.5 - ((distance - 30) / 20) * 0.5;
    return 0.0;
}

// LOGIKA REKAM TEXT / SUARA PEMAIN UNTUK FITUR UTAMA PLAYMATE AI VOICE MIMIC
export function savePlayerMimicText(text) {
    aiVoiceMemory.push(text);
    if (aiVoiceMemory.length > 20) aiVoiceMemory.shift(); // Batasi cache memori agar ram tidak jebol
}

export function playmateSpeakMimic() {
    if (aiVoiceMemory.length === 0) return "Aku di basement...";
    const randomRecall = aiVoiceMemory[Math.floor(Math.random() * aiVoiceMemory.length)];
    console.log(`[PLAYMATE AI BERAKSI]: Menirukan suara palsu di area lain: "${randomRecall}..."`);
    return randomRecall;
}