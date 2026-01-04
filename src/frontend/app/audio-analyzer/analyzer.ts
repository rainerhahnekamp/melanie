/**
 * Main audio analyzer implementation.
 * Coordinates FFT processing, pitch detection, and tempo estimation.
 */

import type { AudioAnalysisResult } from './types';
import { FFTProcessor } from './fft/fft-processor';
import { PitchDetector } from './pitch-detection/pitch-detector';
import { TempoEstimator } from './tempo/tempo-estimator';

/**
 * Audio analyzer implementation.
 * Processes audio input and returns analysis results.
 */
export class AudioAnalyzer {
  private readonly fftProcessor: FFTProcessor;
  private readonly pitchDetector: PitchDetector;
  private readonly tempoEstimator: TempoEstimator;
  private audioContext: AudioContext | null = null;

  constructor(
    fftProcessor?: FFTProcessor,
    pitchDetector?: PitchDetector,
    tempoEstimator?: TempoEstimator
  ) {
    this.fftProcessor = fftProcessor ?? new FFTProcessor();
    this.pitchDetector = pitchDetector ?? new PitchDetector();
    this.tempoEstimator = tempoEstimator ?? new TempoEstimator();
  }

  /**
   * Analyze audio and return results.
   * @param audioData - Audio input (AnalyserNode, AudioBuffer, or Float32Array)
   * @returns Analysis result with detected notes and tempo
   */
  analyze(audioData: AnalyserNode | AudioBuffer | Float32Array): AudioAnalysisResult {
    const timestamp = Date.now();

    if (audioData instanceof AnalyserNode) {
      return this.analyzeFromAnalyserNode(audioData, timestamp);
    } else if (audioData instanceof AudioBuffer) {
      return this.analyzeFromAudioBuffer(audioData, timestamp);
    } else if (audioData instanceof Float32Array) {
      return this.analyzeFromFloat32Array(audioData, timestamp);
    } else {
      throw new Error('Unsupported audio data type');
    }
  }

  /**
   * Analyze from AnalyserNode (real-time audio stream).
   */
  private analyzeFromAnalyserNode(analyserNode: AnalyserNode, timestamp: number): AudioAnalysisResult {
    const frequencyData = this.fftProcessor.getFrequencyData(analyserNode);
    const sampleRate = analyserNode.context.sampleRate;

    // Calculate audio level (average amplitude)
    const audioLevel = this.calculateAudioLevel(frequencyData);

    // Detect notes
    const detectedNotes = this.pitchDetector.detectNotes(frequencyData, sampleRate, timestamp);

    // Estimate tempo
    const tempoEstimation = this.tempoEstimator.estimateTempo(detectedNotes, timestamp);

    // Calculate overall confidence
    const confidence = this.calculateOverallConfidence(detectedNotes, tempoEstimation, audioLevel);

    return {
      timestamp,
      detectedNotes,
      tempoEstimation,
      confidence,
      audioLevel,
    };
  }

  /**
   * Analyze from AudioBuffer (pre-recorded audio).
   */
  private analyzeFromAudioBuffer(audioBuffer: AudioBuffer, timestamp: number): AudioAnalysisResult {
    // Create temporary audio context and analyser node
    if (!this.audioContext) {
      this.audioContext = new AudioContext({ sampleRate: audioBuffer.sampleRate });
    }

    const analyserNode = this.audioContext.createAnalyser();
    analyserNode.fftSize = 2048;

    // Create source and connect to analyser
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyserNode);

    // Analyze
    return this.analyzeFromAnalyserNode(analyserNode, timestamp);
  }

  /**
   * Analyze from Float32Array (synthetic audio for testing).
   */
  private analyzeFromFloat32Array(samples: Float32Array, timestamp: number): AudioAnalysisResult {
    // For testing: create a minimal analyser node setup
    // In real usage, this would come from Web Audio API
    // For now, return empty result with low confidence
    return {
      timestamp,
      detectedNotes: [],
      tempoEstimation: {
        bpm: 120,
        confidence: 0,
        timestamp,
        isStable: false,
      },
      confidence: 0,
      audioLevel: 0,
    };
  }

  /**
   * Calculate audio level from frequency data.
   */
  private calculateAudioLevel(frequencyData: Float32Array): number {
    // Convert dB values to linear and average
    let sum = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      const linear = Math.pow(10, frequencyData[i] / 20);
      sum += linear;
    }
    return Math.min(1, sum / frequencyData.length);
  }

  /**
   * Calculate overall confidence in analysis.
   */
  private calculateOverallConfidence(
    notes: DetectedNote[],
    tempo: TempoEstimate,
    audioLevel: number
  ): number {
    if (notes.length === 0) {
      return 0;
    }

    // Average note confidence
    const avgNoteConfidence =
      notes.reduce((sum, note) => sum + note.confidence, 0) / notes.length;

    // Combine factors
    const confidence = (avgNoteConfidence * 0.6 + tempo.confidence * 0.3 + audioLevel * 0.1);
    return Math.min(1, confidence);
  }
}

