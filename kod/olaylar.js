/** mini event bus */
const dinleyiciler = new Map();

export function on(ad, fn) {
  if (!dinleyiciler.has(ad)) dinleyiciler.set(ad, new Set());
  dinleyiciler.get(ad).add(fn);
  return () => off(ad, fn);
}

export function off(ad, fn) {
  const s = dinleyiciler.get(ad);
  if (s) s.delete(fn);
}

export function emit(ad, veri) {
  const s = dinleyiciler.get(ad);
  if (!s) return;
  s.forEach(fn => {
    try { fn(veri); } catch (e) { console.warn('olay hata', ad, e); }
  });
}

export const O = {
  SARSINTI: 'sarsinti',
  DUDAK: 'duduk',
  SOS: 'sos',
  KONUM: 'konum',
  CHK: 'checklist'
};
