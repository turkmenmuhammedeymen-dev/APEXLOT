import "./styles/base.css";
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
  if (status) status.textContent = "WORLD LOAD FAILED · CHECK CONNECTION AND RELOAD";
  boot?.classList.add("boot-error");
}

// The game runtime removes the overlay after its first rendered frame.
// If initialization never reaches that point, show a useful error instead of spinning forever.
window.setTimeout(() => {
  if (!sceneReady && status) status.textContent = "GAME MODULE COULD NOT START · RELOAD";
  if (sceneReady && boot && !boot.classList.contains("done") && status) {
    status.textContent = "WORLD INITIALIZATION IS TAKING TOO LONG · RELOAD";
    boot.classList.add("boot-error");
  }
}, 15000);
