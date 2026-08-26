/** node ile basit doğrulama: node test/md.test.js */
import { mdToHtml, stripMd } from '../kod/md.js';

function assert(k, m) {
  if (!k) throw new Error(m || 'assert');
}

const h = mdToHtml('# başlık\n\n**kalın** ve *italik*\n\n- a\n- b\n');
assert(h.includes('<h1>'), 'h1');
assert(h.includes('<strong>'), 'strong');
assert(h.includes('<ul>'), 'ul');
assert(stripMd('**x**').includes('x'), 'strip');
console.log('md.test ok');
