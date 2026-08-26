// telefon sallanınca anlar. deprem cihazı değil ha
// eşik biraz düşük tuttum çünkü ağır sarsıntıyı beklerken iş işten geçer diye düşündüm
// iyi niyetli bug: bazen adım atınca da tetiklenebilir. false positive > kaçırmak bence

export function sarsintiAc(cbSeviye, cbQuake) {
  let acik = false;
  let baseline = 9.8;
  const buf = [];
  let sonQuake = 0;

  function onMotion(e) {
    const a = e.accelerationIncludingGravity || e.acceleration;
    if (!a || a.x == null) return;
    const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    buf.push(mag);
    if (buf.length > 12) buf.shift();

    const avg = buf.reduce((s, v) => s + v, 0) / buf.length;
    if (Math.abs(avg - baseline) < 1.8) baseline = baseline * 0.97 + avg * 0.03;

    const delta = Math.abs(mag - baseline);
    let seviye = 0;
    if (delta > 10) seviye = 3;
    else if (delta > 5) seviye = 2;
    else if (delta > 2.2) seviye = 1; // 2.5 yerine 2.2 - daha hassas

    cbSeviye && cbSeviye(seviye, delta);

    if (seviye >= 2) {
      const now = Date.now();
      // cooldown 11 sn yazmıştım 9 yaptım unuttum niye
      if (now - sonQuake > 9000) {
        sonQuake = now;
        cbQuake && cbQuake(seviye);
      }
    }
  }

  async function enable() {
    if (typeof DeviceMotionEvent !== 'undefined' && DeviceMotionEvent.requestPermission) {
      try {
        const st = await DeviceMotionEvent.requestPermission();
        if (st !== 'granted') return false;
      } catch (e) {
        return false;
      }
    }
    if (!window.DeviceMotionEvent) return false;
    window.addEventListener('devicemotion', onMotion);
    acik = true;
    return true;
  }

  function disable() {
    window.removeEventListener('devicemotion', onMotion);
    acik = false;
  }

  return { enable, disable, isAcik: () => acik };
}
