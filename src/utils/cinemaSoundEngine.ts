import { WHITE_JOY_CONFIG } from "../config/whiteJoyConfig";

/**
 * Cinema Sound Designer Engine (Web Audio API + Optional External Audio Track)
 * Respects browser autoplay policies: never forces audio without user interaction.
 * Provides:
 * - Soft ambient romantic felt-piano & airy strings background music
 * - Gentle cloud/air breeze whoosh
 * - Delicate typing keystroke for poetic lines
 * - Soft car arrival breeze
 * - Tactile wax-seal crack + paper envelope open
 * - Warm harp chime on opening invitation
 * - Subtle page-turn whisper between chapters + finale celebration chime
 */
class CinemaSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled = false;
  private ambientRunning = false;
  private arpeggioTimer: number | null = null;
  private externalAudio: HTMLAudioElement | null = null;

  public isEnabled(): boolean {
    return this.enabled;
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  public async enable(): Promise<boolean> {
    const ctx = this.ensureContext();
    if (!ctx) return false;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }
    this.enabled = ctx.state === "running";
    if (this.enabled) {
      this.startAmbientScore();
    }
    return this.enabled;
  }

  public disable(): void {
    this.enabled = false;
    this.stopAmbientScore();
  }

  public async toggle(): Promise<boolean> {
    if (this.enabled) {
      this.disable();
      return false;
    }
    return this.enable();
  }

  private startAmbientScore(): void {
    if (this.ambientRunning) return;

    if (WHITE_JOY_CONFIG.media.ambientMusicUrl) {
      if (!this.externalAudio) {
        this.externalAudio = new Audio(WHITE_JOY_CONFIG.media.ambientMusicUrl);
        this.externalAudio.loop = true;
        this.externalAudio.volume = 0.35;
      }
      this.externalAudio.play().catch(() => {});
      this.ambientRunning = true;
      return;
    }

    const ctx = this.ctx;
    const master = this.masterGain;
    if (!ctx || !master) return;

    this.ambientRunning = true;
    const notes = [261.63, 329.63, 392.0, 493.88, 440.0, 392.0, 329.63, 293.66];
    let step = 0;

    const playNote = () => {
      if (!this.enabled || !this.ambientRunning || !this.ctx || !this.masterGain) {
        return;
      }
      const now = this.ctx.currentTime;
      const freq = notes[step % notes.length];
      step += 1;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(900, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.032, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 2.9);

      this.arpeggioTimer = window.setTimeout(playNote, 1750);
    };

    playNote();
  }

  private stopAmbientScore(): void {
    this.ambientRunning = false;
    if (this.arpeggioTimer !== null) {
      window.clearTimeout(this.arpeggioTimer);
      this.arpeggioTimer = null;
    }
    if (this.externalAudio) {
      this.externalAudio.pause();
    }
  }

  public playTypingClick(): void {
    if (!this.enabled || !this.ctx || !this.masterGain || this.ctx.state !== "running") return;
    const now = this.ctx.currentTime;
    const len = Math.floor(this.ctx.sampleRate * 0.018);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.4);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1750 + Math.random() * 380, now);
    bp.Q.setValueAtTime(1.9, now);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.18, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    src.connect(bp);
    bp.connect(g);
    g.connect(this.masterGain);
    src.start(now);
  }

  public playAirWhoosh(duration = 0.65): void {
    if (!this.enabled || !this.ctx || !this.masterGain || this.ctx.state !== "running") return;
    const now = this.ctx.currentTime;
    const len = Math.floor(this.ctx.sampleRate * duration);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const lp = this.ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(420, now);
    lp.frequency.exponentialRampToValueAtTime(1150, now + duration * 0.45);
    lp.frequency.exponentialRampToValueAtTime(320, now + duration);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.09, now + duration * 0.35);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);

    src.connect(lp);
    lp.connect(g);
    g.connect(this.masterGain);
    src.start(now);
  }

  public playWaxCrackAndChime(): void {
    if (!this.enabled || !this.ctx || !this.masterGain || this.ctx.state !== "running") return;
    const now = this.ctx.currentTime;

    // 1. Subtle crisp wax seal crack
    const crackLen = Math.floor(this.ctx.sampleRate * 0.05);
    const crackBuf = this.ctx.createBuffer(1, crackLen, this.ctx.sampleRate);
    const d = crackBuf.getChannelData(0);
    for (let i = 0; i < crackLen; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / crackLen, 2.5);
    }
    const crackSrc = this.ctx.createBufferSource();
    crackSrc.buffer = crackBuf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1200, now);
    const cg = this.ctx.createGain();
    cg.gain.setValueAtTime(0.22, now);
    cg.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    crackSrc.connect(bp);
    bp.connect(cg);
    cg.connect(this.masterGain);
    crackSrc.start(now);

    // 2. Warm festive harp arpeggio
    const chord = [523.25, 659.25, 783.99, 987.77, 1046.5];
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const start = now + 0.06 + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.06, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.35);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + 1.4);
    });
  }

  public playPageTurn(): void {
    this.playAirWhoosh(0.28);
  }

  public playFinaleChime(): void {
    if (!this.enabled || !this.ctx || !this.masterGain || this.ctx.state !== "running") return;
    const now = this.ctx.currentTime;
    [587.33, 739.99, 880.0, 1174.66].forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const start = now + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.045, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.1);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + 1.15);
    });
  }
}

export const cinemaSound = new CinemaSoundEngine();
