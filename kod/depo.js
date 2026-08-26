/** localStorage sarmalayıcı — önek + json */
const ON = 'afet:';

export function oku(k, varsayilan = null) {
  try {
    const v = localStorage.getItem(ON + k);
    if (v == null) return varsayilan;
    return JSON.parse(v);
  } catch {
    return varsayilan;
  }
}

export function yaz(k, v) {
  try {
    localStorage.setItem(ON + k, JSON.stringify(v));
    return true;
  } catch {
    return false;
  }
}

export function sil(k) {
  try {
    localStorage.removeItem(ON + k);
  } catch {}
}

export function tumAnahtarlar() {
  const out = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(ON)) out.push(k.slice(ON.length));
  }
  return out;
}

export function disaAktar() {
  const o = {};
  tumAnahtarlar().forEach(k => { o[k] = oku(k); });
  return o;
}

export function iceAktar(obj) {
  if (!obj || typeof obj !== 'object') return 0;
  let n = 0;
  Object.keys(obj).forEach(k => {
    if (yaz(k, obj[k])) n++;
  });
  return n;
}
