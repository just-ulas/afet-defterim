// basit cache. bazen eski dosya kalır hard refresh yap
const AD = 'afet-defter-v3';
const LISTE = [
  './', './index.html', './sos.html',
  './stil/ana.css', './stil/sos.css',
  './kod/okuyucu.js', './kod/sos-giris.js',
  './kod/ses.js', './kod/sarsinti.js', './kod/acil.js',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(AD).then(c => c.addAll(LISTE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== AD).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(x => x || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
