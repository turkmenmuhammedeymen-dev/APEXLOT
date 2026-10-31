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
