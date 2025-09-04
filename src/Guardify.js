/**
 * Guardify.js - Enhanced Security Library
 * Kullanıcı etkileşimlerini (sağ tık, kopyalama, geliştirici araçları vb.)
 * kısıtlamak için gelişmiş güvenlik kütüphanesi.
 * 
 * @version 2.0.0
 * @author Mert ERGÜDEN - GET Software
 * @license MIT
 */

class Guardify {
    // Statik sabitler
    static VERSION = "2.0.0";
    static EVENTS = {
        CONTEXT_MENU: "contextmenu",
        SELECT_START: "selectstart", 
        COPY: "copy",
        CUT: "cut",
        PASTE: "paste",
        DRAG_START: "dragstart",
        KEY_DOWN: "keydown",
        BLUR: "blur",
        FOCUS: "focus"
    };

    static KEY_COMBINATIONS = {
        F12: (e) => e.key === "F12",
        CTRL_SHIFT_I: (e) => e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "ı"),
        CTRL_U: (e) => e.ctrlKey && (e.key === "U" || e.key === "u"),
        CTRL_S: (e) => e.ctrlKey && (e.key === "S" || e.key === "s"),
        CTRL_A: (e) => e.ctrlKey && (e.key === "A" || e.key === "a"),
        CTRL_C: (e) => e.ctrlKey && (e.key === "C" || e.key === "c"),
        CTRL_V: (e) => e.ctrlKey && (e.key === "V" || e.key === "v"),
        CTRL_X: (e) => e.ctrlKey && (e.key === "X" || e.key === "x"),
        CTRL_P: (e) => e.ctrlKey && (e.key === "P" || e.key === "p"),
        CTRL_SHIFT_J: (e) => e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j"),
        CTRL_SHIFT_C: (e) => e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c"),
        F5: (e) => e.key === "F5",
        CTRL_R: (e) => e.ctrlKey && (e.key === "R" || e.key === "r")
    };

    /**
     * Guardify'ı yapılandırma seçenekleriyle başlatır.
     * @param {GuardifyOptions} options - Kütüphanenin davranışını kontrol eden seçenekler.
     */
    constructor(options = {}) {
        this.#validateOptions(options);
        
        // Varsayılan ayarlar
        const defaultOptions = {
            // Temel koruma ayarları
            disableContextMenu: true,
            disableSelectStart: true,
            disableCopy: true,
            disableCut: true,
            disablePaste: false,
            disableDrag: true,
            disablePrint: false,
            disableRefresh: false,
            
            // Klavye kısayolları
            disableKeys: ["F12", "CTRL_SHIFT_I", "CTRL_U"],
            customKeys: [],
            
            // Geliştirici araçları algılama
            detectDevTools: true,
            devToolsMessage: "🛡️ Bu site Guardify.js ile korunmaktadır. Geliştirici araçları devre dışı bırakılmıştır.",
            devToolsInterval: 1000,
            devToolsAction: "warn", // "warn", "redirect", "custom"
            devToolsRedirectUrl: "/warning.html",
            devToolsCallback: null,
            
            // Gelişmiş özellikler
            antiDebug: false,
            disableImageSaving: true,
            obscureConsole: true,
            detectExtensions: false,
            
            // Performans ayarları
            throttleMs: 100,
            enableLogging: false,
            
            // Beyaz liste
            allowedDomains: [],
            excludeSelectors: [],
            
            // Callback fonksiyonları
            onViolationDetected: null,
            onDestroy: null,
            onActivate: null
        };

        this.options = { ...defaultOptions, ...options };
        this.eventListeners = new Map();
        this.intervals = new Set();
        this.isActive = false;
        this.violationCount = 0;
        
        // Throttle için
        this.lastExecutionTime = 0;

        this.#initialize();
    }

    /**
     * Kütüphaneyi başlatır ve korumaları etkinleştirir.
     * @private
     */
    #initialize() {
        try {
            this.#setupErrorHandling();
            this.activate();
            this.#logInfo("Guardify.js başarıyla başlatıldı.");
        } catch (error) {
            this.#logError("Guardify.js başlatılırken hata oluştu:", error);
        }
    }

    /**
     * Seçenekleri doğrular.
     * @param {object} options - Doğrulanacak seçenekler
     * @private
     */
    #validateOptions(options) {
        if (typeof options !== "object" || options === null) {
            throw new Error("Guardify seçenekleri obje tipinde olmalıdır.");
        }

        if (options.devToolsInterval && (typeof options.devToolsInterval !== "number" || options.devToolsInterval < 100)) {
            throw new Error("devToolsInterval en az 100ms olmalıdır.");
        }

        if (options.throttleMs && (typeof options.throttleMs !== "number" || options.throttleMs < 0)) {
            throw new Error("throttleMs pozitif bir sayı olmalıdır.");
        }
    }

    /**
     * Hata yakalama mekanizmasını kurar.
     * @private
     */
    #setupErrorHandling() {
        window.addEventListener("error", (e) => {
            this.#logError("Global hata yakalandı:", e.error);
        });

        window.addEventListener("unhandledrejection", (e) => {
            this.#logError("Yakalanmamış Promise reddi:", e.reason);
        });
    }

    /**
     * Korumaları etkinleştirir.
     */
    activate() {
        if (this.isActive) {
            this.#logWarn("Guardify zaten aktif.");
            return;
        }

        this.#setupProtections();
        this.isActive = true;

        if (this.options.onActivate) {
            this.options.onActivate();
        }

        this.#logInfo("Guardify korumaları etkinleştirildi.");
    }

    /**
     * Tüm korumaları kurar.
     * @private
     */
    #setupProtections() {
        // Temel korumalar
        if (this.options.disableContextMenu) {
            this.#addProtectedListener(Guardify.EVENTS.CONTEXT_MENU);
        }
        
        if (this.options.disableSelectStart) {
            this.#addProtectedListener(Guardify.EVENTS.SELECT_START);
        }
        
        if (this.options.disableCopy) {
            this.#addProtectedListener(Guardify.EVENTS.COPY);
        }
        
        if (this.options.disableCut) {
            this.#addProtectedListener(Guardify.EVENTS.CUT);
        }
        
        if (this.options.disablePaste) {
            this.#addProtectedListener(Guardify.EVENTS.PASTE);
        }
        
        if (this.options.disableDrag) {
            this.#addProtectedListener(Guardify.EVENTS.DRAG_START);
        }

        // Klavye korumaları
        if (this.options.disableKeys?.length > 0 || this.options.customKeys?.length > 0) {
            this.#setupKeydownListener();
        }

        // Geliştirici araçları algılama
        if (this.options.detectDevTools) {
            this.#startDevtoolsDetector();
        }

        // Anti-debug
        if (this.options.antiDebug) {
            this.#setupAntiDebug();
        }

        // Görsel koruma
        if (this.options.disableImageSaving) {
            this.#setupImageProtection();
        }

        // Konsol gizleme
        if (this.options.obscureConsole) {
            this.#obscureConsole();
        }

        // Uzantı algılama
        if (this.options.detectExtensions) {
            this.#detectBrowserExtensions();
        }
    }

    /**
     * Basit olay dinleyici ekler ve throttling uygular.
     * @param {string} eventName - Olay adı
     * @private
     */
    #addProtectedListener(eventName) {
        const handler = this.#throttle((e) => {
            if (this.#shouldIgnoreEvent(e.target)) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            this.#onViolation("Event blocked", { event: eventName, target: e.target });
            return false;
        }, this.options.throttleMs);

        document.addEventListener(eventName, handler, { passive: false });
        this.eventListeners.set(eventName, handler);
    }

    /**
     * Klavye dinleyicisini kurar.
     * @private
     */
    #setupKeydownListener() {
        const handler = this.#throttle((e) => {
            if (this.#shouldIgnoreEvent(e.target)) {
                return;
            }

            // Varsayılan kısayolları kontrol et
            for (const key of this.options.disableKeys) {
                const keyChecker = Guardify.KEY_COMBINATIONS[key];
                if (keyChecker && keyChecker(e)) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.#onViolation("Key combination blocked", { key, target: e.target });
                    return false;
                }
            }

            // Özel kısayolları kontrol et
            for (const customKey of this.options.customKeys) {
                if (typeof customKey === "function" && customKey(e)) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.#onViolation("Custom key blocked", { target: e.target });
                    return false;
                }
            }
        }, this.options.throttleMs);

        document.addEventListener(Guardify.EVENTS.KEY_DOWN, handler, { passive: false });
        this.eventListeners.set(Guardify.EVENTS.KEY_DOWN, handler);
    }

    /**
     * Geliştirici araçları algılayıcısını başlatır.
     * @private
     */
    #startDevtoolsDetector() {
        // Konsol hilesi
        const devtools = /./;
        devtools.toString = () => {
            this.#handleDevToolsDetection();
        };

        // Boyut değişikliği algılama
        let devtoolsOpen = false;
        const threshold = 160;

        const checkDevtools = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;

            if ((widthThreshold || heightThreshold) && !devtoolsOpen) {
                devtoolsOpen = true;
                this.#handleDevToolsDetection();
            } else if (!widthThreshold && !heightThreshold && devtoolsOpen) {
                devtoolsOpen = false;
            }

            // Konsol hilesi
            console.log(devtools);
        };

        const intervalId = setInterval(checkDevtools, this.options.devToolsInterval);
        this.intervals.add(intervalId);

        // Resize dinleyici ekle
        const resizeHandler = this.#throttle(checkDevtools, 250);
        window.addEventListener("resize", resizeHandler);
        this.eventListeners.set("resize", resizeHandler);
    }

    /**
     * Geliştirici araçları algılandığında çalışır.
     * @private
     */
    #handleDevToolsDetection() {
        console.clear();
        console.log(`%c${this.options.devToolsMessage}`, "color: #ff4444; font-size: 18px; font-weight: bold; background: #000; padding: 10px;");

        this.#onViolation("Developer tools detected");

        switch (this.options.devToolsAction) {
            case "redirect":
                if (this.options.devToolsRedirectUrl) {
                    window.location.href = this.options.devToolsRedirectUrl;
                }
                break;
            case "custom":
                if (typeof this.options.devToolsCallback === "function") {
                    this.options.devToolsCallback();
                }
                break;
            case "warn":
            default:
                // Varsayılan uyarı davranışı
                break;
        }
    }

    /**
     * Anti-debug korumalarını kurar.
     * @private
     */
    #setupAntiDebug() {
        // Debugger tuzağı
        const antiDebug = () => {
            setInterval(() => {
                debugger;
            }, 100);
        };

        // Fonksiyon koruma
        const originalSetInterval = window.setInterval;
        window.setInterval = (...args) => {
            if (args[0].toString().includes("debugger")) {
                return originalSetInterval.apply(window, args);
            }
            return originalSetInterval.apply(window, args);
        };

        setTimeout(antiDebug, 1000);
    }

    /**
     * Görsel koruma kurar.
     * @private
     */
    #setupImageProtection() {
        // CSS ile görsel koruma
        const style = document.createElement("style");
        style.textContent = `
            img, video, canvas, svg {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
                -webkit-touch-callout: none !important;
                -webkit-user-drag: none !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(style);

        // Sağ tık koruması
        document.addEventListener("dragstart", (e) => {
            if (["IMG", "VIDEO", "CANVAS", "SVG"].includes(e.target.tagName)) {
                e.preventDefault();
            }
        });
    }

    /**
     * Konsolu gizler.
     * @private
     */
    #obscureConsole() {
        // Konsol metodlarını override et
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        console.log = (...args) => {
            if (this.options.enableLogging) {
                originalLog.apply(console, args);
            }
        };

        console.warn = (...args) => {
            if (this.options.enableLogging) {
                originalWarn.apply(console, args);
            }
        };

        console.error = (...args) => {
            if (this.options.enableLogging) {
                originalError.apply(console, args);
            }
        };
    }

    /**
     * Tarayıcı uzantılarını algılar.
     * @private
     */
    #detectBrowserExtensions() {
        // Chrome uzantıları
        if (window.chrome && window.chrome.runtime) {
            this.#onViolation("Browser extension detected", { type: "chrome-extension" });
        }

        // Content script algılama
        const scripts = document.querySelectorAll("script");
        scripts.forEach(script => {
            if (script.src && script.src.startsWith("chrome-extension://")) {
                this.#onViolation("Extension script detected", { src: script.src });
            }
        });
    }

    /**
     * Olayın yok sayılıp sayılmayacağını kontrol eder.
     * @param {Element} target - Olay hedefi
     * @returns {boolean}
     * @private
     */
    #shouldIgnoreEvent(target) {
        if (!target) return false;

        // Beyaz liste kontrol
        for (const selector of this.options.excludeSelectors) {
            if (target.matches && target.matches(selector)) {
                return true;
            }
        }

        return false;
    }

    /**
     * İhlal durumunu işler.
     * @param {string} type - İhlal türü
     * @param {object} details - İhlal detayları
     * @private
     */
    #onViolation(type, details = {}) {
        this.violationCount++;
        
        const violationData = {
            type,
            details,
            timestamp: new Date(),
            count: this.violationCount,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.#logWarn("Güvenlik ihlali algılandı:", violationData);

        if (typeof this.options.onViolationDetected === "function") {
            this.options.onViolationDetected(violationData);
        }
    }

    /**
     * Throttling uygular.
     * @param {Function} func - Throttle edilecek fonksiyon
     * @param {number} delay - Gecikme süresi
     * @returns {Function}
     * @private
     */
    #throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return (...args) => {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    /**
     * Korumaları devre dışı bırakır.
     */
    destroy() {
        if (!this.isActive) {
            this.#logWarn("Guardify zaten devre dışı.");
            return;
        }

        try {
            // Event listener'ları temizle
            this.eventListeners.forEach((handler, event) => {
                document.removeEventListener(event, handler);
                window.removeEventListener(event, handler);
            });
            this.eventListeners.clear();

            // Interval'ları temizle
            this.intervals.forEach(intervalId => {
                clearInterval(intervalId);
            });
            this.intervals.clear();

            this.isActive = false;

            if (typeof this.options.onDestroy === "function") {
                this.options.onDestroy();
            }

            this.#logInfo("Guardify başarıyla devre dışı bırakıldı.");
        } catch (error) {
            this.#logError("Guardify destroy edilirken hata:", error);
        }
    }

    /**
     * Durum bilgisini döndürür.
     * @returns {object}
     */
    getStatus() {
        return {
            version: Guardify.VERSION,
            isActive: this.isActive,
            violationCount: this.violationCount,
            activeListeners: this.eventListeners.size,
            activeIntervals: this.intervals.size,
            options: { ...this.options }
        };
    }

    /**
     * İstatistikleri sıfırlar.
     */
    resetStats() {
        this.violationCount = 0;
        this.#logInfo("İstatistikler sıfırlandı.");
    }

    // Loglama metodları
    #logInfo(message, ...args) {
        if (this.options.enableLogging) {
            console.log(`[Guardify INFO] ${message}`, ...args);
        }
    }

    #logWarn(message, ...args) {
        if (this.options.enableLogging) {
            console.warn(`[Guardify WARN] ${message}`, ...args);
        }
    }

    #logError(message, ...args) {
        if (this.options.enableLogging) {
            console.error(`[Guardify ERROR] ${message}`, ...args);
        }
    }
}

// Global erişim için
if (typeof window !== "undefined") {
    window.Guardify = Guardify;
}

// CommonJS desteği
if (typeof module !== "undefined" && module.exports) {
    module.exports = Guardify;
}

// ES6 modül desteği
export default Guardify;

/**
 * @typedef {Object} GuardifyOptions
 * @property {boolean} [disableContextMenu=true] - Sağ tık menüsünü devre dışı bırakır
 * @property {boolean} [disableSelectStart=true] - Metin seçimini devre dışı bırakır
 * @property {boolean} [disableCopy=true] - Kopyalamayı devre dışı bırakır
 * @property {boolean} [disableCut=true] - Kesmeyi devre dışı bırakır
 * @property {boolean} [disablePaste=false] - Yapıştırmayı devre dışı bırakır
 * @property {boolean} [disableDrag=true] - Sürüklemeyi devre dışı bırakır
 * @property {boolean} [disablePrint=false] - Yazdırmayı devre dışı bırakır
 * @property {boolean} [disableRefresh=false] - Sayfayı yenilemeyi devre dışı bırakır
 * @property {string[]} [disableKeys] - Devre dışı bırakılacak klavye kısayolları
 * @property {Function[]} [customKeys] - Özel klavye kontrol fonksiyonları
 * @property {boolean} [detectDevTools=true] - Geliştirici araçlarını algılar
 * @property {string} [devToolsMessage] - DevTools algılandığında gösterilecek mesaj
 * @property {number} [devToolsInterval=1000] - DevTools kontrol aralığı (ms)
 * @property {string} [devToolsAction="warn"] - DevTools algılandığında yapılacak işlem
 * @property {string} [devToolsRedirectUrl] - Yönlendirme URL'si
 * @property {Function} [devToolsCallback] - DevTools callback fonksiyonu
 * @property {boolean} [antiDebug=false] - Anti-debug koruması
 * @property {boolean} [disableImageSaving=true] - Görsel kaydetmeyi engeller
 * @property {boolean} [obscureConsole=true] - Konsolu gizler
 * @property {boolean} [detectExtensions=false] - Tarayıcı uzantılarını algılar
 * @property {number} [throttleMs=100] - Event throttling süresi
 * @property {boolean} [enableLogging=false] - Loglama etkinleştir
 * @property {string[]} [allowedDomains] - İzin verilen domain'ler
 * @property {string[]} [excludeSelectors] - Hariç tutulacak CSS seçiciler
 * @property {Function} [onViolationDetected] - İhlal algılandığında çalışacak callback
 * @property {Function} [onDestroy] - Destroy edildiğinde çalışacak callback
 * @property {Function} [onActivate] - Etkinleştirildiğinde çalışacak callback
 */
