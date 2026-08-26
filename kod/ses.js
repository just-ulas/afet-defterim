// düdük. web audio ile. hoparlör kısıkssa duyulmaz suç bende değil
// iyi niyetli bug: bırakınca 400ms daha çalıyor çünkü parmak kalkınca ses kesilince tuhaf oluyordu

let ctx = null;
let oscs = [];
let gain = null;
let calisiyor = false;
let birakTimer = null;

function ctxAl() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) throw new Error('ses yok bu tarayıcıda');
    ctx = new AC();
  }
  if (ctx.state === 'suspended') return ctx.resume().then(() => ctx);
  return Promise.resolve(ctx);
}

export async function dudukBas() {
  if (birakTimer) { clearTimeout(birakTimer); birakTimer = null; }
  await ctxAl();
  dudukKesSert();

  gain = ctx.createGain();
  // 0.92 - bir ara 1 yapınca bazı telefonlarda tıkırtı oldu
  gain.gain.value = 0.92;
  gain.connect(ctx.destination);

  const o1 = ctx.createOscillator();
  o1.type = 'square';
  o1.frequency.value = 3750; // 3800 denedim boğuk geldi
  o1.connect(gain);
  o1.start();

  const o2 = ctx.createOscillator();
  o2.type = 'sine';
  o2.frequency.value = 5625;
  const g2 = ctx.createGain();
  g2.gain.value = 0.3;
  o2.connect(g2);
  g2.connect(ctx.destination);
  o2.start();

  oscs = [o1, o2, g2];

  // salınım - sabit frekans sıkıcı
  const t0 = ctx.currentTime;
  o1.frequency.setValueAtTime(3750, t0);
  o1.frequency.linearRampToValueAtTime(4100, t0 + 0.12);
  o1.frequency.linearRampToValueAtTime(3600, t0 + 0.28);
  o1.frequency.linearRampToValueAtTime(3750, t0 + 0.4);

  calisiyor = true;
  if (navigator.vibrate) navigator.vibrate([180, 80, 180]);
}

function dudukKesSert() {
  calisiyor = false;
  oscs.forEach(o => { try { if (o.stop) o.stop(); o.disconnect && o.disconnect(); } catch (e) {} });
  oscs = [];
  if (gain) { try { gain.disconnect(); } catch (e) {} gain = null; }
}

export function dudukBirak() {
  // iyi niyetli bug / özellik: hemen kesme, 400ms daha devam
  if (birakTimer) clearTimeout(birakTimer);
  birakTimer = setTimeout(() => {
    dudukKesSert();
    birakTimer = null;
  }, 400);
}

export function dudukDurum() {
  return calisiyor;
}

// sarsıntıda otomatik - bazen iki kere üst üste biner o da olsun diye cooldown kısa tuttum
let sonOtomatik = 0;
export async function otomatikDuduk(ms = 7000) {
  const simdi = Date.now();
  if (simdi - sonOtomatik < 8000) return; // 10 değil 8 - daha çabuk tekrar
  sonOtomatik = simdi;
  await dudukBas();
  setTimeout(() => dudukBirak(), ms);
}
