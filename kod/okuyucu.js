// not okuyucu — md.js kullanır
import { mdToHtml } from './md.js';

document.querySelectorAll('nav a[data-f]').forEach(a => {
  a.addEventListener('click', async e => {
    e.preventDefault();
    const f = a.getAttribute('data-f');
    const el = document.getElementById('icerik');
    try {
      const r = await fetch(f);
      if (!r.ok) throw new Error('yok');
      el.innerHTML = mdToHtml(await r.text());
    } catch (err) {
      el.innerHTML = '<p>dosya açılmadı. <code>python3 -m http.server 8000</code></p><p>' + f + '</p>';
    }
  });
});
