import { describe, it, expect, beforeEach } from 'vitest';
import { TempoEstimator } from '../../tempo/tempo-estimator';
import type { DetectedNote } from '../../types';

describe('TempoEstimator', () => {
  let estimator: TempoEstimator;

  beforeEach(() => {
    estimator = new TempoEstimator();
  });

  it('should return default tempo when insufficient notes', () => {
    const notes: DetectedNote[] = [];
    const estimate = estimator.estimateTempo(notes, Date.now());
    
    expect(estimate.bpm).toBe(120);
    expect(estimate.confidence).toBe(0);
    expect(estimate.isStable).toBe(false);
  });

  it('should estimate tempo from regular note intervals', () => {
    const bpm = 120;
    const beatInterval = 60 / bpm; // 0.5 seconds per beat
    const timestamp = Date.now();
    
    const notes: DetectedNote[] = [];
    for (let i = 0; i < 8; i++) {
      notes.push({
        pitch: { step: 'A', octave: 4, alter: 0 },
        startTime: i * beatInterval,
        duration: 0.1,
        confidence: 0.8,
        amplitude: 0.7,
      });
    }
    
    const estimate = estimator.estimateTempo(notes, timestamp);
    
    // Should be close to 120 BPM (allow some tolerance)
    expect(estimate.bpm).toBeGreaterThan(100);
    expect(estimate.bpm).toBeLessThan(140);
    expect(estimate.confidence).toBeGreaterThan(0);
  });

  it('should detect accelerating tempo', () => {
    const timestamp = Date.now();
    const notes: DetectedNote[] = [];
    
    // Create notes with decreasing intervals (accelerating)
    let time = 0;
    for (let i = 0; i < 8; i++) {
      const interval = 0.6 - i * 0.05; // Decreasing intervals
      time += interval;
      notes.push({
        pitch: { step: 'A', octave: 4, alter: 0 },
        startTime: time,
        duration: 0.1,
        confidence: 0.8,
        amplitude: 0.7,
      });
    }
    
    const estimate = estimator.estimateTempo(notes, timestamp);
    
    // Should detect acceleration trend
    expect(estimate.trend).toBe('accelerating');
  });

  it('should detect decelerating tempo', () => {
    const timestamp = Date.now();
    const notes: DetectedNote[] = [];
    
    // Create notes with increasing intervals (decelerating)
    let time = 0;
    for (let i = 0; i < 8; i++) {
      const interval = 0.4 + i * 0.05; // Increasing intervals
      time += interval;
      notes.push({
        pitch: { step: 'A', octave: 4, alter: 0 },
        startTime: time,
        duration: 0.1,
        confidence: 0.8,
        amplitude: 0.7,
      });
    }
    
    const estimate = estimator.estimateTempo(notes, timestamp);
    
    // Should detect deceleration trend
    expect(estimate.trend).toBe('decelerating');
  });

  it('should mark tempo as stable when consistent', () => {
    const bpm = 120;
    const beatInterval = 60 / bpm;
    const timestamp = Date.now();
    
    const notes: DetectedNote[] = [];
    for (let i = 0; i < 10; i++) {
      notes.push({
        pitch: { step: 'A', octave: 4, alter: 0 },
        startTime: i * beatInterval,
        duration: 0.1,
        confidence: 0.8,
        amplitude: 0.7,
      });
    }
    
    // First estimate
    estimator.estimateTempo(notes, timestamp);
    
    // Second estimate with same tempo
    const notes2: DetectedNote[] = notes.map(n => ({
      ...n,
      startTime: n.startTime + 5, // Shift by 5 seconds
    }));
    const estimate = estimator.estimateTempo(notes2, timestamp + 5000);
    
    expect(estimate.isStable).toBe(true);
  });

  it('should reset state correctly', () => {
    const notes: DetectedNote[] = [
      {
        pitch: { step: 'A', octave: 4, alter: 0 },
        startTime: 0,
        duration: 0.1,
        confidence: 0.8,
        amplitude: 0.7,
      },
    ];
    
    estimator.estimateTempo(notes, Date.now());
    estimator.reset();
    
    // After reset, should return default tempo
    const estimate = estimator.estimateTempo([], Date.now());
    expect(estimate.bpm).toBe(120);
    expect(estimate.confidence).toBe(0);
  });
});

