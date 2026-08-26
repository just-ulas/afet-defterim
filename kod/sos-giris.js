import { dudukBas, dudukBirak, otomatikDuduk } from './ses.js';
import { sarsintiAc } from './sarsinti.js';
import { sosTam, konumAl, mesajYap, sms112 } from './acil.js';
import { sosSayArtir, sosSayOku } from './sayac.js';

const ust = document.getElementById('ust');
const logEl = document.getElementById('log');

function yaz(t) {
  ust.textContent = t;
}

function log(t) {
  const d = document.createElement('div');
  d.textContent = new Date().toLocaleTimeString('tr-TR') + ' ' + t;
  logEl.prepend(d);
  // 35 diye yazmıştım 42 kaldı. ne farkeder
  while (logEl.children.length > 42) logEl.lastChild.remove();
}

const sensor = sarsintiAc(
  (sev) => { document.getElementById('s2').textContent = sev; },
  (sev) => {
    log('sarsıntı seviye ' + sev);
    yaz('sarsıntı — düdük');
    otomatikDuduk(7500);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 300]);
  }
);

document.getElementById('btnSens').onclick = async () => {
  const ok = await sensor.enable();
  document.getElementById('s1').textContent = ok ? 'açık' : 'izin yok';
  log(ok ? 'sensör açıldı' : 'sensör açılamadı');
  yaz(ok ? 'sensör açık' : 'sensör yok');
};

const dud = document.getElementById('btnDud');
const bas = (e) => { e.preventDefault(); dudukBas(); yaz('DÜDÜK'); log('düdük bas'); };
const birak = (e) => { e.preventDefault(); dudukBirak(); yaz('hazır'); };
dud.addEventListener('mousedown', bas);
dud.addEventListener('mouseup', birak);
dud.addEventListener('mouseleave', birak);
dud.addEventListener('touchstart', bas, { passive: false });
dud.addEventListener('touchend', birak);
dud.addEventListener('touchcancel', birak);

document.getElementById('btnSos').onclick = async () => {
  yaz('sos...');
  log('sos başladı');
  const kac = sosSayArtir();
  log('sos sayacı ' + kac);
  try {
    await sosTam();
    yaz('sms/ara ekranı açıldı — sen onayla');
    log('sos yönlendirildi');
  } catch (e) {
    log('sos hata ' + e.message);
    yaz('bir şey ters gitti');
  }
};

document.getElementById('btnKonum').onclick = async () => {
  try {
    const l = await konumAl();
    alert(l.lat.toFixed(5) + ', ' + l.lon.toFixed(5));
    log('konum ok');
  } catch (e) {
    alert('konum yok: ' + e.message);
  }
};

document.getElementById('btnSms').onclick = async () => {
  let l = null;
  try { l = await konumAl(); } catch (e) {}
  sms112(mesajYap(l));
};

document.getElementById('btnPaylas').onclick = async () => {
  let l = null;
  try { l = await konumAl(); } catch (e) {}
  const m = mesajYap(l);
  if (navigator.share) {
    try { await navigator.share({ text: m }); } catch (e) {}
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(m);
    alert('panoya kopyalandı');
  }
};

document.getElementById('btnTitre').onclick = () => {
  if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500, 100, 200, 100, 200]);
  else alert('titreşim yok');
};

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

log('panel açıldı (sos sayacı: ' + sosSayOku() + ')');
