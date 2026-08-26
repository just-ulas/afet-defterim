/** hissedilen artçı / sarsıntı kaydı — local */
import { oku, yaz } from './depo.js';

const KEY = 'artci_log';

export function artciEkle(sev, not = '') {
  const L = oku(KEY, []) || [];
  L.unshift({
    t: Date.now(),
    sev: sev || 0,
    not: String(not).slice(0, 120)
  });
  while (L.length > 50) L.pop();
  yaz(KEY, L);
  return L[0];
}

export function artciListe() {
  return oku(KEY, []) || [];
}

export function artciTemizle() {
  yaz(KEY, []);
}

export function artciOzet() {
  const L = artciListe();
  if (!L.length) return 'kayıt yok';
  const son = L[0];
  const dk = Math.round((Date.now() - son.t) / 60000);
  return L.length + ' kayıt · son ' + dk + ' dk önce (sev ' + son.sev + ')';
}
