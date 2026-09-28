// Finanzas: guarda la app en el celular para que abra sin internet.
const CACHE = "finanzas-v2";
const FILES = [
  "./", "index.html", "manifest.webmanifest",
  "icon-180.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png",
  "bricolage-grotesque-latin-600-normal.woff2", "bricolage-grotesque-latin-700-normal.woff2", "bricolage-grotesque-latin-800-normal.woff2",
  "instrument-sans-latin-400-normal.woff2", "instrument-sans-latin-500-normal.woff2", "instrument-sans-latin-600-normal.woff2"
];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache: "reload"}))))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  // Muestra lo guardado al instante y actualiza en segundo plano.
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, {ignoreSearch: true});
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
