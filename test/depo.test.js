/** tarayıcı dışı: depo localStorage ister, burada sadece import duman testi */
import { oku, yaz, sil } from '../kod/depo.js';

// node'da localStorage yok — atla
if (typeof localStorage === 'undefined') {
  console.log('depo.test atlandı (localStorage yok)');
  process.exit(0);
}
yaz('t', { a: 1 });
if (oku('t').a !== 1) throw new Error('oku');
sil('t');
console.log('depo.test ok');
