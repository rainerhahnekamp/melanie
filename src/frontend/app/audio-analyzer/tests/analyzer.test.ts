import { describe, it, expect, beforeEach } from 'vitest';
import { AudioAnalyzer } from '../analyzer';
import { FFTProcessor } from '../fft/fft-processor';
import { PitchDetector } from '../pitch-detection/pitch-detector';
import { TempoEstimator } from '../tempo/tempo-estimator';

describe('AudioAnalyzer', () => {
  let analyzer: AudioAnalyzer;
  let audioContext: AudioContext;
  let analyserNode: AnalyserNode;

  beforeEach(() => {
    analyzer = new AudioAnalyzer();
    audioContext = new AudioContext();
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
  });

  it('should analyze audio from AnalyserNode', () => {
    const result = analyzer.analyze(analyserNode);
    
    expect(result).toBeDefined();
    expect(result.timestamp).toBeGreaterThan(0);
    expect(result.detectedNotes).toBeInstanceOf(Array);
    expect(result.tempoEstimation).toBeDefined();
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.audioLevel).toBeGreaterThanOrEqual(0);
    expect(result.audioLevel).toBeLessThanOrEqual(1);
  });

  it('should return valid tempo estimation', () => {
    const result = analyzer.analyze(analyserNode);
    
    expect(result.tempoEstimation.bpm).toBeGreaterThan(0);
    expect(result.tempoEstimation.confidence).toBeGreaterThanOrEqual(0);
    expect(result.tempoEstimation.confidence).toBeLessThanOrEqual(1);
    expect(result.tempoEstimation.timestamp).toBeGreaterThan(0);
    expect(typeof result.tempoEstimation.isStable).toBe('boolean');
  });

  it('should return valid detected notes structure', () => {
    const result = analyzer.analyze(analyserNode);
    
    for (const note of result.detectedNotes) {
      expect(note.pitch).toBeDefined();
      expect(note.pitch.step).toMatch(/^[A-G]$/);
      expect(note.pitch.octave).toBeGreaterThanOrEqual(0);
      expect(note.pitch.octave).toBeLessThanOrEqual(10);
      expect([-1, 0, 1]).toContain(note.pitch.alter);
      expect(note.startTime).toBeGreaterThanOrEqual(0);
      expect(note.duration).toBeGreaterThan(0);
      expect(note.confidence).toBeGreaterThanOrEqual(0);
      expect(note.confidence).toBeLessThanOrEqual(1);
      expect(note.amplitude).toBeGreaterThanOrEqual(0);
      expect(note.amplitude).toBeLessThanOrEqual(1);
    }
  });

  it('should accept custom dependencies', () => {
    const customFFT = new FFTProcessor();
    const customPitch = new PitchDetector();
    const customTempo = new TempoEstimator();
    
    const customAnalyzer = new AudioAnalyzer(customFFT, customPitch, customTempo);
    const result = customAnalyzer.analyze(analyserNode);
    
    expect(result).toBeDefined();
  });

  it('should throw error for unsupported audio type', () => {
    expect(() => {
      analyzer.analyze('invalid' as any);
    }).toThrow('Unsupported audio data type');
  });

  it('should calculate overall confidence correctly', () => {
    const result = analyzer.analyze(analyserNode);
    
    // Confidence should be a weighted combination of factors
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });
});

