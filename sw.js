const VERSION = 'v15';
const CACHE = 'e-simula-' + VERSION;
const CORE = [
  "./",
  "assets/circuito-01.webp",
  "assets/circuito-02.webp",
  "assets/gt.webp",
  "assets/pista.webp",
  "assets/rrhh-01.webp",
  "assets/rrhh-02.webp",
  "assets/rrhh-03.webp",
  "assets/rrhh-04.webp",
  "assets/rrhh-05.webp",
  "assets/rrhh-06.webp",
  "assets/rrhh-07.webp",
  "assets/rrhh-08.webp",
  "assets/rrhh-09.webp",
  "assets/rrhh-10.webp",
  "assets/rrhh-11.webp",
  "assets/usuario-01.webp",
  "assets/usuario-02.webp",
  "assets/usuario-03.webp",
  "assets/usuario-04.webp",
  "assets/usuario-05.webp",
  "assets/usuario-06.webp",
  "assets/usuario-07.webp",
  "assets/usuario-08.webp",
  "assets/usuario-09.webp",
  "assets/usuario-10.webp",
  "assets/usuario-11.webp",
  "assets/usuario-12.webp",
  "assets/usuario-13.webp",
  "assets/usuario-14.webp",
  "assets/usuario-15.webp",
  "assets/usuario-16.webp",
  "assets/usuario-17.webp",
  "assets/usuario-18.webp",
  "css/dashboard.css",
  "css/finanzas.css",
  "css/layout.css",
  "css/login.css",
  "css/menu.css",
  "css/perfil.css",
  "css/recursos-humanos.css",
  "css/theme.css",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "index.html",
  "js/dashboard.js",
  "js/finanzas.js",
  "js/login.js",
  "js/menu.js",
  "js/perfil.js",
  "js/pwa.js",
  "js/recursos-humanos.js",
  "js/sesion.js",
  "js/types.js",
  "manifest.webmanifest",
  "pages/admin.html",
  "pages/login.html",
  "pages/perfil.html",
  "pages/profesor.html",
  "pages/recursos-humanos.html",
  "pages/situacion-financiera.html"
];
self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('e-simula-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
    e.respondWith(fetch(req, {cache: 'no-cache'}).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
    }).catch(() => caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('pages/login.html') : Response.error()))));
});
