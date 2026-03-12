// Audio engine using Web Audio API for synthesized retro sounds
// No external audio files needed - everything is generated programmatically

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.musicPlaying = false;
    this.musicOscillators = [];
    this.musicGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Retro "flip" sound for card interactions
  playFlip() {
    if (!this.enabled) return;
    this.ensureContext();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Happy correct answer jingle
  playCorrect() {
    if (!this.enabled) return;
    this.ensureContext();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);

      gain.gain.setValueAtTime(0.08, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.25);
    });
  }

  // Wrong answer buzz
  playWrong() {
    if (!this.enabled) return;
    this.ensureContext();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Victory fanfare
  playVictory() {
    if (!this.enabled) return;
    this.ensureContext();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const melody = [
      [523.25, 0.15], [523.25, 0.15], [523.25, 0.15], [523.25, 0.4],
      [415.30, 0.4], [466.16, 0.4], [523.25, 0.2], [466.16, 0.15], [523.25, 0.6]
    ];

    let time = now;
    melody.forEach(([freq, dur]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.08, time);
      gain.gain.setValueAtTime(0.08, time + dur - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.start(time);
      osc.stop(time + dur + 0.01);
      time += dur;
    });
  }

  // Hover sound
  playHover() {
    if (!this.enabled) return;
    this.ensureContext();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Click/select sound
  playSelect() {
    if (!this.enabled) return;
    this.ensureContext();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.06);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Background chiptune music
  startMusic() {
    if (!this.enabled || this.musicPlaying) return;
    this.ensureContext();
    const ctx = this.ctx;
    this.musicPlaying = true;

    this.musicGain = ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.03, ctx.currentTime);
    this.musicGain.connect(ctx.destination);

    // Simple looping arpeggio pattern
    const playPattern = () => {
      if (!this.musicPlaying) return;

      const now = ctx.currentTime;
      const patterns = [
        [261.63, 329.63, 392.00, 329.63], // C major
        [220.00, 277.18, 329.63, 277.18], // A minor
        [246.94, 311.13, 369.99, 311.13], // B dim-ish
        [196.00, 246.94, 293.66, 246.94], // G major
      ];

      const patternIdx = Math.floor(Math.random() * patterns.length);
      const pattern = patterns[patternIdx];
      const noteLength = 0.2;

      pattern.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.connect(noteGain);
        noteGain.connect(this.musicGain);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * noteLength);

        noteGain.gain.setValueAtTime(0.3, now + i * noteLength);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + i * noteLength + noteLength * 0.9);

        osc.start(now + i * noteLength);
        osc.stop(now + i * noteLength + noteLength);

        this.musicOscillators.push(osc);
      });

      this.musicTimeout = setTimeout(playPattern, pattern.length * noteLength * 1000);
    };

    playPattern();
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicTimeout) {
      clearTimeout(this.musicTimeout);
    }
    this.musicOscillators.forEach(osc => {
      try { osc.stop(); } catch (e) { /* already stopped */ }
    });
    this.musicOscillators = [];
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopMusic();
    }
    return this.enabled;
  }
}

export const audioEngine = new AudioEngine();
