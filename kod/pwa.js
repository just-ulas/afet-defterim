/**
 * service worker kayıt + güncelleme banner
 */
export function registerPWA() {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol === 'file:') return;

  navigator.serviceWorker.register('./sw.js').then(reg => {
    // periyodik kontrol
    setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);

    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      if (!nw) return;
      nw.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) {
          gosterGuncelle(reg);
        }
      });
    });
  }).catch(() => {});

  // kontrolcü değişince yenile
  let yenileniyor = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (yenileniyor) return;
    yenileniyor = true;
    location.reload();
  });
}

function gosterGuncelle(reg) {
  const ban = document.getElementById('sw-banner');
  const btn = document.getElementById('btnSwGuncelle');
  if (!ban || !btn) return;
  ban.classList.remove('gizli');
  btn.onclick = () => {
    const w = reg.waiting;
    if (w) w.postMessage({ type: 'SKIP_WAITING' });
    else location.reload();
  };
}
