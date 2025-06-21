# Guardify.js

**Guardify.js**, web sitenizdeki içeriğin basit yöntemlerle kopyalanmasını ve incelenmesini zorlaştırmak için tasarlanmış hafif ve yapılandırılabilir bir JavaScript kütüphanesidir.

> ⚠️ **Uyarı:** Bu tür kütüphaneler, kullanıcı deneyimini (UX) olumsuz etkileyebilir. Sağ tık menüsü ve metin seçimi gibi temel tarayıcı işlevlerini engellemek, kullanıcıları sitenizden uzaklaştırabilir. Bu kütüphaneyi yalnızca içeriğinizin korunmasının kullanıcı deneyiminden daha önemli olduğu özel durumlarda kullanın. Unutmayın ki bu yöntemler, teknik bilgisi olan bir kullanıcı tarafından kolayca aşılabilir.

## Özellikler

-   ✅ **Yapılandırılabilir:** İstediğiniz korumayı aktif/pasif hale getirebilirsiniz.
-   ✅ **Sağ Tık Engelleme:** `contextmenu` olayını engeller.
-   ✅ **Metin Seçimi Engelleme:** `selectstart` olayını engeller.
-   ✅ **Kopyalama Engelleme:** `copy` olayını ve ilgili kısayolları engeller.
-   ✅ **Kısayol Engelleme:** F12, `Ctrl+Shift+I`, `Ctrl+U` gibi geliştirici kısayollarını devre dışı bırakır.
-   ✅ **Geliştirici Araçları Tespiti:** Konsol açıldığında periyodik olarak konsolu temizler ve bir uyarı mesajı gösterir.
-   ✅ **Temiz API:** `destroy()` metodu ile tüm korumaları kaldırma imkanı sunar (SPA'lar için ideal).

## Kurulum

`dist/guardify.min.js` dosyasını projenize kopyalayın ve HTML dosyanızın `<body>` etiketinin kapanışından hemen önce ekleyin:

```html
<script src="path/to/guardify.min.js"></script>
```

## Kullanım

Kütüphaneyi dahil ettikten sonra, yeni bir `Guardify` nesnesi oluşturarak başlatın.

### 1. Varsayılan Ayarlarla Kullanım

Tüm korumaları varsayılan ayarlarla aktif hale getirmek için:

```html
<script src="guardify.min.js"></script>
<script>
    const guard = new Guardify();
</script>
```

### 2. Özel Ayarlarla Kullanım

Korumaları özelleştirmek için `Guardify` kurucusuna bir seçenekler nesnesi gönderin.

```javascript
const guard = new Guardify({
    disableContextMenu: true,  // Sağ tık menüsünü engelle (varsayılan: true)
    disableSelectStart: false, // Metin seçimine İZİN VER (varsayılan: true)
    disableCopy: true,         // Kopyalamayı engelle (varsayılan: true)
    disableKeys: ["F12"],      // Sadece F12 tuşunu engelle
    detectDevTools: false,     // Geliştirici araçları tespitini kapat (varsayılan: true)
    devToolsMessage: "Bu alana erişim kısıtlanmıştır." // Özel uyarı mesajı
});
```

### 3. Korumayı Kaldırma

Özellikle React, Vue, Angular gibi tek sayfa uygulamalarında (SPA) bir component kaldırıldığında (unmount) korumayı kaldırmak önemlidir. `destroy()` metodunu kullanarak tüm olay dinleyicilerini ve zamanlayıcıları temizleyebilirsiniz.

```javascript
// Korumayı başlat
const guard = new Guardify();

// ... bir süre sonra veya component kaldırıldığında ...
guard.destroy();
```

## Yapılandırma Seçenekleri

| Seçenek            | Tür      | Varsayılan                            | Açıklama                                                                |
| ------------------ | -------- | ------------------------------------- | ----------------------------------------------------------------------- |
| `disableContextMenu` | `boolean`  | `true`                                | `true` ise sağ tık menüsünü engeller.                                   |
| `disableSelectStart` | `boolean`  | `true`                                | `true` ise fare ile metin seçimini engeller.                            |
| `disableCopy`      | `boolean`  | `true`                                | `true` ise kopyalama olayını engeller.                                  |
| `disableKeys`      | `Array`    | `["F12", "Ctrl+Shift+I", "Ctrl+U"]`   | Engellenecek klavye kısayollarının listesi. Boş dizi `[]` ile pasifleşir. |
| `detectDevTools`   | `boolean`  | `true`                                | `true` ise geliştirici araçları konsolunu tespit etmeye çalışır.        |
| `devToolsMessage`  | `string`   | `"Geliştirici araçları..."`             | Geliştirici araçları tespit edildiğinde konsola yazılacak mesaj.        |
| `devToolsInterval` | `number`   | `1000`                                | Geliştirici araçları kontrolünün milisaniye cinsinden sıklığı.          |

## Lisans

MIT License