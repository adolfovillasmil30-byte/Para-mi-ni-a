/**
 * Romantic Music Box & Sound Effects using Web Audio API
 * Generates delicate, romantic ambient music without external audio dependencies.
 */

class RomanticAudio {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private currentNoteIndex = 0;
  private volume = 0.25;

  // Romantic arpeggio sequence (pentatonic/major 7th - warm, emotional music box sound)
  private melody = [
    // Phrase 1: Canon/Lullaby feel
    523.25, // C5
    659.25, // E5
    783.99, // G5
    987.77, // B5
    1046.50, // C6
    783.99, // G5
    880.00, // A5
    659.25, // E5
    587.33, // D5
    698.46, // F5
    880.00, // A5
    659.25, // E5
    523.25, // C5
    659.25, // E5
    783.99, // G5
    587.33, // D5

    // Phrase 2: Gentle yearning
    440.00, // A4
    523.25, // C5
    659.25, // E5
    783.99, // G5
    698.46, // F5
    587.33, // D5
    523.25, // C5
    493.88, // B4
    523.25, // C5
    659.25, // E5
    783.99, // G5
    1046.50, // C6
    987.77, // B5
    783.99, // G5
    659.25, // E5
    523.25, // C5
  ];

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Plays a single delicate music box bell tone
  playTone(freq: number, duration = 1.8, velocity = 0.2) {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Sine wave combined with subtle harmonics for a celesta/music box quality
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Envelope: quick attack, long gentle natural decay
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(velocity * this.volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Play charming chime when clicking a memory card
  playChime() {
    const notes = [659.25, 783.99, 1046.50]; // E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 1.2, 0.35);
      }, idx * 90);
    });
  }

  // Play unlock celebration sound
  playUnlockSuccess() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 2.0, 0.4);
      }, idx * 110);
    });
  }

  // Play gentle subtle error sound
  playErrorTender() {
    const notes = [440.00, 392.00];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.8, 0.15);
      }, idx * 140);
    });
  }

  // Start background romantic music loop
  toggleMusic(): boolean {
    this.initCtx();
    if (this.isPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  startMusic() {
    this.initCtx();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step();
  }

  stopMusic() {
    this.isPlaying = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private step = () => {
    if (!this.isPlaying) return;

    const freq = this.melody[this.currentNoteIndex];
    this.playTone(freq, 2.2, 0.22);

    // Occasionally play a bass/root note for richness
    if (this.currentNoteIndex % 4 === 0) {
      this.playTone(freq / 2, 2.8, 0.18);
    }

    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;

    // Tempo: gentle slow pace (approx 520ms between notes)
    this.timer = window.setTimeout(this.step, 540);
  };

  getPlaying() {
    return this.isPlaying;
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }
}

export const romanticAudio = new RomanticAudio();
