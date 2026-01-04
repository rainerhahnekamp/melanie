/**
 * Synthetic audio generation utilities for testing.
 * Generates pure tones, note sequences, and metronome patterns.
 */

/**
 * Generate a pure sine wave tone.
 * @param frequency - Frequency in Hz
 * @param duration - Duration in seconds
 * @param sampleRate - Sample rate in Hz (default: 44100)
 * @param amplitude - Amplitude 0-1 (default: 0.5)
 * @returns Float32Array of audio samples
 */
export function generateSineWave(
  frequency: number,
  duration: number,
  sampleRate: number = 44100,
  amplitude: number = 0.5
): Float32Array {
  const length = Math.floor(duration * sampleRate);
  const samples = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    samples[i] = amplitude * Math.sin(2 * Math.PI * frequency * t);
  }

  return samples;
}

/**
 * Generate a sequence of notes with specified timing.
 * @param notes - Array of { frequency, startTime, duration }
 * @param totalDuration - Total duration in seconds
 * @param sampleRate - Sample rate in Hz (default: 44100)
 * @returns Float32Array of audio samples
 */
export function generateNoteSequence(
  notes: Array<{ frequency: number; startTime: number; duration: number }>,
  totalDuration: number,
  sampleRate: number = 44100
): Float32Array {
  const length = Math.floor(totalDuration * sampleRate);
  const samples = new Float32Array(length);

  for (const note of notes) {
    const startSample = Math.floor(note.startTime * sampleRate);
    const noteSamples = generateSineWave(note.frequency, note.duration, sampleRate);
    const endSample = Math.min(startSample + noteSamples.length, length);

    for (let i = startSample; i < endSample; i++) {
      const noteIndex = i - startSample;
      if (noteIndex < noteSamples.length) {
        samples[i] += noteSamples[noteIndex];
      }
    }
  }

  // Normalize to prevent clipping
  const max = Math.max(...Array.from(samples.map(Math.abs)));
  if (max > 1) {
    for (let i = 0; i < samples.length; i++) {
      samples[i] /= max;
    }
  }

  return samples;
}

/**
 * Generate a metronome pattern (click sounds).
 * @param bpm - Beats per minute
 * @param duration - Total duration in seconds
 * @param sampleRate - Sample rate in Hz (default: 44100)
 * @returns Float32Array of audio samples
 */
export function generateMetronome(
  bpm: number,
  duration: number,
  sampleRate: number = 44100
): Float32Array {
  const beatInterval = 60 / bpm; // seconds per beat
  const clickDuration = 0.1; // seconds
  const clickFrequency = 1000; // Hz (high-pitched click)

  const notes: Array<{ frequency: number; startTime: number; duration: number }> = [];

  for (let time = 0; time < duration; time += beatInterval) {
    notes.push({
      frequency: clickFrequency,
      startTime: time,
      duration: clickDuration,
    });
  }

  return generateNoteSequence(notes, duration, sampleRate);
}

/**
 * Add noise to audio samples.
 * @param samples - Audio samples
 * @param noiseLevel - Noise level 0-1 (default: 0.1)
 * @returns Audio samples with noise added
 */
export function addNoise(samples: Float32Array, noiseLevel: number = 0.1): Float32Array {
  const noisy = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    // Generate random noise
    const noise = (Math.random() * 2 - 1) * noiseLevel;
    noisy[i] = Math.max(-1, Math.min(1, samples[i] + noise));
  }
  return noisy;
}

/**
 * Standard frequencies for common notes.
 */
export const NOTE_FREQUENCIES = {
  A4: 440,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A5: 880,
  C5: 523.25,
} as const;

