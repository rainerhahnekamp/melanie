import { describe, it, expect } from 'vitest';
import { frequencyToPitch, pitchToFrequency } from '../../pitch-detection/note-matcher';
import { NOTE_FREQUENCIES } from '../fixtures/synthetic-audio';

describe('note-matcher', () => {
  describe('frequencyToPitch', () => {
    it('should map A4 (440Hz) correctly', () => {
      const pitch = frequencyToPitch(NOTE_FREQUENCIES.A4);
      expect(pitch.step).toBe('A');
      expect(pitch.octave).toBe(4);
      expect(pitch.alter).toBe(0);
    });

    it('should map C4 (261.63Hz) correctly', () => {
      const pitch = frequencyToPitch(NOTE_FREQUENCIES.C4);
      expect(pitch.step).toBe('C');
      expect(pitch.octave).toBe(4);
      expect(pitch.alter).toBe(0);
    });

    it('should map A5 (880Hz) correctly', () => {
      const pitch = frequencyToPitch(NOTE_FREQUENCIES.A5);
      expect(pitch.step).toBe('A');
      expect(pitch.octave).toBe(5);
      expect(pitch.alter).toBe(0);
    });

    it('should handle sharp notes', () => {
      const cSharpFreq = NOTE_FREQUENCIES.C4 * Math.pow(2, 1 / 12); // C#4
      const pitch = frequencyToPitch(cSharpFreq);
      expect(pitch.step).toBe('C');
      expect(pitch.octave).toBe(4);
      expect(pitch.alter).toBe(1);
    });

    it('should throw error for zero frequency', () => {
      expect(() => frequencyToPitch(0)).toThrow('Frequency must be positive');
    });

    it('should throw error for negative frequency', () => {
      expect(() => frequencyToPitch(-100)).toThrow('Frequency must be positive');
    });
  });

  describe('pitchToFrequency', () => {
    it('should map A4 correctly', () => {
      const frequency = pitchToFrequency({ step: 'A', octave: 4, alter: 0 });
      expect(frequency).toBeCloseTo(NOTE_FREQUENCIES.A4, 1);
    });

    it('should map C4 correctly', () => {
      const frequency = pitchToFrequency({ step: 'C', octave: 4, alter: 0 });
      expect(frequency).toBeCloseTo(NOTE_FREQUENCIES.C4, 1);
    });

    it('should map A5 correctly', () => {
      const frequency = pitchToFrequency({ step: 'A', octave: 5, alter: 0 });
      expect(frequency).toBeCloseTo(NOTE_FREQUENCIES.A5, 1);
    });

    it('should handle sharp notes', () => {
      const cSharpFreq = pitchToFrequency({ step: 'C', octave: 4, alter: 1 });
      const expectedFreq = NOTE_FREQUENCIES.C4 * Math.pow(2, 1 / 12);
      expect(cSharpFreq).toBeCloseTo(expectedFreq, 1);
    });

    it('should handle flat notes', () => {
      const bFlatFreq = pitchToFrequency({ step: 'B', octave: 4, alter: -1 });
      const expectedFreq = NOTE_FREQUENCIES.C4 * Math.pow(2, -1 / 12);
      expect(bFlatFreq).toBeCloseTo(expectedFreq, 1);
    });
  });

  describe('round-trip conversion', () => {
    it('should round-trip A4 correctly', () => {
      const originalPitch = { step: 'A' as const, octave: 4, alter: 0 as const };
      const frequency = pitchToFrequency(originalPitch);
      const convertedPitch = frequencyToPitch(frequency);
      expect(convertedPitch).toEqual(originalPitch);
    });

    it('should round-trip C#5 correctly', () => {
      const originalPitch = { step: 'C' as const, octave: 5, alter: 1 as const };
      const frequency = pitchToFrequency(originalPitch);
      const convertedPitch = frequencyToPitch(frequency);
      expect(convertedPitch).toEqual(originalPitch);
    });
  });
});

