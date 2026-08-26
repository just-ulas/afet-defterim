/** ekran uyanık kalsın (destekleyen tarayıcı) */
let lock = null;

export async function wakeAc() {
  if (!navigator.wakeLock) return false;
  try {
    lock = await navigator.wakeLock.request('screen');
    lock.addEventListener('release', () => { lock = null; });
    return true;
  } catch {
    return false;
  }
}

export async function wakeKapat() {
  try {
    if (lock) await lock.release();
  } catch {}
  lock = null;
}

export function wakeVarMi() {
  return !!lock;
}
