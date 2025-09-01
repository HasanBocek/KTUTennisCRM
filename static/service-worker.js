// Service Worker - No Cache Version
// Bu service worker PWA desteği sağlar ama herhangi bir cache işlemi yapmaz

const CACHE_NAME = 'no-cache-sw';

// Install event - service worker kurulumu
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event');
  // Hemen aktif hale getir
  self.skipWaiting();
});

// Activate event - service worker aktivasyonu
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event');
  // Tüm cache'leri temizle (eğer varsa)
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Service Worker: Clearing cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Hemen tüm istemcileri kontrol et
      return self.clients.claim();
    })
  );
});

// Fetch event - tüm istekleri doğrudan network'e yönlendir
self.addEventListener('fetch', (event) => {
  // Cache kullanmayız, tüm istekleri network'e yönlendir
  event.respondWith(
    fetch(event.request.clone()).catch((error) => {
      console.log('Service Worker: Network request failed:', error);
      // Network hatası durumunda da cache kullanmayız
      throw error;
    })
  );
});

// Background sync desteği (opsiyonel)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync event:', event.tag);
});

// Push notification desteği (opsiyonel)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push event received');
  
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/images/pwa-icons/icon-192x192.png',
      badge: '/images/pwa-icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification('Tenis App', options)
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click event');
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('Service Worker: Script loaded - No cache version');