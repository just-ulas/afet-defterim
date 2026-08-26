/** basit onay / bilgi kutusu */
export function modal({ baslik, govde, tamam = 'tamam', iptal = null }) {
  return new Promise(resolve => {
    const arka = document.createElement('div');
    Object.assign(arka.style, {
      position: 'fixed', inset: '0', background: 'rgba(0,0,0,.55)', zIndex: '10000',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    });
    const kutu = document.createElement('div');
    Object.assign(kutu.style, {
      background: '#fff', color: '#1a1a1a', borderRadius: '12px', padding: '1.2rem',
      maxWidth: '360px', width: '100%'
    });
    const h = document.createElement('h3');
    h.textContent = baslik || '';
    h.style.margin = '0 0 0.5rem';
    const p = document.createElement('div');
    p.innerHTML = typeof govde === 'string' ? govde : '';
    p.style.fontSize = '0.95rem';
    p.style.marginBottom = '1rem';
    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '0.5rem';
    btnRow.style.justifyContent = 'flex-end';
    function kapat(v) {
      arka.remove();
      resolve(v);
    }
    if (iptal) {
      const b = document.createElement('button');
      b.textContent = iptal;
      b.onclick = () => kapat(false);
      btnRow.appendChild(b);
    }
    const ok = document.createElement('button');
    ok.textContent = tamam;
    ok.style.fontWeight = '700';
    ok.onclick = () => kapat(true);
    btnRow.appendChild(ok);
    kutu.appendChild(h);
    kutu.appendChild(p);
    kutu.appendChild(btnRow);
    arka.appendChild(kutu);
    arka.addEventListener('click', e => { if (e.target === arka) kapat(false); });
    document.body.appendChild(arka);
  });
}
