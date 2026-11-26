// Service worker de E-SIMULA 24H Paddock. Sube VERSION al publicar cambios para renovar la caché.
const VERSION = 'v13';
const CACHE = 'e-simula-' + VERSION;
const CORE = ["./","index.html","perfil.html","situacion-financiera.html","recursos-humanos.html","theme.css","dashboard.css","menu.css","menu.js","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png","icons/icon-maskable-512.png","assets/pista.webp","assets/usuario-01.webp","assets/gt.webp","assets/usuario-02.webp","assets/usuario-03.webp","assets/usuario-04.webp","assets/usuario-05.webp","assets/usuario-06.webp","assets/usuario-07.webp","assets/usuario-08.webp","assets/usuario-09.webp","assets/usuario-10.webp","assets/usuario-11.webp","assets/usuario-12.webp","assets/usuario-13.webp","assets/usuario-14.webp","assets/usuario-15.webp","assets/usuario-16.webp","assets/usuario-17.webp","assets/usuario-18.webp","assets/rrhh-01.webp","assets/rrhh-02.webp","assets/rrhh-03.webp","assets/rrhh-04.webp","assets/rrhh-05.webp","assets/rrhh-06.webp","assets/rrhh-07.webp","assets/rrhh-08.webp","assets/rrhh-09.webp","assets/rrhh-10.webp","assets/rrhh-11.webp"];

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
  if (url.origin !== location.origin && !/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) return;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then(r => { if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(CACHE).then(ch => ch.put(req, c)); } return r; })
      .catch(() => caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});