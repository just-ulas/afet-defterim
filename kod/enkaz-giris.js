/**
 * enkaz modu — 4 düğme, az dikkat, çok dokunma
 */
import { dudukBas, dudukBirak, otomatikDuduk } from './ses.js';
import { sarsintiAc } from './sarsinti.js';
import { sosTam, konumAl, mesajYap, sms112 } from './acil.js';
import { liste as kontakListe, sehirDisiKisi, smsLink } from './kontaklar.js';
import { oku } from './depo.js';
import { formatKonum, googleMaps } from './konum-format.js';
import { bataryaBilgi } from './batarya.js';
import { titres } from './titresim-desen.js';
import { onlineMi, onlineDinle } from './cevrimdisi-kuyruk.js';
import { registerPWA } from './pwa.js';
import { isikAc, isikKapat, isikDurum } from './isik.js';

const durum = document.getElementById('durum');
const btnSes = document.getElementById('btnSes');
const btnIsik = document.getElementById('btnIsik');
let sesAcik = false;

function yaz(t) {
  if (durum) durum.textContent = t || '';
}

async function guncelleUst() {
  const bat = document.getElementById('bat');
  const net = document.getElementById('net');
  if (net) net.textContent = onlineMi() ? 'net var' : 'net yok';
  const b = await bataryaBilgi();
  if (bat) {
    bat.textContent = b ? ('pil %' + b.seviye + (b.sarj ? ' ⚡' : '')) : 'pil ?';
  }
}

function profilOzeti() {
  const p = oku('profil', {}) || {};
  const parca = [];
  if (p.ad) parca.push('ad: ' + p.ad);
  if (p.kan) parca.push('kan: ' + p.kan);
  return parca.join(' · ');
}

async function yardim() {
  yaz('yardım hazırlanıyor…');
  titres('sos');
  try {
    await sosTam();
    // acil kişilere de sms taslağı (ilk kişi)
    const k = sehirDisiKisi() || kontakListe()[0];
    if (k && k.tel) {
      const loc = await konumAl().catch(() => null);
      let msg = mesajYap(loc);
      const p = oku('profil', {}) || {};
      if (p.kan) msg += '\nkan grubu: ' + p.kan;
      if (p.not) msg += '\nnot: ' + p.not;
      msg = 'ACİL DURUM. ' + (p.durum === 'iyiyim' ? 'Ben iyiyim ama haber veriyorum.\n' : 'Yardıma ihtiyacım var.\n') + msg;
      // biraz bekle 112 sms açılsın diye, sonra kişi
      setTimeout(() => {
        const link = smsLink(k, msg);
        if (link) window.location.href = link;
      }, 2500);
    }
    yaz('sms / ara ekranı — sen onayla');
  } catch (e) {
    yaz('hata: ' + (e.message || e));
  }
}

async function konumGoster() {
  yaz('konum alınıyor…');
  try {
    const loc = await konumAl();
    const t = formatKonum(loc);
    yaz(t);
    const msg = mesajYap(loc);
    if (navigator.share) {
      try { await navigator.share({ title: 'konumum', text: msg }); } catch {}
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(msg);
      yaz(t + ' · panoya kopyalandı');
    }
    // harita linki opsiyonel
    const maps = googleMaps(loc);
    if (maps && confirm(t + '\n\nharitayı aç?')) {
      window.open(maps, '_blank');
    }
  } catch (e) {
    yaz('konum yok — izin ver');
  }
}

function sesToggle(e) {
  e.preventDefault();
  if (!sesAcik) {
    dudukBas();
    sesAcik = true;
    btnSes.classList.add('aktif');
    yaz('ses açık — tekrar bas durdur');
    titres('cift');
  } else {
    dudukBirak();
    sesAcik = false;
    btnSes.classList.remove('aktif');
    yaz('ses kapalı');
  }
}

async function isikToggle() {
  if (isikDurum()) {
    await isikKapat();
    btnIsik.classList.remove('aktif');
    yaz('ışık kapalı');
  } else {
    const ok = await isikAc();
    btnIsik.classList.add('aktif');
    yaz(ok === 'torch' ? 'flaş açık' : 'ekran ışığı açık — tekrar bas kapat');
  }
}

// sarsıntı: enkazdayken sadece güçlü sarsıntıda ses (gelişmiş filtre)
const sensor = sarsintiAc(
  () => {},
  (sev) => {
    if (sev >= 3) {
      yaz('sert sarsıntı — ses');
      otomatikDuduk(6000);
      titres('sarsinti');
    }
  },
  { mod: 'sert', minPeak: 3, minDurationMs: 400 }
);

document.getElementById('btnYardim').onclick = yardim;
document.getElementById('btnKonum').onclick = konumGoster;
btnSes.addEventListener('click', sesToggle);
btnIsik.onclick = isikToggle;

// uzun basış ses için de çalışsın
btnSes.addEventListener('touchstart', e => {
  if (!sesAcik) { e.preventDefault(); dudukBas(); sesAcik = true; btnSes.classList.add('aktif'); yaz('ses'); }
}, { passive: false });
btnSes.addEventListener('touchend', () => {
  // toggle mantığı click'te; burada bırakma ile kesme istemiyoruz enkazda
});

registerPWA();
guncelleUst();
setInterval(guncelleUst, 30000);
onlineDinle(() => guncelleUst());

// sensörü sessizce dene (izin isterse kullanıcı jesti lazım olabilir)
sensor.enable().then(ok => {
  if (ok) yaz('hazır');
  else yaz('hazır · sensör için bir yere dokun');
});
document.body.addEventListener('click', () => {
  sensor.enable();
}, { once: true });

const o = profilOzeti();
if (o) yaz(o);
