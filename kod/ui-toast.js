/** ekranın altında kısa mesaj */
let timer = null;

export function toast(mesaj, ms = 2200) {
  let el = document.getElementById('afet-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'afet-toast';
    el.setAttribute('role', 'status');
    Object.assign(el.style, {
      position: 'fixed', left: '50%', bottom: '1.5rem', transform: 'translateX(-50%)',
      background: '#1c1917', color: '#fafaf9', padding: '0.6rem 1rem', borderRadius: '8px',
      fontSize: '0.9rem', zIndex: '9999', maxWidth: '90%', textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,.35)'
    });
    document.body.appendChild(el);
  }
  el.textContent = mesaj;
  el.style.opacity = '1';
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => { el.style.opacity = '0'; }, ms);
}
