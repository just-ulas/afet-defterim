/** checklist durum motoru — madde id → işaret */
import { oku, yaz } from './depo.js';

const KEY = 'checklist_durum';

export function durumHaritasi() {
  return oku(KEY, {}) || {};
}

export function isaretle(id, deger = true) {
  const h = durumHaritasi();
  h[id] = { ok: !!deger, t: Date.now() };
  yaz(KEY, h);
  return h[id];
}

export function sifirlaGrup(prefix) {
  const h = durumHaritasi();
  Object.keys(h).forEach(k => {
    if (k.startsWith(prefix)) delete h[k];
  });
  yaz(KEY, h);
}

export function ozet(ids) {
  const h = durumHaritasi();
  let ok = 0;
  ids.forEach(id => { if (h[id] && h[id].ok) ok++; });
  return { toplam: ids.length, tamam: ok, yuzde: ids.length ? Math.round((ok / ids.length) * 100) : 0 };
}

export function renderListe(maddeler, root) {
  if (!root) return;
  const h = durumHaritasi();
  root.innerHTML = '';
  const ul = document.createElement('ul');
  ul.className = 'chk-list';
  maddeler.forEach(m => {
    const li = document.createElement('li');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = !!(h[m.id] && h[m.id].ok);
    cb.addEventListener('change', () => isaretle(m.id, cb.checked));
    const sp = document.createElement('span');
    sp.textContent = m.metin;
    li.appendChild(cb);
    li.appendChild(sp);
    ul.appendChild(li);
  });
  root.appendChild(ul);
}
