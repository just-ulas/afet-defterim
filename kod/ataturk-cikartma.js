/** sol alt: 1881 - 193∞ */
export function yerlestirAtaturk() {
  if (document.getElementById('ataturk-cikartma')) return;

  if (!document.querySelector('link[data-ataturk-css]')) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'stil/ataturk.css';
    l.setAttribute('data-ataturk-css', '1');
    document.head.appendChild(l);
  }

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'ataturk-cikartma';
  btn.className = 'ataturk-cikartma';
  btn.title = '1881 — 193∞';
  btn.setAttribute('aria-label', '1881 - 193 sonsuz');
  btn.innerHTML = '<img src="docs/ekran/1881.svg" alt="1881 - 193∞" width="100" height="31">';

  btn.addEventListener('click', () => {
    const varMi = document.getElementById('ataturk-msg');
    if (varMi) {
      varMi.remove();
      return;
    }
    const m = document.createElement('div');
    m.id = 'ataturk-msg';
    Object.assign(m.style, {
      position: 'fixed',
      left: '12px',
      bottom: '48px',
      maxWidth: '240px',
      background: 'rgba(0,0,0,.92)',
      color: '#fafafa',
      padding: '0.65rem 0.8rem',
      borderRadius: '8px',
      fontSize: '0.8rem',
      lineHeight: '1.45',
      zIndex: '45',
      fontFamily: 'Georgia, serif',
      boxShadow: '0 4px 20px rgba(0,0,0,.45)',
      border: '1px solid #333'
    });
    m.innerHTML =
      '<span style="letter-spacing:.06em">1881 — 193∞</span><br>' +
      '<span style="font-family:system-ui,sans-serif;font-size:0.75rem;opacity:.85">' +
      'Hayatta en hakiki mürşit ilimdir.</span>';
    document.body.appendChild(m);
    setTimeout(() => m.remove(), 5000);
  });

  document.body.appendChild(btn);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', yerlestirAtaturk);
} else {
  yerlestirAtaturk();
}
