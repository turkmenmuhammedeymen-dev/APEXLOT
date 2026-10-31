import "./styles/base.css";
import { initializeParse } from "./services/parseClient";
import "./services/bootLegacyGame";

// Cloud services are optional for the offline single-player client.
// A Back4App configuration/network error must never leave the boot overlay stuck.
try {
  initializeParse();
} catch (error) {
  console.error("[APEXLOT] Back4App initialization failed; continuing offline.", error);
}
