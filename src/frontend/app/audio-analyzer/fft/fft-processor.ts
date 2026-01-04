/**
 * FFT processor for frequency domain analysis.
 * Uses Web Audio API AnalyserNode for optimized FFT computation.
 */

/**
 * FFT processor implementation.
 * Wraps Web Audio API AnalyserNode to extract frequency domain data.
 */
export class FFTProcessor {
  /**
   * Get frequency data from audio input.
   * @param analyserNode - Web Audio API AnalyserNode
   * @returns Float32Array of frequency amplitudes
   */
  getFrequencyData(analyserNode: AnalyserNode): Float32Array {
    const bufferLength = analyserNode.frequencyBinCount;
    const frequencyData = new Float32Array(bufferLength);
    analyserNode.getFloatFrequencyData(frequencyData);
    return frequencyData;
  }

  /**
   * Get the frequency resolution (Hz per bin).
   * @param analyserNode - Web Audio API AnalyserNode
   * @param sampleRate - Audio sample rate in Hz
   * @returns Frequency resolution in Hz per bin
   */
  getFrequencyResolution(analyserNode: AnalyserNode, sampleRate: number): number {
    return sampleRate / (2 * analyserNode.frequencyBinCount);
  }
}

