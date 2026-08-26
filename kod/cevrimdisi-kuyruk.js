/** net yokken kaydedilen sos denemeleri — net gelince kullanıcıya hatırlat */
import { oku, yaz } from './depo.js';

const KEY = 'sos_kuyruk';

export function kuyrugaEkle(kayit) {
  const L = oku(KEY, []) || [];
  L.push({
    t: Date.now(),
    msg: kayit.msg || '',
    loc: kayit.loc || null,
    neden: kayit.neden || 'sos'
  });
  // max 20
  while (L.length > 20) L.shift();
  yaz(KEY, L);
  return L.length;
}

export function kuyrukListe() {
  return oku(KEY, []) || [];
}

export function kuyrukTemizle() {
  yaz(KEY, []);
}

export function onlineMi() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export function onlineDinle(fn) {
  if (typeof window === 'undefined') return () => {};
  const a = () => fn(true);
  const b = () => fn(false);
  window.addEventListener('online', a);
  window.addEventListener('offline', b);
  return () => {
    window.removeEventListener('online', a);
    window.removeEventListener('offline', b);
  };
}
