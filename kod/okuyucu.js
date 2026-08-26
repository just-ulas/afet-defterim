// markdown diye bir şey parse ediyorum ama yarım yamalak. iş görüyor
function basitMd(t) {
  return t
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    .split(/\n\n+/).map(b => {
      if (b.startsWith('<h') || b.includes('<li>')) {
        if (b.includes('<li>')) return '<ul>' + b + '</ul>';
        return b;
      }
      return '<p>' + b.replace(/\n/g, '<br>') + '</p>';
    }).join('');
}

document.querySelectorAll('nav a[data-f]').forEach(a => {
  a.addEventListener('click', async e => {
    e.preventDefault();
    const f = a.getAttribute('data-f');
    const el = document.getElementById('icerik');
    try {
      const r = await fetch(f);
      if (!r.ok) throw new Error('yok');
      el.innerHTML = basitMd(await r.text());
    } catch (err) {
      el.innerHTML = '<p>dosya açılmadı. local sunucu kullan: <code>python3 -m http.server 8000</code></p><p>' + f + '</p>';
    }
  });
});
