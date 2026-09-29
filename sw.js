// Vida Financiera — service worker: guarda la app para que funcione sin internet.
// Al publicar una versión nueva, cambia el número de VERSION.
const VERSION = 'vf-v9';
const ARCHIVOS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-512-maskable.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Red primero para la página (así llegan las actualizaciones), caché si no hay internet.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copia = r.clone();
      caches.open(VERSION).then(c => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
