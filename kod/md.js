/** hafif markdown → html. tablo yok, kod var, liste var */
const BLOK = /^(#{1,6})\s+(.+)$/;
const UL = /^[-*]\s+(.+)$/;
const OL = /^(\d+)\.\s+(.+)$/;
const HR = /^-{3,}$/;
const KOD_FENS = /^```(\w*)$/;

export function mdToHtml(src) {
  if (!src) return '';
  const lines = String(src).replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  let inCode = false;
  let codeLang = '';
  let codeBuf = [];
  let listType = null;
  let listBuf = [];

  function flushList() {
    if (!listType) return;
    const tag = listType === 'ol' ? 'ol' : 'ul';
    out.push('<' + tag + '>' + listBuf.map(x => '<li>' + inline(x) + '</li>').join('') + '</' + tag + '>');
    listType = null;
    listBuf = [];
  }

  function flushCode() {
    if (!inCode) return;
    const esc = codeBuf.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;');
    out.push('<pre><code class="lang-' + codeLang + '">' + esc + '</code></pre>');
    inCode = false;
    codeLang = '';
    codeBuf = [];
  }

  while (i < lines.length) {
    const raw = lines[i];
    const mFence = raw.match(KOD_FENS);
    if (mFence) {
      if (inCode) flushCode();
      else {
        flushList();
        inCode = true;
        codeLang = mFence[1] || '';
      }
      i++;
      continue;
    }
    if (inCode) {
      codeBuf.push(raw);
      i++;
      continue;
    }
    if (HR.test(raw.trim())) {
      flushList();
      out.push('<hr>');
      i++;
      continue;
    }
    const mh = raw.match(BLOK);
    if (mh) {
      flushList();
      const n = mh[1].length;
      out.push('<h' + n + '>' + inline(mh[2]) + '</h' + n + '>');
      i++;
      continue;
    }
    const mu = raw.match(UL);
    if (mu) {
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      listBuf.push(mu[1]);
      i++;
      continue;
    }
    const mo = raw.match(OL);
    if (mo) {
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      listBuf.push(mo[2]);
      i++;
      continue;
    }
    if (raw.trim() === '') {
      flushList();
      i++;
      continue;
    }
    flushList();
    // paragraf birleştir
    const parts = [raw];
    while (i + 1 < lines.length && lines[i + 1].trim() !== '' && !BLOK.test(lines[i + 1]) && !UL.test(lines[i + 1]) && !OL.test(lines[i + 1]) && !KOD_FENS.test(lines[i + 1]) && !HR.test(lines[i + 1].trim())) {
      i++;
      parts.push(lines[i]);
    }
    out.push('<p>' + inline(parts.join(' ')) + '</p>');
    i++;
  }
  flushList();
  flushCode();
  return out.join('\n');
}

function inline(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
}

export function stripMd(src) {
  return String(src || '')
    .replace(/[#*_`\[\]()>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
