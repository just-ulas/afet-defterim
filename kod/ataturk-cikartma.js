/** sol alta Atatürk çıkartması — tıklanınca kısa saygı metni */
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
  btn.title = 'Mustafa Kemal Atatürk';
  btn.setAttribute('aria-label', 'Mustafa Kemal Atatürk anısına');
  btn.innerHTML = '<img src="docs/ekran/ataturk-cikartma.svg" alt="Atatürk" width="56" height="65">';

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
      bottom: '78px',
      maxWidth: '220px',
      background: 'rgba(15,15,15,.92)',
      color: '#f5f5f4',
      padding: '0.65rem 0.75rem',
      borderRadius: '10px',
      fontSize: '0.78rem',
      lineHeight: '1.45',
      zIndex: '45',
      fontFamily: 'system-ui,sans-serif',
      boxShadow: '0 4px 20px rgba(0,0,0,.4)'
    });
    m.innerHTML = '<strong style="color:#fecaca">Mustafa Kemal Atatürk</strong><br>' +
      '"Hayatta en hakiki mürşit ilimdir."<br>' +
      '<span style="opacity:.75">bu uygulama: hazırlıklı olmak, dayanışmak, ayakta kalmak için.</span>';
    document.body.appendChild(m);
    setTimeout(() => m.remove(), 6000);
  });

  document.body.appendChild(btn);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', yerlestirAtaturk);
} else {
  yerlestirAtaturk();
}
