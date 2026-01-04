/**
 * Pitch detection from frequency domain data.
 * Extracts frequency peaks and maps them to musical notes.
 */

import type { DetectedNote } from '../types';
import { frequencyToPitch } from './note-matcher';

/**
 * Pitch detector implementation.
 * Detects notes from frequency data by finding peaks and mapping to pitches.
 */
export class PitchDetector {
  constructor(
    private readonly minAmplitude = -60, // dB, minimum amplitude to consider
    private readonly peakThreshold = 0.3, // ratio, peak must be this much higher than neighbors
    private readonly minConfidence = 0.3 // minimum confidence to report a note
  ) {}

  /**
   * Detect notes from frequency data.
   * @param frequencyData - Frequency domain data from FFT (in dB)
   * @param sampleRate - Audio sample rate in Hz
   * @param timestamp - Current timestamp in milliseconds
   * @returns Array of detected notes
   */
  detectNotes(
    frequencyData: Float32Array,
    sampleRate: number,
    timestamp: number
  ): DetectedNote[] {
    const notes: DetectedNote[] = [];
    const frequencyResolution = sampleRate / (2 * frequencyData.length);

    // Find frequency peaks
    const peaks = this.findPeaks(frequencyData);

    for (const peak of peaks) {
      const frequency = peak.bin * frequencyResolution;
      const amplitude = this.dbToLinear(peak.amplitude);

      // Skip if amplitude is too low
      if (amplitude < this.minConfidence) {
        continue;
      }

      try {
        const pitch = frequencyToPitch(frequency);
        const confidence = this.calculateConfidence(peak, frequencyData);

        if (confidence >= this.minConfidence) {
          notes.push({
            pitch,
            startTime: timestamp / 1000, // Convert to seconds
            duration: 0.1, // Default duration, will be refined in future iterations
            confidence,
            amplitude,
            frequency,
          });
        }
      } catch (error) {
        // Skip invalid frequencies
        continue;
      }
    }

    return notes;
  }

  /**
   * Find peaks in frequency data.
   * @param frequencyData - Frequency domain data
   * @returns Array of peak information
   */
  private findPeaks(frequencyData: Float32Array): Array<{ bin: number; amplitude: number }> {
    const peaks: Array<{ bin: number; amplitude: number }> = [];
    const windowSize = 3; // Check neighbors on both sides

    for (let i = windowSize; i < frequencyData.length - windowSize; i++) {
      const amplitude = frequencyData[i];

      // Skip if below minimum amplitude
      if (amplitude < this.minAmplitude) {
        continue;
      }

      // Check if this is a local maximum
      let isPeak = true;
      for (let j = i - windowSize; j <= i + windowSize; j++) {
        if (j !== i && frequencyData[j] >= amplitude) {
          isPeak = false;
          break;
        }
      }

      if (isPeak) {
        // Check if significantly higher than neighbors
        const avgNeighbor = this.averageNeighbors(frequencyData, i, windowSize);
        if (amplitude - avgNeighbor >= this.peakThreshold * 10) {
          // Convert threshold to dB scale (rough approximation)
          peaks.push({ bin: i, amplitude });
        }
      }
    }

    return peaks;
  }

  /**
   * Calculate average of neighboring bins.
   */
  private averageNeighbors(data: Float32Array, index: number, windowSize: number): number {
    let sum = 0;
    let count = 0;
    for (let i = index - windowSize; i <= index + windowSize; i++) {
      if (i !== index && i >= 0 && i < data.length) {
        sum += data[i];
        count++;
      }
    }
    return count > 0 ? sum / count : 0;
  }

  /**
   * Calculate confidence score for a detected note.
   */
  private calculateConfidence(
    peak: { bin: number; amplitude: number },
    frequencyData: Float32Array
  ): number {
    // Base confidence from amplitude (normalize from dB to 0-1)
    const normalizedAmplitude = Math.max(0, Math.min(1, (peak.amplitude - this.minAmplitude) / 60));
    
    // Boost confidence if peak is sharp (high contrast with neighbors)
    const avgNeighbor = this.averageNeighbors(frequencyData, peak.bin, 3);
    const contrast = Math.max(0, peak.amplitude - avgNeighbor) / 20; // Normalize contrast
    
    // Combine factors
    return Math.min(1, (normalizedAmplitude * 0.7 + contrast * 0.3));
  }

  /**
   * Convert dB to linear amplitude (0-1).
   */
  private dbToLinear(db: number): number {
    return Math.pow(10, db / 20);
  }
}

