import { describe, it, expect, beforeEach } from 'vitest';
import { FFTProcessor } from '../../fft/fft-processor';

describe('FFTProcessor', () => {
  let processor: FFTProcessor;
  let audioContext: AudioContext;
  let analyserNode: AnalyserNode;

  beforeEach(() => {
    processor = new FFTProcessor();
    audioContext = new AudioContext();
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
  });

  it('should get frequency data from AnalyserNode', () => {
    const frequencyData = processor.getFrequencyData(analyserNode);
    expect(frequencyData).toBeInstanceOf(Float32Array);
    expect(frequencyData.length).toBe(analyserNode.frequencyBinCount);
  });

  it('should calculate frequency resolution correctly', () => {
    const sampleRate = audioContext.sampleRate;
    const resolution = processor.getFrequencyResolution(analyserNode, sampleRate);
    const expectedResolution = sampleRate / (2 * analyserNode.frequencyBinCount);
    expect(resolution).toBeCloseTo(expectedResolution, 1);
  });

  it('should return valid frequency data range', () => {
    const frequencyData = processor.getFrequencyData(analyserNode);
    // Frequency data from AnalyserNode is in dB, typically -Infinity to 0
    for (let i = 0; i < frequencyData.length; i++) {
      expect(frequencyData[i]).toBeLessThanOrEqual(0);
      expect(Number.isFinite(frequencyData[i]) || frequencyData[i] === -Infinity).toBe(true);
    }
  });
});

