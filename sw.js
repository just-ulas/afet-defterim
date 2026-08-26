/* pwa v7 — atatürk çıkartması + duruş */
const AD = 'afet-defter-v7';
const LISTE = [
  './', './index.html', './enkaz.html', './sos.html', './profil.html',
  './checklist.html', './araclar.html',
  './stil/ana.css', './stil/sos.css', './stil/enkaz.css', './stil/ataturk.css',
  './kod/okuyucu.js', './kod/sos-giris.js', './kod/enkaz-giris.js',
  './kod/ses.js', './kod/ses-motor.js', './kod/ses-profilleri.js',
  './kod/sarsinti.js', './kod/acil.js', './kod/md.js', './kod/depo.js',
  './kod/checklist-motor.js', './kod/konum-format.js', './kod/kontaklar.js',
  './kod/pwa.js', './kod/isik.js', './kod/geri-sayim.js', './kod/mors.js',
  './kod/periyodik-sinyal.js', './kod/nefes.js', './kod/artci-gunluk.js',
  './kod/pusula.js', './kod/wake.js', './kod/ataturk-cikartma.js',
  './kod/batarya.js', './kod/cevrimdisi-kuyruk.js', './kod/titresim-desen.js',
  './docs/ekran/ataturk-cikartma.svg',
  './veri/checklist/deprem.json', './veri/checklist/yangin.json',
  './veri/checklist/canta.json', './veri/checklist/sel.json',
  './notlar/deprem.md', './notlar/deprem-sonrasi.md', './notlar/sel.md',
  './notlar/yangin.md', './notlar/enkaz.md', './notlar/canta.md',
  './notlar/ilkyardim.md', './notlar/cocuk-kart.md',
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
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => {
        if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
          const k = res.clone();
          caches.open(AD).then(c => c.put(e.request, k));
        }
        return res;
      }).catch(() => cached || caches.match('./enkaz.html'));
      return cached || net;
    })
  );
});
