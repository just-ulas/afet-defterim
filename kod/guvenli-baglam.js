/** https / localhost kontrolü — sensör ve sw için */
export function guvenliMi() {
  if (typeof window === 'undefined') return false;
  if (window.isSecureContext) return true;
  const h = location.hostname;
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]';
}

export function protokolUyarisi() {
  if (location.protocol === 'file:') {
    return 'file:// ile açtın. sensör ve fetch bozulabilir. python3 -m http.server 8000 dene.';
  }
  if (!guvenliMi()) {
    return 'güvenli bağlam yok (https veya localhost lazım olabilir).';
  }
  return null;
}
