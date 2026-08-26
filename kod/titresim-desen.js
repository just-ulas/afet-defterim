/** titreşim kalıpları */
export const DESEN = {
  kisa: [80],
  cift: [100, 60, 100],
  sos: [200, 100, 200, 100, 200, 300, 500, 100, 500, 100, 500, 300, 200, 100, 200, 100, 200],
  sarsinti: [80, 40, 80, 40, 200, 80, 80],
  basari: [50, 30, 50],
  hata: [300, 100, 300]
};

export function titres(adVeyaDizi) {
  if (!navigator.vibrate) return false;
  const p = typeof adVeyaDizi === 'string' ? DESEN[adVeyaDizi] : adVeyaDizi;
  if (!p) return false;
  return navigator.vibrate(p);
}
