/** batarya API — varsa seviye göster */
export async function bataryaBilgi() {
  if (!navigator.getBattery) return null;
  try {
    const b = await navigator.getBattery();
    return {
      seviye: Math.round(b.level * 100),
      sarj: b.charging,
      sarjaKalan: b.chargingTime,
      bitiseKalan: b.dischargingTime
    };
  } catch {
    return null;
  }
}

export async function dusukBataryaMi(esik = 15) {
  const b = await bataryaBilgi();
  if (!b) return false;
  return !b.sarj && b.seviye <= esik;
}
