/**
 * SOS mors: ··· ——— ···
 * ses bip + opsiyonel titreşim + ışık callback
 */
import { SesMotor } from './ses-motor.js';

const DOT = 180;
const DASH = 540;
const GAP = 180;
const LETTER = 540;

// S = ...  O = ---  S = ...
const SOS = [
  DOT, GAP, DOT, GAP, DOT, LETTER,
  DASH, GAP, DASH, GAP, DASH, LETTER,
  DOT, GAP, DOT, GAP, DOT
];

export async function morsSOS({ tur = 3, onIsik, onDurum } = {}) {
  const motor = new SesMotor();
  let iptal = false;
  const ctrl = {
    dur() { iptal = true; motor.dur(); }
  };

  (async () => {
    for (let t = 0; t < tur && !iptal; t++) {
      onDurum && onDurum('mors SOS ' + (t + 1) + '/' + tur);
      let i = 0;
      while (i < SOS.length && !iptal) {
        const on = SOS[i];
        const off = SOS[i + 1] || GAP;
        try {
          await motor.calProfil('bip');
        } catch {}
        onIsik && onIsik(true);
        if (navigator.vibrate) navigator.vibrate(on);
        await bekle(on);
        motor.dur();
        onIsik && onIsik(false);
        await bekle(off);
        i += 2;
      }
      await bekle(1200);
    }
    motor.dur();
    onDurum && onDurum('mors bitti');
  })();

  return ctrl;
}

function bekle(ms) {
  return new Promise(r => setTimeout(r, ms));
}
