/**
 * Tempo estimation from note timing patterns.
 * Analyzes note intervals to estimate BPM and track tempo variations.
 */

import type { DetectedNote, TempoEstimate } from '../types';

/**
 * Tempo estimator implementation.
 * Estimates tempo from detected notes using interval analysis.
 */
export class TempoEstimator {
  private readonly minNotesForEstimate: number;
  private readonly windowSize: number; // seconds
  private readonly minBpm: number;
  private readonly maxBpm: number;

  private previousEstimate: TempoEstimate | null = null;
  private noteHistory: Array<{ time: number; timestamp: number }> = [];

  constructor(
    minNotesForEstimate: number = 4,
    windowSize: number = 5, // seconds
    minBpm: number = 20,
    maxBpm: number = 300
  ) {
    this.minNotesForEstimate = minNotesForEstimate;
    this.windowSize = windowSize;
    this.minBpm = minBpm;
    this.maxBpm = maxBpm;
  }

  /**
   * Estimate tempo from detected notes.
   * @param notes - Array of detected notes with timing information
   * @param timestamp - Current timestamp in milliseconds
   * @returns Tempo estimate with confidence and trend
   */
  estimateTempo(notes: DetectedNote[], timestamp: number): TempoEstimate {
    // Add new notes to history
    for (const note of notes) {
      this.noteHistory.push({
        time: note.startTime,
        timestamp,
      });
    }

    // Remove old notes outside window
    const cutoffTime = timestamp / 1000 - this.windowSize;
    this.noteHistory = this.noteHistory.filter((n) => n.time >= cutoffTime);

    // Need minimum notes to estimate
    if (this.noteHistory.length < this.minNotesForEstimate) {
      return {
        bpm: 120, // Default tempo
        confidence: 0,
        timestamp,
        isStable: false,
      };
    }

    // Calculate intervals between consecutive notes
    const intervals: number[] = [];
    const sortedNotes = [...this.noteHistory].sort((a, b) => a.time - b.time);

    for (let i = 1; i < sortedNotes.length; i++) {
      const interval = sortedNotes[i].time - sortedNotes[i - 1].time;
      if (interval > 0 && interval < 5) {
        // Reasonable interval (0-5 seconds)
        intervals.push(interval);
      }
    }

    if (intervals.length === 0) {
      return {
        bpm: 120,
        confidence: 0,
        timestamp,
        isStable: false,
      };
    }

    // Find most common interval (mode)
    const intervalCounts = new Map<number, number>();
    for (const interval of intervals) {
      const rounded = Math.round(interval * 10) / 10; // Round to 0.1s
      intervalCounts.set(rounded, (intervalCounts.get(rounded) || 0) + 1);
    }

    let mostCommonInterval = intervals[0];
    let maxCount = 0;
    for (const [interval, count] of intervalCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonInterval = interval;
      }
    }

    // Calculate BPM from interval (beats per minute = 60 / interval in seconds)
    let bpm = 60 / mostCommonInterval;

    // Handle multiple beats per interval (if interval is > 1 second, might be multiple beats)
    if (mostCommonInterval > 2) {
      // Try dividing by 2, 3, 4 to find reasonable BPM
      for (const divisor of [2, 3, 4]) {
        const candidateBpm = (60 / mostCommonInterval) * divisor;
        if (candidateBpm >= this.minBpm && candidateBpm <= this.maxBpm) {
          bpm = candidateBpm;
          break;
        }
      }
    }

    // Clamp to reasonable range
    bpm = Math.max(this.minBpm, Math.min(this.maxBpm, bpm));

    // Calculate confidence based on consistency
    const consistency = maxCount / intervals.length;
    const confidence = Math.min(1, consistency * 0.8 + (intervals.length / 20) * 0.2);

    // Determine stability and trend
    const isStable = this.previousEstimate
      ? Math.abs(bpm - this.previousEstimate.bpm) < 5
      : false;

    let trend: 'steady' | 'accelerating' | 'decelerating' | undefined;
    if (this.previousEstimate) {
      const bpmDiff = bpm - this.previousEstimate.bpm;
      if (Math.abs(bpmDiff) < 2) {
        trend = 'steady';
      } else if (bpmDiff > 0) {
        trend = 'accelerating';
      } else {
        trend = 'decelerating';
      }
    }

    const estimate: TempoEstimate = {
      bpm,
      confidence,
      timestamp,
      isStable,
      trend,
    };

    this.previousEstimate = estimate;
    return estimate;
  }

  /**
   * Reset tempo estimation state.
   */
  reset(): void {
    this.previousEstimate = null;
    this.noteHistory = [];
  }
}

