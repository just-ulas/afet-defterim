/**
 * sarsıntı algılama — yürüyüş false positive azaltma
 *
 * fikir:
 * - baseline yerçekimi
 * - delta + kısa pencerede tepe sayısı (peak)
 * - tek darbe (adım) ≠ sürekli sarsıntı
 * - mod: 'hassas' | 'normal' | 'sert'
 *
 * bu sismograf değil. telefonun hareketini ölçer.
 */

const MODLAR = {
  hassas: { sev1: 2.0, sev2: 4.5, sev3: 9, minPeak: 2, minDurationMs: 250, cooldown: 12000 },
  normal: { sev1: 2.8, sev2: 6.0, sev3: 11, minPeak: 3, minDurationMs: 350, cooldown: 15000 },
  sert: { sev1: 4.0, sev2: 8.0, sev3: 14, minPeak: 3, minDurationMs: 450, cooldown: 18000 }
};

export function sarsintiAc(cbSeviye, cbQuake, opts = {}) {
  const modAd = opts.mod && MODLAR[opts.mod] ? opts.mod : 'normal';
  const cfg = { ...MODLAR[modAd] };
  if (opts.minPeak != null) cfg.minPeak = opts.minPeak;
  if (opts.minDurationMs != null) cfg.minDurationMs = opts.minDurationMs;

  let acik = false;
  let baseline = 9.81;
  const buf = [];
  let sonQuake = 0;
  let windowStart = 0;
  let peakCount = 0;
  let lastAbove = false;
  let sustainedStart = 0;

  function onMotion(e) {
    // mümkünse yerçekimsiz ivme (yürüme daha az karışır)
    const a = e.acceleration || e.accelerationIncludingGravity;
    if (!a || a.x == null) return;

    const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    // acceleration (yerçekimsiz) varsa baseline ~0; includingGravity ise ~9.8
    const usingGravity = !e.acceleration || e.acceleration.x == null;
    const ref = usingGravity ? baseline : 0;

    buf.push(mag);
    if (buf.length > 20) buf.shift();

    if (usingGravity) {
      const avg = buf.reduce((s, v) => s + v, 0) / buf.length;
      // sadece sakinken baseline güncelle
      if (Math.abs(avg - baseline) < 1.2) {
        baseline = baseline * 0.98 + avg * 0.02;
      }
    }

    const delta = Math.abs(mag - ref);
    let seviye = 0;
    if (delta > cfg.sev3) seviye = 3;
    else if (delta > cfg.sev2) seviye = 2;
    else if (delta > cfg.sev1) seviye = 1;

    cbSeviye && cbSeviye(seviye, delta);

    const now = Date.now();
    const above = seviye >= 2;

    // peak: eşiğin altına inip tekrar çıkmak = 1 tepe (adım tek tepe üretir)
    if (above && !lastAbove) {
      peakCount++;
      if (!windowStart) windowStart = now;
      if (!sustainedStart) sustainedStart = now;
    }
    if (!above) {
      sustainedStart = 0;
    }
    lastAbove = above;

    // 1.2 sn pencerede tepe sayısını sıfırla
    if (windowStart && now - windowStart > 1200) {
      peakCount = above ? 1 : 0;
      windowStart = above ? now : 0;
    }

    const sustained = sustainedStart && (now - sustainedStart) >= cfg.minDurationMs;
    const enoughPeaks = peakCount >= cfg.minPeak;

    // tetik: ya sürekli sarsıntı ya da birden fazla tepe (deprem benzeri)
    // tek adım genelde 1 peak + kısa süre → reddedilir
    if (seviye >= 2 && (sustained || enoughPeaks)) {
      if (now - sonQuake > cfg.cooldown) {
        // ekstra: çok düşük frekanslı tek spike engeli
        if (peakCount === 1 && !sustained) return;
        sonQuake = now;
        peakCount = 0;
        windowStart = 0;
        sustainedStart = 0;
        cbQuake && cbQuake(seviye, { delta, mod: modAd });
      }
    }
  }

  async function enable() {
    if (acik) return true;
    if (typeof DeviceMotionEvent !== 'undefined' && DeviceMotionEvent.requestPermission) {
      try {
        const st = await DeviceMotionEvent.requestPermission();
        if (st !== 'granted') return false;
      } catch {
        return false;
      }
    }
    if (!window.DeviceMotionEvent) return false;
    window.addEventListener('devicemotion', onMotion, { passive: true });
    acik = true;
    return true;
  }

  function disable() {
    window.removeEventListener('devicemotion', onMotion);
    acik = false;
  }

  function setMod(ad) {
    if (MODLAR[ad]) {
      Object.assign(cfg, MODLAR[ad]);
    }
  }

  return { enable, disable, isAcik: () => acik, setMod, mod: () => modAd };
}
