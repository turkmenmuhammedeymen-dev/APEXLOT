# APEXLOT
**Drive Beyond** — özgün açık dünya sürüş, park ve otomobil yaşamı simülasyonu.

> APEXLOT, Car Parking Multiplayer gibi oyunların tür ve özellik kapsamını inceleyen; kendi kodu, dünyası, araçları, sesleri, görselleri ve kullanıcı arayüzüyle geliştirilen bağımsız bir projedir. Başka bir oyunun özel kaynak kodu veya korunan varlıkları kullanılmaz.

## Şu an depoda
- Three.js tabanlı tarayıcıda çalışan 3D şehir prototipi
- Özgün blok şehir, yollar, sokak lambaları ve servis istasyonu
- Sürüş: WASD / ok tuşları, fren, mobil dokunmatik kontroller
- Takip kamerası ve hız göstergesi
- Harita, garaj, etkinlikler, profil ve ayarlar panelleri
- Back4App Cloud Code başlangıç dosyası: `cloud/main.js`

## Çalıştırma
ES modülleri ve Three.js CDN kullandığı için bir statik HTTP sunucusu üzerinden aç:
- GitHub Pages: Settings → Pages → Deploy from a branch → `main` / `root`
- Yerel: herhangi bir statik dosya sunucusu ile depo kökünü yayınla.
- İnternet bağlantısı Three.js modülünü CDN'den yüklemek için gerekir.

## Back4App
1. Back4App uygulamasında Cloud Code bölümüne `cloud/main.js` dosyasını yükle.
2. Deploy et.
3. `ApexlotProfile` ve `ApexlotGarage` sınıflarını oluştur veya ilk çağrıda oluşturulmalarına izin ver.
4. Her iki sınıfta da istemci tarafı erişimini kapat; kayıtlar yalnızca Cloud Code üzerinden, kullanıcı ACL'siyle yönetilsin.
5. Master Key'i hiçbir zaman istemciye koyma.
6. `apexlotHealth`, `apexlotGetProfile`, `apexlotGetGarage`, `apexlotSaveGarage` fonksiyonlarını oturum açmış kullanıcıyla test et.

## Geliştirme yol haritası
1. Temel sürüş ve araç fiziği
2. Bölge tabanlı açık dünya ve iç mekânlar
3. Görevler: park, inşaat hassas parkuru, süreli sürüş, sürüş akademisi
4. Araç kataloğu, özgün modeller, motor/şanzıman/süspansiyon ve görsel modifiye
5. Karakter, yaya dolaşımı, animasyonlar ve fotoğraf/drone modu
6. Hesap, bulut kayıt, arkadaşlar, odalar, metin/ses iletişimi ve yarış
7. Oyuncu haritası editörü, yayınlama, puanlama ve moderasyon
8. Optimizasyon, erişilebilirlik, mobil kontroller ve güvenlik

## Durum
Bu depo ilk oynanabilir web prototipidir; tam ölçekli mobil/PC oyunu, gerçek çok oyunculu sunucu, tamamlanmış harita/araç kataloğu veya üretim seviyesi fizik motoru değildir. Her özellik gerçek uygulaması ve testleri tamamlandıkça bu belge güncellenecektir.


## Technology foundation (v0.2)

The project now has a Vite + TypeScript build layer while preserving the existing JavaScript/Three.js prototype as the first playable scene.

- Three.js is installed through npm and bundled by Vite (no runtime CDN dependency).
- Parse/Back4App client initialization reads public credentials from Vite environment variables. Configure them from .env.example; never add a Master Key to browser code.
- GLSL vehicle shader source is under src/shaders. It is a shader foundation, not yet attached to a production vehicle material.
- Blender-authored original assets should be exported as glTF 2.0; see assets/README.md.
- Node.js/WebSocket gateway and WebRTC voice transport scaffolds are present. They are not production multiplayer/voice services; authentication, signaling, TURN, moderation, authoritative simulation and load testing remain.
- Native Unity/C# and Unreal/C++ are documented as alternative future clients, not mixed into the web runtime.

### Build commands
- npm install
- npm run dev
- npm run build
- npm run server

Copy .env.example to .env.local and configure only public Parse Application ID and JavaScript Key when connecting Back4App.


## Sunshore City driving update

The current scene has been upgraded with a bright daytime environment, a larger boulevard grid, planted streets, original procedural high-rise blocks, villas and manor-style properties. A luxury long-wheelbase APEXLOT sedan prototype now has exterior body details and a visible cabin layout.

### Driving and interaction
- Arrow keys / WASD: steering and throttle/reverse.
- Space: brake.
- C or the camera button: toggle chase and cockpit viewpoints.
- E: interact near a building entrance; inside, E exits.
- Number keys 1–5: choose a displayed elevator floor while inside.
- Mobile touch steering and pedals remain available.

### Honest feature status
This is still a procedural prototype, not a finished photorealistic city. Building interiors and elevator floor selection are currently interaction/visual prototypes, not complete furnished multi-floor architectural simulations. The sedan is an original placeholder design and is not an exact Mercedes-Maybach reproduction or a licensed Mercedes asset. Detailed Blender vehicle assets, true collision/vehicle physics, pedestrian mode, elevator animation, full interior floor layouts and device-level performance testing remain future work.

### Performance changes
The renderer now uses a capped pixel ratio, disables expensive real-time shadows, and uses lighter scene settings by default. Actual FPS and thermal performance must still be measured on target devices.

 
## Connected Italy-inspired world foundation
- The current procedural world now includes four linked regional destinations: Milan, Rome, Naples and the Amalfi Coast.
- Curved intercity highway segments physically connect the regional hubs; map selection moves the active player/vehicle to the selected region.
- Each hub has a distinct procedural street/building layout and original landmark silhouettes. Rolling terrain forms and a sea/coastline visual zone establish regional variation.
- This is an original scaled game-world interpretation, not a surveyed 1:1 reconstruction of Italy or a licensed GIS/terrain dataset. Accurate street networks, elevation data, architectural asset packs, streaming/LOD and full-scale regional expansion are still required.
- The character is currently a procedural stylized placeholder; walk/run controls and enter/exit vehicle flow are early gameplay foundations, not motion-captured production animation.
- Building interiors remain a single-room interaction prototype; multi-floor furnished layouts and a moving elevator are not complete.
