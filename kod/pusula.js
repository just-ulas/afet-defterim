/** cihaz yönü — destek varsa */
export function pusulaDinle(cb) {
  function onOri(e) {
    // webkitCompassHeading (ios) veya alpha
    let deg = null;
    if (typeof e.webkitCompassHeading === 'number') {
      deg = e.webkitCompassHeading;
    } else if (typeof e.alpha === 'number') {
      deg = 360 - e.alpha;
    }
    if (deg == null) return;
    deg = ((deg % 360) + 360) % 360;
    cb(deg, yonAd(deg));
  }

  async function enable() {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        DeviceOrientationEvent.requestPermission) {
      try {
        const st = await DeviceOrientationEvent.requestPermission();
        if (st !== 'granted') return false;
      } catch {
        return false;
      }
    }
    window.addEventListener('deviceorientation', onOri, true);
    return true;
  }

  function disable() {
    window.removeEventListener('deviceorientation', onOri, true);
  }

  return { enable, disable };
}

function yonAd(deg) {
  const names = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'];
  const i = Math.round(deg / 45) % 8;
  return names[i];
}
