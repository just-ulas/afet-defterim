import { formatKonum, toDms, googleMaps } from '../kod/konum-format.js';

const loc = { lat: 41.0082, lon: 28.9784, acc: 12 };
if (!formatKonum(loc).includes('41.00820')) throw new Error('format');
if (!googleMaps(loc).includes('28.9784')) throw new Error('maps');
if (!toDms(41.0082, true).includes('N')) throw new Error('dms');
console.log('konum-format.test ok');
