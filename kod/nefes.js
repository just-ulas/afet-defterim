/** panik için 4-4-4 nefes rehberi (ekran metni) */
export function nefesBaslat(onAsama, tur = 4) {
  let iptal = false;
  const adimlar = [
    { ad: 'nefes al', sn: 4 },
    { ad: 'tut', sn: 4 },
    { ad: 'ver', sn: 4 }
  ];

  const ctrl = { dur() { iptal = true; } };

  (async () => {
    for (let t = 0; t < tur && !iptal; t++) {
      for (const a of adimlar) {
        if (iptal) return;
        for (let s = a.sn; s >= 1 && !iptal; s--) {
          onAsama && onAsama(a.ad + ' · ' + s, t + 1, tur);
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }
    if (!iptal) onAsama && onAsama('bitti — yavaşla', tur, tur);
  })();

  return ctrl;
}
