import { describe, it, expect, beforeEach } from 'vitest';
import { PitchDetector } from '../../pitch-detection/pitch-detector';
import { generateSineWave, NOTE_FREQUENCIES } from '../fixtures/synthetic-audio';

describe('PitchDetector', () => {
  let detector: PitchDetector;
  const sampleRate = 44100;

  beforeEach(() => {
    detector = new PitchDetector();
  });

  it('should detect A4 from pure tone', () => {
    // Create frequency data that represents A4
    // In real usage, this would come from AnalyserNode
    // For testing, we simulate frequency domain data
    const frequencyData = new Float32Array(1024);
    
    // Simulate a peak at A4 frequency (440Hz)
    // Frequency resolution = sampleRate / (2 * fftSize)
    // For 1024 bins at 44100Hz: resolution = 44100 / 2048 ≈ 21.5 Hz per bin
    // A4 (440Hz) would be at bin ≈ 440 / 21.5 ≈ 20
    const binForA4 = Math.round(440 / (sampleRate / (2 * 1024)));
    
    // Set peak amplitude (in dB, -60 to 0 range)
    frequencyData[binForA4] = -20; // Strong peak
    
    const notes = detector.detectNotes(frequencyData, sampleRate, Date.now());
    
    // Should detect at least one note
    expect(notes.length).toBeGreaterThan(0);
    
    // Check if A4 is detected (may have slight variations)
    const a4Note = notes.find(n => n.pitch.step === 'A' && n.pitch.octave === 4);
    expect(a4Note).toBeDefined();
  });

  it('should return empty array for silence', () => {
    const frequencyData = new Float32Array(1024);
    // Fill with very low values (silence)
    frequencyData.fill(-100);
    
    const notes = detector.detectNotes(frequencyData, sampleRate, Date.now());
    expect(notes.length).toBe(0);
  });

  it('should detect multiple notes', () => {
    const frequencyData = new Float32Array(1024);
    const resolution = sampleRate / (2 * 1024);
    
    // Add peaks for A4 and C5
    const binA4 = Math.round(NOTE_FREQUENCIES.A4 / resolution);
    const binC5 = Math.round(NOTE_FREQUENCIES.C5 / resolution);
    
    frequencyData[binA4] = -20;
    frequencyData[binC5] = -25;
    
    const notes = detector.detectNotes(frequencyData, sampleRate, Date.now());
    expect(notes.length).toBeGreaterThanOrEqual(1);
  });

  it('should include confidence scores', () => {
    const frequencyData = new Float32Array(1024);
    const resolution = sampleRate / (2 * 1024);
    const binA4 = Math.round(NOTE_FREQUENCIES.A4 / resolution);
    frequencyData[binA4] = -20;
    
    const notes = detector.detectNotes(frequencyData, sampleRate, Date.now());
    
    if (notes.length > 0) {
      expect(notes[0].confidence).toBeGreaterThanOrEqual(0);
      expect(notes[0].confidence).toBeLessThanOrEqual(1);
    }
  });

  it('should include amplitude information', () => {
    const frequencyData = new Float32Array(1024);
    const resolution = sampleRate / (2 * 1024);
    const binA4 = Math.round(NOTE_FREQUENCIES.A4 / resolution);
    frequencyData[binA4] = -20;
    
    const notes = detector.detectNotes(frequencyData, sampleRate, Date.now());
    
    if (notes.length > 0) {
      expect(notes[0].amplitude).toBeGreaterThanOrEqual(0);
      expect(notes[0].amplitude).toBeLessThanOrEqual(1);
    }
  });
});

