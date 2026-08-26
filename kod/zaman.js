/** tr tarih/saat yardımcı */
export function simdiMetin() {
  return new Date().toLocaleString('tr-TR');
}

export function iso() {
  return new Date().toISOString();
}

export function gecenSn(ts) {
  return Math.round((Date.now() - ts) / 1000);
}

export function formatSure(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return s + ' sn';
  const m = Math.floor(s / 60);
  if (m < 60) return m + ' dk';
  return Math.floor(m / 60) + ' sa ' + (m % 60) + ' dk';
}
