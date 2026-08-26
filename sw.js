// cache v4 — checklist ve yeni kodlar eklendi
const AD = 'afet-defter-v4';
const LISTE = [
  './',
  './index.html',
  './sos.html',
  './checklist.html',
  './stil/ana.css',
  './stil/sos.css',
  './kod/okuyucu.js',
  './kod/sos-giris.js',
  './kod/ses.js',
  './kod/ses-motor.js',
  './kod/ses-profilleri.js',
  './kod/sarsinti.js',
  './kod/acil.js',
  './kod/md.js',
  './kod/depo.js',
  './kod/checklist-motor.js',
  './kod/konum-format.js',
  './kod/kontaklar.js',
  './kod/olaylar.js',
  './kod/sayac.js',
  './kod/titresim-desen.js',
  './kod/ui-toast.js',
  './kod/ui-modal.js',
  './kod/cevrimdisi-kuyruk.js',
  './kod/batarya.js',
  './veri/checklist/deprem.json',
  './veri/checklist/yangin.json',
  './veri/checklist/canta.json',
  './veri/checklist/sel.json',
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
    caches.match(e.request).then(x => {
      if (x) return x;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const kopya = res.clone();
        caches.open(AD).then(c => c.put(e.request, kopya));
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
