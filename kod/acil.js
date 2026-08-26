// 112 ve konum. tarayıcı kendi başına arayamaz onu biliyosun
// sms ve tel linki açar sen basarsın

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

export function mesajYap(loc) {
  const satir = ['ACİL DURUM yardım lazım', 'saat: ' + new Date().toLocaleString('tr-TR')];
  if (loc) {
    satir.push('konum: ' + loc.lat.toFixed(5) + ', ' + loc.lon.toFixed(5));
    satir.push('harita: https://maps.google.com/?q=' + loc.lat + ',' + loc.lon);
    if (loc.acc) satir.push('hassasiyet ~' + Math.round(loc.acc) + 'm');
  } else {
    satir.push('konum alınamadı');
  }
  satir.push('(afet-defterim uygulamasından)');
  return satir.join('\n');
}

export function ara112() {
  window.location.href = 'tel:112';
}

export function sms112(body) {
  // android ve ios farklıymış body= ile &body= denedim ikisi de idare eder
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
    } catch (e) {
      // iptal normal
    }
  }

  sms112(msg);
  // iyi niyetli: sms açılsın diye 1.5 sn bekliyorum sonra ara
  // bazen ikisi birden bozuluyo bazen de işe yarıyo
  setTimeout(() => ara112(), 1500);
  return { loc, msg };
}
