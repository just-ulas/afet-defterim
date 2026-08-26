// 112 ve konum. tarayıcı kendi başına arayamaz
import { oku } from './depo.js';

export function konumAl() {
  return new Promise((ok, no) => {
    if (!navigator.geolocation) return no(new Error('konum yok'));
    navigator.geolocation.getCurrentPosition(
      p => ok({
        lat: p.coords.latitude,
        lon: p.coords.longitude,
        acc: p.coords.accuracy
      }),
      no,
      { enableHighAccuracy: true, timeout: 14000, maximumAge: 0 }
    );
  });
}

export function mesajYap(loc, ekstra = {}) {
  const p = oku('profil', {}) || {};
  const durum = ekstra.durum || p.durum || 'yardim';
  const bas = durum === 'iyiyim'
    ? 'ACİL DURUM. Ben iyiyim, haber veriyorum.'
    : 'ACİL DURUM. Yardıma ihtiyacım var.';

  const satir = [bas, 'saat: ' + new Date().toLocaleString('tr-TR')];
  if (p.ad) satir.push('ad: ' + p.ad);
  if (p.kan) satir.push('kan: ' + p.kan);
  if (p.not) satir.push('not: ' + p.not);

  if (loc) {
    satir.push('konum: ' + loc.lat.toFixed(5) + ', ' + loc.lon.toFixed(5));
    satir.push('harita: https://maps.google.com/?q=' + loc.lat + ',' + loc.lon);
    if (loc.acc) satir.push('hassasiyet ~' + Math.round(loc.acc) + 'm');
  } else {
    satir.push('konum alınamadı');
  }
  satir.push('(afet-defterim)');
  return satir.join('\n');
}

export function ara112() {
  window.location.href = 'tel:112';
}

export function sms112(body) {
  window.location.href = 'sms:112?body=' + encodeURIComponent(body);
}

export async function sosTam() {
  let loc = null;
  try { loc = await konumAl(); } catch (e) {}
  const msg = mesajYap(loc);

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(msg);
    }
  } catch (e) {}

  if (navigator.share) {
    try {
      await navigator.share({ title: 'acil', text: msg });
    } catch (e) {}
  }

  sms112(msg);
  setTimeout(() => ara112(), 1500);
  return { loc, msg };
}
