import { startGlitchSFX } from './audio.js';

let engine, scene, camera;
let cctvCameras = [];
let currentCamIdx = 0;

export function initHorrorGame(mapType) {
    const canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine);
    engine.setHardwareScalingLevel(1.6); // Optimasi HP Kentang

    // Gelap Gulita Atmosphere
    let light = new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.02;

    // Kamera Player Utama (Support PC & Touch Mobile)
    camera = new BABYLON.UniversalCamera("playerCam", new BABYLON.Vector3(0, 2, 0), scene);
    camera.attachControl(canvas, true);

    // Senter (Flashlight) nempel di kepala Pemain
    let flash = new BABYLON.SpotLight("spot", new BABYLON.Vector3(0,0,0), new BABYLON.Vector3(0,0,1), Math.PI/3, 2, scene);
    flash.intensity = 2.0;
    flash.parent = camera;

    // Build Tanah Map 150m x 150m
    let ground = BABYLON.MeshBuilder.CreateGround("floor", {width: 150, height: 150}, scene);
    let mat = new BABYLON.StandardMaterial("dark", scene);
    mat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    ground.material = mat;

    // Buat Titik CCTV Statis
    setupCctvNodes();

    engine.runRenderLoop(() => scene.render());
}

function setupCctvNodes() {
    const nodes = [new BABYLON.Vector3(15, 8, 15), new BABYLON.Vector3(-15, 6, -15), new BABYLON.Vector3(0, 10, 30)];
    nodes.forEach((pos, idx) => {
        let cam = new BABYLON.TargetCamera(`CAM_0${idx+1}`, pos, scene);
        cam.setTarget(BABYLON.Vector3.Zero());
        cctvCameras.push(cam);
    });
}

export function activateObserverCCTV() {
    document.getElementById("cctv-ui").classList.remove("hidden");
    scene.activeCamera = cctvCameras[currentCamIdx];
}

document.getElementById("btn-next-cam").addEventListener("click", () => {
    currentCamIdx = (currentCamIdx + 1) % cctvCameras.length;
    scene.activeCamera = cctvCameras[currentCamIdx];
    document.getElementById("cctv-cam-name").innerText = `CAM 0${currentCamIdx + 1}`;
});

// ANIMASI GLITCH TEKS DAN FLOW KETAKUTAN PLAYER (YOU ARE...)
export function triggerMatchPhase(mode) {
    const overlay = document.getElementById("glitch-overlay");
    const t1 = document.getElementById("glitch-text-1");
    const t2 = document.getElementById("glitch-text-2");
    const obj = document.getElementById("glitch-objective");

    overlay.classList.remove("hidden");
    t1.innerText = ""; t2.innerText = ""; obj.innerText = "";
    
    startGlitchSFX(); // Bunyi TV rusak lewat audio.js

    let str = "YOU ARE...";
    let idx = 0;
    let clock = setInterval(() => {
        t1.innerText += str[idx];
        idx++;
        if (idx >= str.length) {
            clearInterval(clock);
            setTimeout(() => {
                if (mode === "HIDING") { t2.innerText = "HIDE."; obj.innerText = "TIMER - 02:00"; }
                else if (mode === "SEEKING") { t2.innerText = "FIND ME."; obj.innerText = "OBJECTIVE: 0 / 3 FOUND"; }
                else { t2.innerText = "IT."; obj.innerText = "???"; }
                
                setTimeout(() => overlay.classList.add("hidden"), 3000);
            }, 1000);
        }
    }, 150);
}