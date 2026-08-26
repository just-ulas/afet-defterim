/** kurtarma için aralıklı düdük — pil dostu */
import { dudukBas, dudukBirak } from './ses.js';

let timer = null;
let calisiyor = false;

export function sinyalAcikMi() {
  return calisiyor;
}

export function periyodikBaslat({ herMs = 15000, calMs = 2500, onTick } = {}) {
  periyodikDurdur();
  calisiyor = true;
  const vur = async () => {
    if (!calisiyor) return;
    onTick && onTick('sinyal…');
    try {
      await dudukBas();
      await new Promise(r => setTimeout(r, calMs));
      dudukBirak();
    } catch {}
  };
  vur();
  timer = setInterval(vur, herMs);
}

export function periyodikDurdur() {
  calisiyor = false;
  if (timer) clearInterval(timer);
  timer = null;
  try { dudukBirak(); } catch {}
}
