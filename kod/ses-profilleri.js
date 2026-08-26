/** ses presetleri — tone motoruna parametre */
export const PROFILLER = {
  klasik: { freq: 3750, type: 'square', vol: 0.92, sweep: true, label: 'klasik düdük' },
  tiz: { freq: 4200, type: 'square', vol: 0.85, sweep: true, label: 'tiz' },
  yumusak: { freq: 2800, type: 'sine', vol: 0.7, sweep: false, label: 'yumuşak' },
  siren_yavas: { mode: 'siren', low: 600, high: 1200, period: 500, label: 'yavaş siren' },
  siren_hizli: { mode: 'siren', low: 700, high: 1500, period: 280, label: 'hızlı siren' },
  bip: { freq: 1600, type: 'sine', vol: 0.6, sweep: false, pulseMs: 200, gapMs: 150, label: 'bip' }
};

export function profilListe() {
  return Object.keys(PROFILLER).map(id => ({ id, ...PROFILLER[id] }));
}

export function profilGetir(id) {
  return PROFILLER[id] || PROFILLER.klasik;
}
