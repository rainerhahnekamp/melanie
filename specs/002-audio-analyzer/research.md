# Research: Audio Analyzer Technical Decisions

**Date**: 2025-12-24  
**Purpose**: Technical decisions for audio analyzer feature. References master plan `001-sheet-music-player` for broader architecture context.

## Overview

This feature implements the core audio analysis algorithm (FFT-based pitch detection and tempo estimation) as a standalone TypeScript library. Most technical decisions reference the master plan research. This document focuses on decisions specific to the analyzer implementation.

## Language/Version Decisions

**Decision**: TypeScript (latest stable)

**Rationale**:
- TypeScript provides type safety for audio processing algorithms
- Aligns with master plan technology stack (frontend will be TypeScript/Angular)
- Enables better code quality and maintainability for complex algorithms
- Latest stable version provides modern language features

**Reference**: Master plan `001-sheet-music-player/research.md` - Frontend: TypeScript & Angular section

## FFT and Pitch Detection Implementation Approach

**Decision**: 
- Use Web Audio API AnalyserNode for FFT (frequency domain data)
- Implement custom pitch detection algorithm from frequency data
- Vitest runs in full browser mode, so Web Audio API is available for tests
- No separate FFT library needed

**Rationale**:
- Web Audio API AnalyserNode provides optimized FFT implementation
- Custom pitch detection allows full control and learning of algorithm
- Vitest full browser mode enables Web Audio API in test environment
- Efficient FFT is critical for real-time processing (<100ms latency requirement)
- Single implementation path (browser) simplifies codebase
- Custom implementation aligns with feature goal of understanding the algorithm

**Alternatives considered**:
- **pitchfinder library**: Provides proven pitch detection algorithms (YIN, AMDF, Dynamic Wavelet). Pros: More accurate, battle-tested. Cons: External dependency, less learning opportunity, may be overkill for MVP. Decision: Start with custom implementation for MVP, can migrate to pitchfinder later if needed.
- Separate FFT library for testing: Not needed since Vitest runs in browser
- Pure custom FFT: More work, Web Audio API is optimized and sufficient
- Server-side FFT: Not needed, client-side processing per master plan

## Pitch Detection Algorithm

**Decision**: 
- Extract frequency peaks from FFT output
- Map frequencies to musical notes using standard pitch mapping (A4 = 440Hz)
- Apply confidence scoring based on peak strength and clarity
- Handle harmonics and overtones

**Rationale**:
- Frequency peak extraction is standard approach for pitch detection
- Standard pitch mapping ensures compatibility with musical notation
- Confidence scoring enables handling of ambiguous cases (noise, multiple frequencies)
- Harmonic handling improves accuracy for real instruments

**Reference**: Master plan `001-sheet-music-player/research.md` - Audio Analysis Algorithm Approach section

## Tempo Estimation Algorithm

**Decision**: 
- Analyze note timing patterns to estimate BPM
- Use adaptive windowing to track tempo changes
- Provide confidence scores for tempo estimates
- Handle ritardando/accelerando with sliding window approach

**Rationale**:
- Timing pattern analysis is standard for tempo estimation
- Adaptive windowing enables tracking tempo variations
- Confidence scoring indicates reliability of tempo estimate
- Sliding window approach balances responsiveness and stability

**Reference**: Master plan `001-sheet-music-player/research.md` - Position Tracking Algorithm Details section

## Synthetic Audio Generation for Testing

**Decision**: 
- Generate pure sine waves for single note tests
- Generate note sequences with known timing for tempo tests
- Add noise programmatically for robustness tests
- Create metronome patterns for tempo validation

**Rationale**:
- Pure tones provide known ground truth for pitch detection tests
- Known sequences enable validation of timing and tempo estimation
- Programmatic noise addition tests edge case handling
- Metronome patterns provide precise tempo ground truth

**Alternatives considered**:
- Real audio recordings: Less reliable, harder to control test conditions
- Pre-recorded test files: Less flexible, harder to generate edge cases

## Testing Framework

**Decision**: Vitest (latest stable)

**Rationale**:
- Vitest is Angular 21's default testing framework (per master plan research)
- Fast execution and modern tooling
- Good TypeScript support
- Works well for algorithm testing

**Reference**: Master plan `001-sheet-music-player/research.md` - Testing Framework Decisions section

## Library Structure

**Decision**: 
- Pure TypeScript library with no external runtime dependencies (except Web Audio API types)
- Modular structure: FFT, pitch detection, tempo estimation as separate modules
- Well-defined interface for future integration
- No UI or framework dependencies

**Rationale**:
- Pure library enables testing in isolation
- Modular structure supports independent testing and maintenance
- Clear interface enables integration into larger application
- No framework dependencies keeps library focused and reusable

## Performance Considerations

**Decision**: 
- Optimize FFT processing for <100ms latency
- Use efficient algorithms for frequency peak detection
- Minimize memory allocations in hot paths
- Profile and optimize critical functions

**Rationale**:
- <100ms latency is constitution requirement (per master plan)
- Efficient algorithms essential for real-time processing
- Memory optimization prevents garbage collection pauses
- Profiling ensures performance targets are met

**Reference**: Master plan `001-sheet-music-player/research.md` - Performance Goals section

## Summary

All technical decisions align with master plan research and constitution principles. The analyzer is designed as a focused, testable library that can be integrated into the larger application. Key decisions:

1. ✅ **TypeScript**: Latest stable, aligns with master plan
2. ✅ **FFT**: Web Audio API AnalyserNode (no separate library needed)
3. ✅ **Pitch Detection**: Custom implementation from frequency data (pitchfinder considered as alternative)
4. ✅ **Tempo Estimation**: Adaptive windowing with tempo variation tracking
5. ✅ **Testing**: Vitest with synthetic audio generation
6. ✅ **Structure**: Feature module in Angular app structure
7. ✅ **Performance**: Optimized for <100ms latency

All decisions reference and align with master plan `001-sheet-music-player/research.md`.

