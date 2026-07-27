// Tiny procedural Web Audio helper. No audio files required — every sound is
// synthesised with oscillators so the game works offline. The `playTone` core is
// the single chokepoint: swap its body (or add an `<audio>` path) later to use
// real recorded sounds without touching call sites.

let ctx: AudioContext | null = null;
let muted = false;

export function setAudioMuted(value: boolean) {
  muted = value;
}

export function getAudioMuted() {
  return muted;
}

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

interface ToneOpts {
  freq: number;
  /** offset from now in seconds */
  start?: number;
  /** seconds */
  duration?: number;
  type?: OscillatorType;
  /** peak gain */
  gain?: number;
  attack?: number;
  release?: number;
}

export function playTone({
  freq,
  start = 0,
  duration = 0.25,
  type = "sine",
  gain = 0.18,
  attack = 0.012,
  release = 0.12,
}: ToneOpts) {
  if (muted) return;
  const ac = ensureCtx();
  if (!ac) return;
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + attack);
  g.gain.setValueAtTime(gain, t0 + Math.max(attack, duration - release));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.03);
}

/** soft UI tick */
export function playClick() {
  playTone({ freq: 660, duration: 0.07, type: "triangle", gain: 0.07 });
}

/** gentle three-note sparkle — used when a fragment is revealed */
export function playChime() {
  playTone({ freq: 523.25, start: 0, duration: 0.32, type: "sine", gain: 0.16 });
  playTone({ freq: 659.25, start: 0.12, duration: 0.34, type: "sine", gain: 0.16 });
  playTone({ freq: 783.99, start: 0.24, duration: 0.42, type: "sine", gain: 0.16 });
}

/** warm rising arpeggio — puzzle solved */
export function playSuccess() {
  const notes = [392.0, 523.25, 659.25, 783.99]; // G4 C5 E5 G5
  notes.forEach((f, i) =>
    playTone({ freq: f, start: i * 0.1, duration: 0.5, type: "sine", gain: 0.18 }),
  );
  playTone({ freq: 1046.5, start: 0.42, duration: 0.7, type: "triangle", gain: 0.1 });
}

/** soft descending dissonance — wrong answer */
export function playError() {
  playTone({ freq: 220, start: 0, duration: 0.18, type: "sawtooth", gain: 0.1 });
  playTone({ freq: 174.61, start: 0.12, duration: 0.28, type: "sawtooth", gain: 0.1 });
}

/** quiet metallic release — the final keepsake lock opening */
export function playUnlock() {
  playTone({ freq: 392, start: 0, duration: 0.28, type: "sine", gain: 0.09 });
  playTone({ freq: 523.25, start: 0.11, duration: 0.42, type: "sine", gain: 0.1 });
  playTone({ freq: 783.99, start: 0.27, duration: 0.55, type: "triangle", gain: 0.07 });
}

/** single sustained note — piano key / melody playback */
export function playNote(freq: number, duration = 0.4) {
  playTone({
    freq,
    duration,
    type: "sine",
    gain: 0.2,
    release: Math.min(0.2, duration * 0.45),
  });
}

/** schedule a sequence of notes back to back */
export function playSequence(notes: { freq: number; duration: number }[]) {
  let t = 0;
  for (const n of notes) {
    playTone({
      freq: n.freq,
      start: t,
      duration: n.duration,
      type: "sine",
      gain: 0.18,
      release: Math.min(0.15, n.duration * 0.4),
    });
    t += n.duration;
  }
}

/** low dramatic swell — the final reveal under the bed */
export function playReveal() {
  playTone({ freq: 130.81, start: 0, duration: 1.4, type: "sine", gain: 0.16 });
  playTone({ freq: 196.0, start: 0.2, duration: 1.4, type: "sine", gain: 0.14 });
  playTone({ freq: 392.0, start: 0.5, duration: 1.6, type: "triangle", gain: 0.12 });
  playTone({ freq: 523.25, start: 0.9, duration: 1.8, type: "sine", gain: 0.12 });
}
