/**
 * enkaz modu — 4 düğme
 * YARDIM: 1.2 sn basılı tut (yanlış basış engeli)
 */
import { dudukBas, dudukBirak, otomatikDuduk } from './ses.js';
import { sarsintiAc } from './sarsinti.js';
import { sosTam, konumAl, mesajYap } from './acil.js';
import { liste as kontakListe, sehirDisiKisi, smsLink } from './kontaklar.js';
import { oku } from './depo.js';
import { formatKonum, googleMaps } from './konum-format.js';
import { bataryaBilgi } from './batarya.js';
import { titres } from './titresim-desen.js';
import { onlineMi, onlineDinle } from './cevrimdisi-kuyruk.js';
import { registerPWA } from './pwa.js';
import { isikAc, isikKapat, isikDurum } from './isik.js';
import { basiliTut } from './geri-sayim.js';
import { artciEkle } from './artci-gunluk.js';
import { wakeAc } from './wake.js';

const durum = document.getElementById('durum');
const btnSes = document.getElementById('btnSes');
const btnIsik = document.getElementById('btnIsik');
const btnYardim = document.getElementById('btnYardim');
const holdBar = document.getElementById('holdBar');
let sesAcik = false;
let yardimKilit = false;

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
  if (yardimKilit) return;
  yardimKilit = true;
  yaz('yardım hazırlanıyor…');
  titres('sos');
  try {
    await sosTam();
    const k = sehirDisiKisi() || kontakListe()[0];
    if (k && k.tel) {
      const loc = await konumAl().catch(() => null);
      let msg = mesajYap(loc);
      setTimeout(() => {
        const link = smsLink(k, msg);
        if (link) window.location.href = link;
      }, 2500);
    }
    yaz('sms / ara — sen onayla');
  } catch (e) {
    yaz('hata: ' + (e.message || e));
  } finally {
    yardimKilit = false;
    if (holdBar) holdBar.style.width = '0%';
  }
}

function yardimHoldBaslat(e) {
  e.preventDefault();
  if (yardimKilit) return;
  basiliTut(btnYardim, 1200, (p) => {
    if (holdBar) holdBar.style.width = (p * 100) + '%';
    yaz('yardım ' + Math.ceil((1 - p) * 1.2) + '…');
  }).then(() => {
    if (holdBar) holdBar.style.width = '100%';
    return yardim();
  }).catch(() => {
    if (holdBar) holdBar.style.width = '0%';
    yaz('iptal — basılı tut');
  });
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
      yaz(t + ' · kopyalandı');
    }
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
    yaz('ses açık');
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
    yaz(ok === 'torch' ? 'flaş açık' : 'ekran ışığı');
  }
}

const sensor = sarsintiAc(
  () => {},
  (sev) => {
    artciEkle(sev, 'otomatik');
    if (sev >= 3) {
      yaz('sert sarsıntı — ses');
      otomatikDuduk(6000);
      titres('sarsinti');
    }
  },
  { mod: 'sert', minPeak: 3, minDurationMs: 400 }
);

btnYardim.addEventListener('pointerdown', yardimHoldBaslat);
document.getElementById('btnKonum').onclick = konumGoster;
btnSes.addEventListener('click', sesToggle);
btnIsik.onclick = isikToggle;

registerPWA();
wakeAc(); // enkazda ekran kapansın istemeyiz
guncelleUst();
setInterval(guncelleUst, 30000);
onlineDinle(() => guncelleUst());

sensor.enable().then(ok => {
  if (ok) yaz(profilOzeti() || 'hazır · yardım için basılı tut');
  else yaz('hazır · dokun + yardım basılı tut');
});
document.body.addEventListener('click', () => { sensor.enable(); }, { once: true });
