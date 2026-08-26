/** acil kontak listesi — şehir dışı kişi önemli */
import { oku, yaz } from './depo.js';

const KEY = 'kontaklar';

export function liste() {
  const x = oku(KEY, []);
  return Array.isArray(x) ? x : [];
}

export function ekle(kisi) {
  const L = liste();
  const id = 'k_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const row = {
    id,
    ad: String(kisi.ad || '').trim(),
    tel: String(kisi.tel || '').replace(/\s+/g, ''),
    sehirDisi: !!kisi.sehirDisi,
    not: String(kisi.not || '').slice(0, 200)
  };
  if (!row.ad && !row.tel) throw new Error('ad veya tel lazım');
  L.push(row);
  yaz(KEY, L);
  return row;
}

export function silKontak(id) {
  const L = liste().filter(x => x.id !== id);
  yaz(KEY, L);
  return L.length;
}

export function sehirDisiKisi() {
  return liste().find(x => x.sehirDisi) || liste()[0] || null;
}

export function smsLink(kisi, body) {
  if (!kisi || !kisi.tel) return null;
  return 'sms:' + kisi.tel + '?body=' + encodeURIComponent(body || '');
}
