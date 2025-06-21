/**
 * Guardify.js
 * Kullanıcı etkileşimlerini (sağ tık, kopyalama, geliştirici araçları vb.)
 * kısıtlamak için basit bir kütüphane.
 * 
 * @version 1.0.0
 * @author Mert ERGÜDEN - GET Software
 * @license MIT
 */
 class Guardify {
    /**
     * Guardify'ı yapılandırma seçenekleriyle başlatır.
     * @param {object} options - Kütüphanenin davranışını kontrol eden seçenekler.
     */
    constructor(options = {}) {
        // Varsayılan ayarlar
        const defaultOptions = {
            disableContextMenu: true,
            disableSelectStart: true,
            disableCopy: true,
            disableKeys: ["F12", "Ctrl+Shift+I", "Ctrl+U"],
            detectDevTools: true,
            devToolsMessage: "Geliştirici araçları kullanmak bu sitede engellenmiştir.",
            devToolsInterval: 1000,
        };

        // Kullanıcı seçeneklerini varsayılanlarla birleştir
        this.options = { ...defaultOptions, ...options };
        
        // Olay dinleyicilerini ve interval'ı takip etmek için
        this.eventListeners = [];
        this.devtoolsIntervalId = null;

        // Kütüphaneyi etkinleştir
        this.activate();

        console.log("Guardify.js aktif.");
    }

    /**
     * Belirtilen seçeneklere göre korumaları etkinleştirir.
     */
    activate() {
        if (this.options.disableContextMenu) {
            this.#addProtectedListener("contextmenu");
        }
        if (this.options.disableSelectStart) {
            this.#addProtectedListener("selectstart");
        }
        if (this.options.disableCopy) {
            this.#addProtectedListener("copy");
        }
        if (this.options.disableKeys && this.options.disableKeys.length > 0) {
            this.#setupKeydownListener();
        }
        if (this.options.detectDevTools) {
            this.#startDevtoolsDetector();
        }
    }

    /**
     * Korumaları devre dışı bırakır ve tüm olay dinleyicilerini temizler.
     * Özellikle Single Page Applications (SPA) için önemlidir.
     */
    destroy() {
        // Tüm event listener'ları kaldır
        this.eventListeners.forEach(({ event, handler }) => {
            document.removeEventListener(event, handler);
        });
        this.eventListeners = [];

        // DevTools interval'ını temizle
        if (this.devtoolsIntervalId) {
            clearInterval(this.devtoolsIntervalId);
            this.devtoolsIntervalId = null;
        }

        console.log("Guardify.js devre dışı bırakıldı.");
    }

   

    /**
     * Olayı engelleyen basit bir dinleyici ekler.
     * @param {string} eventName - Engellenecek olayın adı.
     * @private
     */
    #addProtectedListener(eventName) {
        const handler = (e) => {
            e.preventDefault();
            return false;
        };
        document.addEventListener(eventName, handler);
        this.eventListeners.push({ event: eventName, handler });
    }

    /**
     * Klavye kısayollarını dinleyen ve engelleyen kurulumu yapar.
     * @private
     */
    #setupKeydownListener() {
        const handler = (e) => {
            const keyMap = {
                "F12": e.key === "F12",
                "Ctrl+Shift+I": e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "ı"),
                "Ctrl+U": e.ctrlKey && (e.key === "U" || e.key === "u"),
            };

            for (const key of this.options.disableKeys) {
                if (keyMap[key]) {
                    e.preventDefault();
                    return false;
                }
            }
        };

        document.addEventListener("keydown", handler);
        this.eventListeners.push({ event: "keydown", handler });
    }

    /**
     * Geliştirici araçlarının açık olup olmadığını periyodik olarak kontrol eder.
     * @private
     */
    #startDevtoolsDetector() {
        const devtools = /./;
        devtools.toString = () => {
            console.clear();
            console.log(`%c${this.options.devToolsMessage}`, "color: red; font-size: 20px;");
            // Burada isteğe bağlı olarak başka bir işlem de yapılabilir.
            // Örneğin, kullanıcıyı başka bir sayfaya yönlendirme.
            // window.location.href = "/uyari.html";
        };

        this.devtoolsIntervalId = setInterval(() => {
            // Tarayıcı, konsol açıkken bir nesneyi log'larken
            // onu formatlamak için toString() metodunu çağırır. Bu hileye dayanır.
            console.log(devtools);
        }, this.options.devToolsInterval);
    }
}