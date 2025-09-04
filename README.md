# 🛡️ Guardify.js

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/mertergueden/guardify.js)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Size](https://img.shields.io/badge/minified-6.8KB-orange.svg)](https://github.com/mertergueden/guardify.js/blob/main/dist/guardify.min.js)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**Guardify.js** is a lightweight, configurable JavaScript security library designed to make it more difficult to copy and inspect your website content using simple methods. It provides comprehensive protection against common content theft techniques while maintaining optimal performance.

> ⚠️ **Warning:** These types of libraries can negatively impact user experience (UX). Blocking essential browser functions like right-click menus and text selection may drive users away from your site. Use this library only in special cases where content protection is more important than user experience. Remember that these methods can be easily bypassed by users with technical knowledge.

## ✨ Features

### 🔐 **Core Protection**
- ✅ **Configurable Protection:** Enable/disable any protection as needed
- ✅ **Right-Click Blocking:** Prevents `contextmenu` events
- ✅ **Text Selection Blocking:** Prevents `selectstart` events  
- ✅ **Copy/Cut/Paste Protection:** Blocks clipboard operations
- ✅ **Drag & Drop Protection:** Prevents content dragging
- ✅ **Image Protection:** Blocks image saving and dragging

### ⌨️ **Advanced Keyboard Protection**
- ✅ **Developer Shortcuts:** F12, `Ctrl+Shift+I`, `Ctrl+U`, etc.
- ✅ **Custom Key Combinations:** Define your own protected shortcuts
- ✅ **Print Protection:** Block `Ctrl+P` printing
- ✅ **Refresh Protection:** Block F5 and `Ctrl+R` refresh

### 🔍 **Developer Tools Detection**
- ✅ **DevTools Detection:** Detects when developer console is opened
- ✅ **Multiple Detection Methods:** Console tricks + window size monitoring
- ✅ **Customizable Actions:** Warn, redirect, or custom callback
- ✅ **Anti-Debug Protection:** Debugger traps and breakpoint prevention

### 🚀 **Enterprise Features**
- ✅ **Performance Optimized:** Event throttling and memory leak prevention
- ✅ **Extension Detection:** Detect browser extensions
- ✅ **Console Obfuscation:** Hide console output
- ✅ **Violation Tracking:** Monitor and log security violations
- ✅ **Whitelist Support:** Exclude specific elements/selectors
- ✅ **Professional Error Handling:** Comprehensive try-catch and validation
- ✅ **TypeScript Ready:** Full JSDoc type definitions
- ✅ **Module Support:** ES6, CommonJS, and browser global support

## 📦 Installation

### CDN (Recommended)
```html
<script src="https://cdn.jsdelivr.net/gh/mertergueden/guardify.js@main/dist/guardify.min.js"></script>
```

### Download
Download `guardify.min.js` from the `dist/` folder and include it in your HTML before the closing `</body>` tag:

```html
<script src="path/to/guardify.min.js"></script>
```

### NPM (Coming Soon)
```bash
npm install guardify.js
```

## 🚀 Quick Start

### 1. Basic Usage (Default Settings)
Activate all protections with default settings:

```html
<script src="guardify.min.js"></script>
<script>
    const guardify = new Guardify();
</script>
```

### 2. Custom Configuration
Customize protections by passing an options object:

```javascript
const guardify = new Guardify({
    // Basic protections
    disableContextMenu: true,
    disableSelectStart: false, // Allow text selection
    disableCopy: true,
    disableCut: true,
    disablePaste: false,
    disableDrag: true,
    
    // Keyboard protections
    disableKeys: ["F12", "CTRL_SHIFT_I"],
    customKeys: [
        (e) => e.altKey && e.key === "Tab" // Block Alt+Tab
    ],
    
    // Developer tools
    detectDevTools: true,
    devToolsAction: "redirect",
    devToolsRedirectUrl: "/warning.html",
    devToolsMessage: "🛡️ This site is protected by Guardify.js",
    
    // Advanced features
    antiDebug: true,
    disableImageSaving: true,
    detectExtensions: true,
    
    // Performance & logging
    enableLogging: true,
    throttleMs: 100,
    
    // Callbacks
    onViolationDetected: (data) => {
        console.log("Security violation detected:", data);
        // Send to analytics, show warning, etc.
    }
});
```

### 3. Cleanup (Important for SPAs)
For React, Vue, Angular and other single-page applications, always clean up when components unmount:

```javascript
// Start protection
const guardify = new Guardify();

// Later, when component unmounts or cleanup needed
guardify.destroy();
```

### 4. Status Monitoring
```javascript
const guardify = new Guardify();

// Get current status
const status = guardify.getStatus();
console.log(status);
// Output: { version: "2.0.0", isActive: true, violationCount: 3, ... }

// Reset violation statistics
guardify.resetStats();
```

## ⚙️ Configuration Options

### 🔐 Basic Protection Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disableContextMenu` | `boolean` | `true` | Block right-click context menu |
| `disableSelectStart` | `boolean` | `true` | Block text selection with mouse |
| `disableCopy` | `boolean` | `true` | Block copy operations |
| `disableCut` | `boolean` | `true` | Block cut operations |
| `disablePaste` | `boolean` | `false` | Block paste operations |
| `disableDrag` | `boolean` | `true` | Block drag and drop |
| `disablePrint` | `boolean` | `false` | Block printing (Ctrl+P) |
| `disableRefresh` | `boolean` | `false` | Block page refresh (F5, Ctrl+R) |

### ⌨️ Keyboard Protection Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disableKeys` | `string[]` | `["F12", "CTRL_SHIFT_I", "CTRL_U"]` | Array of key combinations to block |
| `customKeys` | `Function[]` | `[]` | Custom key checker functions |

**Available Key Combinations:**
- `F12` - Developer tools
- `CTRL_SHIFT_I` - Developer tools 
- `CTRL_U` - View source
- `CTRL_S` - Save page
- `CTRL_A` - Select all
- `CTRL_C` - Copy
- `CTRL_V` - Paste
- `CTRL_X` - Cut
- `CTRL_P` - Print
- `CTRL_SHIFT_J` - Console
- `CTRL_SHIFT_C` - Inspect element
- `F5` - Refresh
- `CTRL_R` - Refresh

### 🔍 Developer Tools Detection

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `detectDevTools` | `boolean` | `true` | Enable developer tools detection |
| `devToolsMessage` | `string` | `"🛡️ This site is protected..."` | Message shown when DevTools detected |
| `devToolsInterval` | `number` | `1000` | Detection check interval (ms) |
| `devToolsAction` | `string` | `"warn"` | Action: `"warn"`, `"redirect"`, `"custom"` |
| `devToolsRedirectUrl` | `string` | `"/warning.html"` | Redirect URL when action is "redirect" |
| `devToolsCallback` | `Function` | `null` | Custom callback when action is "custom" |

### 🚀 Advanced Features

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `antiDebug` | `boolean` | `false` | Enable anti-debug protection |
| `disableImageSaving` | `boolean` | `true` | Protect images from saving |
| `obscureConsole` | `boolean` | `true` | Hide console output |
| `detectExtensions` | `boolean` | `false` | Detect browser extensions |

### 🎯 Performance & Customization

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `throttleMs` | `number` | `100` | Event throttling delay (ms) |
| `enableLogging` | `boolean` | `false` | Enable internal logging |
| `allowedDomains` | `string[]` | `[]` | Domains to exclude from protection |
| `excludeSelectors` | `string[]` | `[]` | CSS selectors to exclude |

### 📞 Callback Functions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onViolationDetected` | `Function` | `null` | Called when security violation detected |
| `onDestroy` | `Function` | `null` | Called when Guardify is destroyed |
| `onActivate` | `Function` | `null` | Called when Guardify is activated |

## 🔧 Advanced Examples

### Enterprise Security Setup
```javascript
const guardify = new Guardify({
    // Maximum protection
    disableContextMenu: true,
    disableSelectStart: true,
    disableCopy: true,
    disableCut: true,
    disableDrag: true,
    disablePrint: true,
    
    // All developer shortcuts
    disableKeys: [
        "F12", "CTRL_SHIFT_I", "CTRL_U", "CTRL_S",
        "CTRL_SHIFT_J", "CTRL_SHIFT_C"
    ],
    
    // Advanced protection
    detectDevTools: true,
    antiDebug: true,
    disableImageSaving: true,
    detectExtensions: true,
    
    // Custom actions
    devToolsAction: "custom",
    devToolsCallback: () => {
        // Log to analytics
        analytics.track('security_violation', {
            type: 'devtools_detected',
            timestamp: new Date()
        });
        
        // Show custom warning
        showSecurityWarning();
        
        // Optionally redirect after delay
        setTimeout(() => {
            window.location.href = '/security-warning';
        }, 3000);
    },
    
    // Violation tracking
    onViolationDetected: (data) => {
        // Send to monitoring service
        fetch('/api/security-violations', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        // Show user notification
        if (data.count > 5) {
            showWarningNotification("Multiple security violations detected");
        }
    }
});
```

### Selective Protection with Whitelist
```javascript
const guardify = new Guardify({
    disableContextMenu: true,
    disableCopy: true,
    
    // Allow certain elements to be copied
    excludeSelectors: [
        '.copyable',
        '#user-content',
        '[data-allow-copy]',
        '.code-snippet'
    ],
    
    // Custom key combinations
    customKeys: [
        // Block Ctrl+Shift+K (Firefox console)
        (e) => e.ctrlKey && e.shiftKey && e.key === 'K',
        
        // Block custom combination Alt+D
        (e) => e.altKey && e.key === 'D'
    ]
});
```

### React Integration Example
```jsx
import { useEffect, useRef } from 'react';

function ProtectedComponent() {
    const guardifyRef = useRef(null);
    
    useEffect(() => {
        // Initialize protection
        guardifyRef.current = new Guardify({
            enableLogging: process.env.NODE_ENV === 'development',
            onViolationDetected: (data) => {
                console.warn('Security violation:', data);
            }
        });
        
        // Cleanup on unmount
        return () => {
            if (guardifyRef.current) {
                guardifyRef.current.destroy();
            }
        };
    }, []);
    
    return (
        <div className="protected-content">
            {/* Your protected content */}
        </div>
    );
}
```

## 📊 API Reference

### Methods

#### `new Guardify(options)`
Creates a new Guardify instance with the specified options.

#### `.activate()`
Manually activates all protections (automatically called on initialization).

#### `.destroy()`
Removes all event listeners and cleans up resources. **Always call this in SPAs!**

#### `.getStatus()`
Returns current status object:
```javascript
{
    version: "2.0.0",
    isActive: true,
    violationCount: 3,
    activeListeners: 8,
    activeIntervals: 2,
    options: { /* current options */ }
}
```

#### `.resetStats()`
Resets violation count and statistics.

### Events

The `onViolationDetected` callback receives a violation object:
```javascript
{
    type: "Event blocked" | "Key combination blocked" | "Developer tools detected" | ...,
    details: { /* violation-specific details */ },
    timestamp: Date,
    count: number,
    userAgent: string,
    url: string
}
```

## 🌟 Use Cases

### 🎓 **Educational Platforms**
Protect course materials, assignments, and exam content from easy copying.

### 📰 **Content Publishers**
Prevent casual content theft from articles, blogs, and premium content.

### 💼 **Corporate Websites**
Protect proprietary information, documentation, and sensitive business content.

### 🎨 **Creative Portfolios**
Protect artwork, designs, and creative content from unauthorized use.

### 💰 **E-commerce**
Protect product descriptions, pricing strategies, and proprietary content.

## ⚡ Performance

- **Lightweight:** Only 6.8KB minified
- **Optimized:** Event throttling prevents performance issues
- **Memory Safe:** Proper cleanup prevents memory leaks
- **Non-blocking:** Async initialization doesn't slow page load

## 🔒 Security Considerations

### What Guardify.js CAN Do:
- ✅ Deter casual users from copying content
- ✅ Block basic developer tools access
- ✅ Prevent simple drag-and-drop theft
- ✅ Make content inspection more difficult
- ✅ Detect and respond to common bypass attempts

### What Guardify.js CANNOT Do:
- ❌ Stop determined developers or bots
- ❌ Prevent viewing page source (Ctrl+U can be blocked, but view-source:// still works)
- ❌ Stop server-side scraping or API access
- ❌ Prevent browser extension-based copying
- ❌ Block screenshot tools or screen recording

### Best Practices:
1. **Layer Security:** Use Guardify.js as part of a multi-layer security strategy
2. **Server-Side Protection:** Implement rate limiting, authentication, and API protection
3. **Legal Protection:** Use terms of service and copyright notices
4. **User Experience:** Balance protection with usability
5. **Regular Updates:** Keep the library updated for latest protection methods

## 📈 Browser Compatibility

- ✅ Chrome 60+ (ES6 support required)
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Opera 47+

## 🔄 Migration from v1.x

If you're upgrading from Guardify.js v1.x:

### Breaking Changes:
- Constructor options structure changed
- Some method names updated
- New violation tracking system

### Migration Example:
```javascript
// v1.x (OLD)
const guard = new Guardify({
    disableKeys: ["F12", "Ctrl+Shift+I", "Ctrl+U"]
});

// v2.x (NEW) 
const guard = new Guardify({
    disableKeys: ["F12", "CTRL_SHIFT_I", "CTRL_U"] // Updated format
});
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup:
```bash
git clone https://github.com/mertergueden/guardify.js
cd guardify.js
npm install
npm run build
```

### Build Scripts:
- `npm run build` - Build production files
- `npm run minify` - Create minified version
- `npm run test` - Run tests
- `npm run lint` - Lint code

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mert ERGÜDEN** - [GET Software](https://github.com/mertergueden)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped improve this library
- Inspired by various content protection needs in the web development community

## ⭐ Show Your Support

If you find Guardify.js useful, please consider:
- ⭐ Starring this repository
- 🍴 Forking and contributing
- 📢 Sharing with others
- 🐛 Reporting issues

---

<div align="center">

**Made with ❤️ by [Mert ERGÜDEN](https://github.com/mertergueden)**

[⬆ Back to Top](#️-guardifyjs)

</div>
