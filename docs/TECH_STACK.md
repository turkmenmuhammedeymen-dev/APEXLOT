# APEXLOT technology architecture

## Active web runtime
- HTML5 and CSS3 provide the responsive HUD and menus.
- JavaScript remains the current gameplay module; TypeScript is the typed application/build layer.
- Three.js provides the 3D scene and rendering.
- GLSL shader sources are stored in src/shaders; they are not active until connected to a material.
- Blender is the authoring tool for original models exported as glTF 2.0.
- Parse/Back4App is optional cloud persistence. Public client keys are supplied through Vite environment variables. Never expose a Master Key.

## Online services
- Node.js and WebSocket are a separate realtime gateway scaffold. It rejects connections until signed-ticket verification is implemented.
- WebRTC voice transport is scaffolded; signaling, TURN, moderation and consent UX remain required.
- Server-authoritative simulation, anti-cheat, room lifecycle and multiplayer persistence are not implemented.

## Build
1. Run npm install.
2. Copy .env.example to .env.local and add only public Parse Application ID and JavaScript Key.
3. Run npm run dev for local development.
4. Run npm run build for TypeScript validation and production bundle.
5. Run npm run server to start the realtime gateway scaffold.

## Native engine decision
Unity/C# and Unreal/C++ are alternative future native clients, not dependencies of the browser build. Do not maintain two full engines in parallel. If selected later, share protocol/schema and original assets, not browser runtime code.