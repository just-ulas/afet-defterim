/**
 * daha dolu tone motoru — profiller + pulse + siren
 * ses.js bunu kullanabilir; şimdilik paralel dursun
 */
import { profilGetir } from './ses-profilleri.js';

export class SesMotor {
  constructor() {
    this.ctx = null;
    this.nodes = [];
    this.timers = [];
    this.running = false;
  }

  async hazir() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) throw new Error('web audio yok');
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    return this.ctx;
  }

  _temiz() {
    this.timers.forEach(clearInterval);
    this.timers = [];
    this.nodes.forEach(n => {
      try {
        if (n.stop) n.stop();
        n.disconnect && n.disconnect();
      } catch {}
    });
    this.nodes = [];
    this.running = false;
  }

  async calProfil(id) {
    const p = profilGetir(id);
    await this.hazir();
    this._temiz();
    if (p.mode === 'siren') return this._siren(p);
    if (p.pulseMs) return this._pulse(p);
    return this._tone(p);
  }

  async _tone(p) {
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.value = p.vol != null ? p.vol : 0.8;
    g.connect(ctx.destination);
    const o = ctx.createOscillator();
    o.type = p.type || 'square';
    o.frequency.value = p.freq || 3500;
    o.connect(g);
    o.start();
    this.nodes.push(o, g);
    if (p.sweep) {
      const base = p.freq || 3500;
      const id = setInterval(() => {
        if (!this.running) return;
        const t = ctx.currentTime;
        o.frequency.cancelScheduledValues(t);
        o.frequency.setValueAtTime(base, t);
        o.frequency.linearRampToValueAtTime(base + 400, t + 0.1);
        o.frequency.linearRampToValueAtTime(base - 150, t + 0.22);
        o.frequency.linearRampToValueAtTime(base, t + 0.35);
      }, 300);
      this.timers.push(id);
    }
    this.running = true;
  }

  async _siren(p) {
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.value = 0.7;
    g.connect(ctx.destination);
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = p.low || 600;
    o.connect(g);
    o.start();
    this.nodes.push(o, g);
    let up = true;
    const period = p.period || 400;
    const id = setInterval(() => {
      if (!this.running) return;
      const t = ctx.currentTime;
      const hedef = up ? (p.high || 1400) : (p.low || 600);
      o.frequency.linearRampToValueAtTime(hedef, t + period / 1000);
      up = !up;
    }, period);
    this.timers.push(id);
    this.running = true;
  }

  async _pulse(p) {
    const ctx = this.ctx;
    this.running = true;
    const on = p.pulseMs || 200;
    const off = p.gapMs || 150;
    const tick = async () => {
      if (!this.running) return;
      const g = ctx.createGain();
      g.gain.value = p.vol || 0.6;
      g.connect(ctx.destination);
      const o = ctx.createOscillator();
      o.type = p.type || 'sine';
      o.frequency.value = p.freq || 1600;
      o.connect(g);
      o.start();
      o.stop(ctx.currentTime + on / 1000);
      this.nodes.push(o, g);
      setTimeout(() => {
        if (this.running) tick();
      }, on + off);
    };
    tick();
  }

  dur() {
    this._temiz();
  }

  calisiyorMu() {
    return this.running;
  }
}
