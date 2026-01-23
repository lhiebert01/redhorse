# Progressive Web App (PWA) Setup Guide

**Purpose:** Make any web app installable on iPhone/Android without an App Store
**Time to Implement:** 30-60 minutes
**Complexity:** Low
**Value Added:** High — users get app-like experience, you avoid App Store fees/approval

---

## What is a PWA?

A Progressive Web App makes your website behave like a native app:
- Users can "Add to Home Screen"
- Opens full-screen (no browser bar)
- Has an app icon
- Loads faster (cached assets)
- Works offline (optional)

**No App Store submission. No 30% Apple/Google fee. No approval process.**

---

## Files Required

| File | Location | Purpose |
|------|----------|---------|
| `manifest.json` | `/public/manifest.json` | App metadata (name, icons, colors) |
| `sw.js` | `/public/sw.js` | Service worker (caching) |
| `icon-192x192.png` | `/public/assets/icons/` | Small app icon |
| `icon-512x512.png` | `/public/assets/icons/` | Large app icon |

---

## Step 1: Create manifest.json

Create `/public/manifest.json`:

```json
{
  "name": "Your App Name",
  "short_name": "App Name",
  "description": "Your app description",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#dc2626",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["entertainment", "lifestyle"],
  "lang": "en",
  "dir": "ltr"
}
```

**Key settings:**
- `display: "standalone"` — Opens without browser UI
- `theme_color` — Status bar color on mobile
- `background_color` — Splash screen background
- `start_url` — Where app opens (usually "/")

---

## Step 2: Create Service Worker

Create `/public/sw.js`:

```javascript
// Service Worker - Caches assets for fast loading
const CACHE_NAME = 'your-app-v1';

// Files to cache
const STATIC_ASSETS = [
  '/',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
  // Add your key assets here
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const responseToCache = response.clone();

        if (event.request.url.includes('/assets/') ||
            event.request.destination === 'image') {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      });
    })
  );
});
```

---

## Step 3: Create App Icons

**Required sizes:**
- 192 x 192 pixels (PNG)
- 512 x 512 pixels (PNG)

**Location:** `/public/assets/icons/`

**Tips:**
- Use a square image with your logo/brand
- PNG format (supports transparency)
- Simple, recognizable at small sizes
- Online resizer: https://www.iloveimg.com/resize-image

---

## Step 4: Update layout.tsx (Next.js)

Add to your `<head>` section in `src/app/layout.tsx`:

```tsx
<head>
  {/* PWA Meta Tags */}
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#dc2626" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Your App Name" />
  <link rel="apple-touch-icon" href="/assets/icons/icon-192x192.png" />

  {/* Service Worker Registration */}
  <script
    dangerouslySetInnerHTML={{
      __html: `
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(function(registration) {
              console.log('SW registered: ', registration);
            }).catch(function(error) {
              console.log('SW registration failed: ', error);
            });
          });
        }
      `,
    }}
  />
</head>
```

---

## Step 5: Add Install Button + Modal (Optional but Recommended)

Users don't always know they can install a website. Add a visible button with instructions.

### Add State
```tsx
const [showInstallModal, setShowInstallModal] = useState(false);
```

### Add Button (top-left corner)
```tsx
<button
  onClick={() => setShowInstallModal(true)}
  className="absolute top-4 left-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs px-3 py-2 rounded-lg z-20 flex items-center gap-1.5 shadow-lg"
>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
  Install App
</button>
```

### Add Modal
```tsx
{showInstallModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
    <div className="bg-gray-900 border-2 border-yellow-500 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-yellow-500 text-xl font-bold">Install App</h3>
        <button onClick={() => setShowInstallModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
      </div>

      {/* iPhone Instructions */}
      <div className="bg-gray-800 rounded-xl p-4 mb-4">
        <h4 className="text-white font-bold mb-3">iPhone / iPad</h4>
        <ol className="text-gray-300 text-sm space-y-2">
          <li>1. Open <strong>Safari</strong> browser</li>
          <li>2. Tap the <strong>Share</strong> button ⬆️</li>
          <li>3. Tap <strong>"Add to Home Screen"</strong></li>
          <li>4. Tap <strong>Add</strong></li>
        </ol>
      </div>

      {/* Android Instructions */}
      <div className="bg-gray-800 rounded-xl p-4 mb-4">
        <h4 className="text-white font-bold mb-3">Android</h4>
        <ol className="text-gray-300 text-sm space-y-2">
          <li>1. Open <strong>Chrome</strong> browser</li>
          <li>2. Tap the <strong>3 dots</strong> menu ⋮</li>
          <li>3. Tap <strong>"Add to Home Screen"</strong></li>
          <li>4. Tap <strong>Add</strong></li>
        </ol>
      </div>

      <button
        onClick={() => setShowInstallModal(false)}
        className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl"
      >
        Got It!
      </button>
    </div>
  </div>
)}
```

---

## Testing Your PWA

### Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to "Application" tab
3. Click "Manifest" — verify it loads
4. Click "Service Workers" — verify registration

### Lighthouse Audit
1. Chrome DevTools → Lighthouse tab
2. Check "Progressive Web App"
3. Run audit — aim for green checkmarks

### Mobile Testing
1. Open site on phone
2. Look for "Add to Home Screen" prompt (Android Chrome)
3. Or manually: Share → Add to Home Screen (iPhone Safari)

---

## Limitations

### iPhone/Safari
- ❌ No push notifications (Apple blocks this)
- ❌ No background sync
- ✅ Add to Home Screen works
- ✅ Full-screen mode works
- ✅ App icon works

### Android/Chrome
- ✅ Push notifications (with extra setup)
- ✅ Background sync
- ✅ Install prompt
- ✅ Full-screen mode
- ✅ App icon

---

## PWA vs Native App

| Feature | PWA | Native App |
|---------|-----|------------|
| Development time | Hours | Weeks/Months |
| Code reuse | 100% | 0% (new codebase) |
| App Store approval | Not needed | Required |
| App Store fees | $0 | $99/year + 30% cut |
| Updates | Instant | App Store review |
| Push notifications | Limited (no iOS) | Full support |
| Offline support | Yes | Yes |
| Device features | Limited | Full access |

**Recommendation:** Start with PWA. Only go native if you need push notifications on iOS or advanced device features.

---

## Checklist

- [ ] Create `/public/manifest.json`
- [ ] Create `/public/sw.js`
- [ ] Create `/public/assets/icons/icon-192x192.png`
- [ ] Create `/public/assets/icons/icon-512x512.png`
- [ ] Add PWA meta tags to layout.tsx
- [ ] Add service worker registration script
- [ ] Add "Install App" button (optional)
- [ ] Add install instructions modal (optional)
- [ ] Test on Chrome DevTools
- [ ] Test on real iPhone/Android device

---

## Files Reference (Red Horse Oracle Implementation)

| File | Path |
|------|------|
| Manifest | `/public/manifest.json` |
| Service Worker | `/public/sw.js` |
| Icons | `/public/assets/icons/icon-*.png` |
| Layout | `/src/app/layout.tsx` |
| Install Button | `/src/app/page.tsx` (showInstallModal state + button + modal) |

---

*This guide created January 22, 2026 for Red Horse Oracle*
*Reusable for any Next.js web application*
