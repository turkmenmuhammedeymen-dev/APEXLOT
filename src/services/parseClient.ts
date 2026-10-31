import Parse from "parse";
const appId=import.meta.env.VITE_PARSE_APPLICATION_ID as string|undefined;
const jsKey=import.meta.env.VITE_PARSE_JAVASCRIPT_KEY as string|undefined;
const serverURL=(import.meta.env.VITE_PARSE_SERVER_URL as string|undefined)||"https://parseapi.back4app.com";
let ready=false;
export function initializeParse():boolean{if(ready)return true;if(!appId||!jsKey){console.info("[APEXLOT] Back4App is not configured; offline mode is available.");return false;}Parse.initialize(appId,jsKey);Parse.serverURL=serverURL;ready=true;return true;}
export function parseReady():boolean{return ready;}
export {Parse};