/* pwa cache v5 — enkaz + profil + offline notlar + güncelleme */
const AD = 'afet-defter-v5';
const LISTE = [
  './',
  './index.html',
  './enkaz.html',
  './sos.html',
  './profil.html',
  './checklist.html',
  './stil/ana.css',
  './stil/sos.css',
  './stil/enkaz.css',
  './kod/okuyucu.js',
  './kod/sos-giris.js',
  './kod/enkaz-giris.js',
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
  './kod/pwa.js',
  './kod/isik.js',
  './kod/guvenli-baglam.js',
  './kod/zaman.js',
  './veri/checklist/deprem.json',
  './veri/checklist/yangin.json',
  './veri/checklist/canta.json',
  './veri/checklist/sel.json',
  './veri/numaralar-tr.json',
  './notlar/deprem.md',
  './notlar/deprem-sonrasi.md',
  './notlar/sel.md',
  './notlar/yangin.md',
  './notlar/enkaz.md',
  './notlar/canta.md',
  './notlar/ilkyardim.md',
  './notlar/cocuk-kart.md',
  './notlar/tahliye.md',
  './notlar/iletisim.md',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(AD).then(c => c.addAll(LISTE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks =>
      Promise.all(ks.filter(k => k !== AD).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  e.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
          const kopya = res.clone();
          caches.open(AD).then(c => c.put(req, kopya));
        }
        return res;
      }).catch(() => cached || caches.match('./enkaz.html') || caches.match('./index.html'));

      // stale-while-revalidate: cache varsa hemen ver, arkada güncelle
      return cached || network;
    })
  );
});
