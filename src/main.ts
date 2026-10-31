import "./styles/base.css";

declare global {
  interface Window { __apexlotFirstFrame?: boolean; }
}


import { initializeParse } from "./services/parseClient";

const boot = document.querySelector<HTMLElement>("#boot");
const status = document.querySelector<HTMLElement>("#boot-status");
let sceneReady = false;

// Cloud persistence is optional: a service outage must not block offline play.
try {
  initializeParse();
} catch (error) {
  console.warn("[APEXLOT] Cloud services unavailable; continuing offline.", error);
}

// Dynamic import lets this boundary catch syntax, module and WebGL startup failures.
try {
  await import("./services/bootLegacyGame");
  sceneReady = true;
} catch (error) {
  console.error("[APEXLOT] Game startup failed.", error);
  if (status) status.textContent = error instanceof Error && error.message.includes("WebGL 2")
    ? "3D GRAPHICS UNSUPPORTED · UPDATE YOUR INTEL GRAPHICS DRIVER OR USE A WEBGL 2 DEVICE"
    : "WORLD LOAD FAILED · RELOAD THE GAME";
  boot?.classList.add("boot-error");
  if (boot && !boot.querySelector("[data-boot-reload]")) {
    const reload = document.createElement("button");
    reload.type = "button";
    reload.dataset.bootReload = "true";
    reload.textContent = "RELOAD GAME";
    reload.style.cssText = "margin-top:8px;padding:12px 22px;border:1px solid #d8ff4f;background:#d8ff4f;color:#10150a;font:600 12px monospace;cursor:pointer";
    reload.addEventListener("click", () => window.location.reload());
    boot.append(reload);
  }
}

// The game runtime removes the overlay after its first rendered frame.
// If initialization never reaches that point, show a useful error instead of spinning forever.
window.setTimeout(() => {
  if (window.__apexlotFirstFrame) return;
  if (status) status.textContent = sceneReady
    ? "3D WORLD DID NOT RESPOND · CHECK DEVICE GRAPHICS AND RELOAD"
    : "GAME MODULE COULD NOT START · CHECK CONNECTION AND RELOAD";
  boot?.classList.add("boot-error");
  if (boot && !boot.querySelector("[data-boot-reload]")) {
    const reload = document.createElement("button");
    reload.type = "button";
    reload.dataset.bootReload = "true";
    reload.textContent = "RELOAD GAME";
    reload.style.cssText = "margin-top:8px;padding:12px 22px;border:1px solid #d8ff4f;background:#d8ff4f;color:#10150a;font:600 12px monospace;cursor:pointer";
    reload.addEventListener("click", () => window.location.reload());
    boot.append(reload);
  }
}, 12000);
