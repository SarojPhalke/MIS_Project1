/* Service Worker: cache, offline, background sync, push */
const APP_VERSION = 'v0.1.0';
const STATIC_CACHE = `static-${APP_VERSION}`;
const RUNTIME_CACHE = `runtime-${APP_VERSION}`;
const OFFLINE_URL = '/offline.html';
const CORE_ASSETS = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => ![STATIC_CACHE, RUNTIME_CACHE].includes(k)).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Network falling back to cache for navigation
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Cache-first for same-origin static assets
  if (url.origin === self.location.origin && (request.destination === 'style' || request.destination === 'script' || request.destination === 'image')) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((resp) => {
        const respClone = resp.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, respClone));
        return resp;
      }))
    );
    return;
  }

  // Stale-while-revalidate for API GET requests
  if (request.method === 'GET' && /^(http|https):\/\//.test(url.href)) {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(request);
      const networkFetch = fetch(request).then((resp) => {
        if (resp && resp.status === 200) {
          cache.put(request, resp.clone());
        }
        return resp;
      }).catch(() => undefined);
      return cached || networkFetch || new Response('Offline', { status: 503 });
    })());
  }
});

// Background Sync: flush queued requests
self.addEventListener('sync', async (event) => {
  if (event.tag === 'mis-sync-outbox') {
    event.waitUntil(flushOutbox());
  }
});

async function openOutbox() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mis-db', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('outbox')) db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function flushOutbox() {
  const db = await openOutbox();
  const tx = db.transaction('outbox', 'readwrite');
  const store = tx.objectStore('outbox');
  const items = await store.getAll ? store.getAll() : new Promise((res) => {
    const arr = [];
    store.openCursor().onsuccess = (e) => {
      const cursor = e.target.result; if (!cursor) return res(arr); arr.push(cursor.value); cursor.continue();
    };
  });
  const results = await Promise.all(items.map(async (entry) => {
    try {
      const resp = await fetch(entry.url, { method: entry.method || 'POST', headers: entry.headers || { 'Content-Type': 'application/json' }, body: JSON.stringify(entry.body || {}) });
      if (resp.ok) {
        if (entry.id != null) store.delete(entry.id);
        return true;
      }
    } catch (e) {}
    return false;
  }));
  await tx.done?.catch(() => {});
  return results.every(Boolean);
}

// Push Notifications
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) {}
  const title = data.title || 'MIS Notification';
  const options = {
    body: data.body || 'You have an update',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: data.data || {}
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});


