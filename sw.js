const C = 'cat-parade-v18';
const ASSETS = ['./','./index.html','./index.js','./index.wasm','./index.pck','./index.audio.worklet.js','./index.audio.position.worklet.js','./index.icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// NETWORK-FIRST: players always get the live build when online; cache is offline fallback only.
// (v16 lesson: cache-first + ignoreSearch kept serving the old .pck under a stale SW forever)
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(C).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./')))
  );
});
