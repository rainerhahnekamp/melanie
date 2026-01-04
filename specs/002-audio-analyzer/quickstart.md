# Quick Start Guide: Audio Analyzer

**Date**: 2025-12-24  
**Purpose**: Developer quick start guide for implementing the audio analyzer feature

## Overview

This guide provides a quick overview of implementing the audio analyzer - a TypeScript library that performs FFT-based pitch detection and tempo estimation from audio input.

## Key Concepts

### Architecture
- **Pure Library**: No UI, no framework dependencies, just the algorithm
- **TypeScript**: Type-safe implementation with comprehensive interfaces
- **Testable**: Designed for unit testing with synthetic audio
- **Real-time**: Optimized for <100ms processing latency

### Data Flow
1. Audio input (AudioBuffer, AudioNode, or Float32Array) → Analyzer
2. FFT processing → Frequency domain data
3. Frequency peak extraction → Detected frequencies
4. Frequency to note mapping → Musical pitches
5. Timing analysis → Tempo estimation
6. Result assembly → AudioAnalysisResult with notes and tempo

### Core Technologies
- **TypeScript**: Latest stable (per master plan)
- **FFT**: Web Audio API AnalyserNode (browser) or custom implementation (Node.js)
- **Testing**: Vitest with synthetic audio generation
- **Reference**: Master plan `001-sheet-music-player` for broader context

## Project Structure

```
src/
├── audio-analyzer/
│   ├── fft/
│   │   └── fft-processor.ts          # FFT frequency analysis
│   ├── pitch-detection/
│   │   ├── pitch-detector.ts         # Note detection from frequencies
│   │   └── note-matcher.ts           # Frequency to note mapping
│   ├── tempo/
│   │   └── tempo-estimator.ts        # BPM estimation and variation tracking
│   ├── analyzer.ts                   # Main analyzer interface
│   └── types.ts                      # TypeScript types

tests/
├── unit/
│   ├── fft/
│   ├── pitch-detection/
│   ├── tempo/
│   ├── analyzer.test.ts
│   └── fixtures/
│       └── synthetic-audio.ts        # Synthetic audio generation
└── helpers/
    └── audio-generator.ts            # Test audio utilities
```

## Implementation Approach

### Phase 1: FFT Processing
- Implement FFT frequency analysis
- Extract frequency domain data
- Handle Web Audio API and Node.js environments
- Unit tests with known frequency inputs

### Phase 2: Pitch Detection
- Extract frequency peaks from FFT output
- Map frequencies to musical notes (A-G, octave, accidental)
- Calculate confidence scores
- Handle harmonics and overtones
- Unit tests with pure tones and note sequences

### Phase 3: Tempo Estimation
- Analyze note timing patterns
- Estimate BPM from intervals
- Track tempo variations (ritardando/accelerando)
- Provide confidence scores
- Unit tests with metronome patterns and tempo variations

### Phase 4: Integration & Testing
- Combine all modules into main analyzer interface
- Comprehensive unit test suite
- Edge case testing (silence, noise, quiet audio)
- Performance validation (<100ms latency)

## Key Implementation Details

### FFT Processing
```typescript
// Process audio buffer through FFT
const frequencyData = fftProcessor.analyze(audioBuffer);
// Extract dominant frequencies
const peaks = extractFrequencyPeaks(frequencyData);
```

### Pitch Detection
```typescript
// Map frequency to musical note
const note = frequencyToNote(frequency, confidence);
// Result: { step: "A", octave: 4, alter: 0 }
```

### Tempo Estimation
```typescript
// Estimate tempo from note timing
const tempo = estimateTempo(detectedNotes, timeWindow);
// Result: { bpm: 120, confidence: 0.95, isStable: true }
```

### Synthetic Audio Generation
```typescript
// Generate pure tone for testing
const sineWave = generateSineWave(440, duration, sampleRate);
// Generate note sequence
const sequence = generateNoteSequence([440, 494, 523], timing);
```

## Testing Strategy

### Unit Tests with Synthetic Audio
- **Pure Tones**: Test pitch detection with known frequencies (440Hz = A4)
- **Note Sequences**: Test timing and order detection
- **Metronome Patterns**: Test tempo estimation accuracy
- **Noise Tests**: Test robustness with added noise
- **Edge Cases**: Silence, very quiet audio, multiple frequencies

### Test Coverage
- Target: 100% code coverage for core algorithm functions
- Focus: FFT processing, pitch detection, tempo estimation
- Validation: All tests pass with synthetic audio inputs

## Performance Targets

- Processing latency: <100ms per analysis cycle (constitution requirement)
- Accuracy: 95% for pure tones (spec requirement SC-001)
- Tempo accuracy: ±5 BPM for steady tempo (spec requirement SC-002)

## Development Workflow

1. **Setup**: Initialize TypeScript project, install Vitest
2. **FFT Module**: Implement FFT processing with tests
3. **Pitch Detection**: Implement note detection with tests
4. **Tempo Estimation**: Implement tempo calculation with tests
5. **Integration**: Combine modules, comprehensive testing
6. **Validation**: Verify performance targets and accuracy

## Common Patterns

### Creating Analyzer Instance
```typescript
const analyzer = new AudioAnalyzer({
  sampleRate: 44100,
  fftSize: 2048
});
```

### Processing Audio
```typescript
const result = analyzer.analyze(audioBuffer);
// Returns: AudioAnalysisResult with detectedNotes and tempoEstimation
```

### Testing with Synthetic Audio
```typescript
const testTone = generateSineWave(440, 1.0, 44100);
const result = analyzer.analyze(testTone);
expect(result.detectedNotes[0].pitch.step).toBe("A");
expect(result.detectedNotes[0].pitch.octave).toBe(4);
```

## Next Steps

1. Review `spec.md` for detailed requirements
2. Review `plan.md` for technical architecture
3. Review `data-model.md` for entity structure
4. Review `research.md` for technical decisions
5. Reference master plan `001-sheet-music-player` for broader context
6. Proceed to `tasks.md` for implementation tasks (after `/speckit.tasks`)

## Resources

- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [FFT Algorithms](https://en.wikipedia.org/wiki/Fast_Fourier_transform)
- [Musical Pitch Standards](https://en.wikipedia.org/wiki/Pitch_(music))
- [Vitest Documentation](https://vitest.dev)
- Master Plan: `001-sheet-music-player` for complete architecture


