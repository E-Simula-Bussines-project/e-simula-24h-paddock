// Service worker de E-SIMULA 24H Paddock. Sube VERSION al publicar cambios para renovar la caché.
const VERSION = 'v8';
const CACHE = 'e-simula-' + VERSION;
const CORE = ['./', 'index.html', 'perfil.html', 'situacion-financiera.html', 'recursos-humanos.html', 'theme.css', 'assets/marta.jpg', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Red primero (siempre lo último publicado); la caché solo sirve si no hay conexión.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin && !/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname) && !(url.hostname === 'cdn.jsdelivr.net' && url.pathname.startsWith('/gh/faker-js/assets-person-portrait@main/'))) return;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then(r => { if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(CACHE).then(ch => ch.put(req, c)); } return r; })
      .catch(() => caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});