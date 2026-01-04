/**
 * TypeScript type definitions for the audio analyzer.
 * Based on data model from specs/002-audio-analyzer/data-model.md
 */

/**
 * Represents musical pitch information (note name, octave, accidental).
 */
export interface Pitch {
  step: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  octave: number; // 0-10
  alter: -1 | 0 | 1; // flat, natural, sharp
}

/**
 * Represents a single musical note detected from audio analysis.
 */
export interface DetectedNote {
  pitch: Pitch;
  startTime: number; // seconds relative to audio stream start
  duration: number; // seconds
  confidence: number; // 0-1
  amplitude: number; // 0-1, normalized
  frequency?: number; // Hz, optional (for debugging/analysis)
}

/**
 * Represents tempo (beats per minute) estimation with confidence and variation tracking.
 */
export interface TempoEstimate {
  bpm: number;
  confidence: number; // 0-1
  timestamp: number; // milliseconds
  isStable: boolean;
  trend?: 'steady' | 'accelerating' | 'decelerating';
}

/**
 * Represents the complete output of audio processing.
 */
export interface AudioAnalysisResult {
  timestamp: number; // milliseconds since epoch or relative to audio start
  detectedNotes: DetectedNote[];
  tempoEstimation: TempoEstimate;
  confidence: number; // 0-1, overall confidence in analysis quality
  audioLevel: number; // 0-1, audio input level (for feedback)
}


