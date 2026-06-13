// Web Audio API synthesizer for gentle Minecraft-style sound effects.
// No external files needed. Respects soundOn setting.

let ctx = null;
function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone({ freq = 440, dur = 0.12, type = "sine", gain = 0.08, attack = 0.005, decay = 0.08, slide = 0 }) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  if (slide) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), c.currentTime + dur);
  }
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + attack + decay);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + dur + 0.05);
}

function isOn() {
  try {
    const raw = localStorage.getItem("mc_learn_v1");
    if (!raw) return true;
    const s = JSON.parse(raw);
    return s.soundOn !== false;
  } catch {
    return true;
  }
}

export const SFX = {
  click() {
    if (!isOn()) return;
    tone({ freq: 220, dur: 0.07, type: "square", gain: 0.05, decay: 0.06 });
  },
  place() {
    if (!isOn()) return;
    tone({ freq: 180, dur: 0.1, type: "triangle", gain: 0.07, decay: 0.08, slide: -30 });
  },
  correct() {
    if (!isOn()) return;
    const c = getCtx();
    if (!c) return;
    tone({ freq: 523.25, dur: 0.12, type: "triangle", gain: 0.08 });
    setTimeout(() => tone({ freq: 659.25, dur: 0.12, type: "triangle", gain: 0.08 }), 100);
    setTimeout(() => tone({ freq: 783.99, dur: 0.18, type: "triangle", gain: 0.09 }), 200);
  },
  wrong() {
    if (!isOn()) return;
    tone({ freq: 220, dur: 0.18, type: "sine", gain: 0.06, decay: 0.16, slide: -40 });
  },
  diamond() {
    if (!isOn()) return;
    tone({ freq: 880, dur: 0.08, type: "triangle", gain: 0.07 });
    setTimeout(() => tone({ freq: 1318.51, dur: 0.14, type: "triangle", gain: 0.08 }), 70);
  },
  badge() {
    if (!isOn()) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      setTimeout(() => tone({ freq: f, dur: 0.14, type: "triangle", gain: 0.09 }), i * 80);
    });
  },
  win() {
    if (!isOn()) return;
    [392, 523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, i) => {
      setTimeout(() => tone({ freq: f, dur: 0.16, type: "triangle", gain: 0.08 }), i * 90);
    });
  },
  step() {
    if (!isOn()) return;
    tone({ freq: 140 + Math.random() * 40, dur: 0.05, type: "square", gain: 0.04, decay: 0.04 });
  },
};
