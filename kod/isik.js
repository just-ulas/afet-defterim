/**
 * flaş (torch) veya tam ekran beyaz ışık yedek
 * MediaStream torch constraint — destekleyen android chrome
 */
let stream = null;
let track = null;
let ekranAcik = false;

export function isikDurum() {
  return !!(track && track.getConstraints) || ekranAcik;
}

export async function isikAc() {
  // önce torch dene
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    track = stream.getVideoTracks()[0];
    const caps = track.getCapabilities && track.getCapabilities();
    if (caps && caps.torch) {
      await track.applyConstraints({ advanced: [{ torch: true }] });
      return 'torch';
    }
    // torch yok — kamerayı kapat, ekran ışığına düş
    track.stop();
    stream.getTracks().forEach(t => t.stop());
    stream = null;
    track = null;
  } catch {
    // izin yok / destek yok
  }
  const ov = document.getElementById('isik-overlay');
  if (ov) {
    ov.classList.remove('gizli');
    ov.setAttribute('aria-hidden', 'false');
    ov.onclick = () => isikKapat();
  }
  ekranAcik = true;
  // parlaklık için ekranı uyanık tutmaya çalış
  try {
    if (navigator.wakeLock) {
      await navigator.wakeLock.request('screen');
    }
  } catch {}
  return 'screen';
}

export async function isikKapat() {
  if (track) {
    try {
      await track.applyConstraints({ advanced: [{ torch: false }] });
    } catch {}
    try { track.stop(); } catch {}
    track = null;
  }
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
  const ov = document.getElementById('isik-overlay');
  if (ov) {
    ov.classList.add('gizli');
    ov.setAttribute('aria-hidden', 'true');
  }
  ekranAcik = false;
}
