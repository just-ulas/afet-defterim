/** yanlışlıkla SOS engeli — 3 sn basılı tut veya geri sayım */
export function geriSayim(sn, onTick, signal) {
  return new Promise((resolve, reject) => {
    let kalan = sn;
    onTick && onTick(kalan);
    const id = setInterval(() => {
      if (signal && signal.aborted) {
        clearInterval(id);
        reject(new Error('iptal'));
        return;
      }
      kalan--;
      onTick && onTick(kalan);
      if (kalan <= 0) {
        clearInterval(id);
        resolve();
      }
    }, 1000);
  });
}

/** basılı tut: holdMs dolunca resolve, erken bırakınca reject */
export function basiliTut(el, holdMs, onProgress) {
  return new Promise((resolve, reject) => {
    let t0 = 0;
    let raf = 0;
    let done = false;

    function frame(now) {
      if (!t0) t0 = now;
      const p = Math.min(1, (now - t0) / holdMs);
      onProgress && onProgress(p);
      if (p >= 1 && !done) {
        done = true;
        temizlik();
        resolve();
        return;
      }
      if (!done) raf = requestAnimationFrame(frame);
    }

    function temizlik() {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerup', iptal);
      el.removeEventListener('pointerleave', iptal);
      el.removeEventListener('pointercancel', iptal);
    }

    function iptal() {
      if (done) return;
      done = true;
      temizlik();
      reject(new Error('birakildi'));
    }

    el.addEventListener('pointerup', iptal);
    el.addEventListener('pointerleave', iptal);
    el.addEventListener('pointercancel', iptal);
    raf = requestAnimationFrame(frame);
  });
}
