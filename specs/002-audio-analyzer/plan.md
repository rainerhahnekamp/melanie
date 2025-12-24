# Implementation Plan: Audio Analyzer

**Branch**: `002-audio-analyzer` | **Date**: 2025-12-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-audio-analyzer/spec.md`
**Related**: Master plan in `001-sheet-music-player` (reference for architecture and research)

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

A TypeScript library that performs FFT-based pitch detection and tempo estimation from audio input. The analyzer processes audio data (AudioBuffer or AudioNode from Web Audio API), detects musical notes with confidence scores, estimates tempo with variation tracking, and provides structured results. This feature includes comprehensive unit tests with synthetic audio inputs to validate the core algorithm. The analyzer is designed to be integrated into the larger sheet music player application (see master plan `001-sheet-music-player`).

## Technical Context

**Language/Version**: 
- TypeScript (latest stable) - per master plan research
- JavaScript runtime (Node.js for testing, browser for future integration)

**Primary Dependencies**: 
- Web Audio API (browser-native, for future integration)
- FFT implementation (Web Audio API AnalyserNode or custom implementation)
- Vitest (latest stable, testing framework) - per master plan research
- TypeScript compiler and type definitions

**Storage**: 
- N/A - This is a pure algorithm library with no persistence requirements
- Test data (synthetic audio) stored as test fixtures

**Testing**: 
- Vitest (latest stable) - per master plan research
- Synthetic audio generation for test inputs
- Unit tests with 100% code coverage target for core algorithm functions

**Target Platform**: 
- Node.js (for unit testing)
- Browser/Web Audio API (for future integration, not required for this feature)
- TypeScript/JavaScript compatible environments

**Project Type**: Single project (TypeScript library) - algorithm-focused, no UI or backend

**Performance Goals**: 
- Audio processing latency: <100ms per analysis cycle (per spec requirement SC-003 and master plan constitution)
- Real-time processing capability (for future integration)
- Efficient FFT computation

**Constraints**: 
- Must work with Web Audio API input format (AudioBuffer or AudioNode)
- Must handle single instrument audio (not ensemble) - per spec requirement FR-006
- Must process in real-time with low latency - per spec requirement FR-007
- Must handle edge cases (silence, noise, quiet audio, multiple frequencies) - per spec requirement FR-010
- Unit tests must use synthetic audio (no real microphone input required) - per spec

**Scale/Scope**: 
- Single TypeScript library/module
- Core algorithm functions (FFT analysis, pitch detection, tempo estimation)
- Comprehensive unit test suite
- No UI, no integration, no persistence

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Real-time Audio Processing & Performance
- ✅ **Compliant**: Plan uses FFT-based analysis optimized for real-time processing
- ✅ **Compliant**: Target latency <100ms per analysis cycle (per spec SC-003 and constitution)
- ✅ **Compliant**: Algorithm designed for browser performance constraints
- ⚠️ **Note**: Web Worker implementation deferred (will be added in integration phase, not part of this feature)

### II. Sheet Music Standardization
- ⚠️ **Not Applicable**: This feature does not include sheet music processing (deferred to future features)

### III. Position Tracking & Synchronization
- ⚠️ **Not Applicable**: Position tracking integration deferred to future features
- ✅ **Compliant**: Tempo estimation supports future position tracking (handles tempo variations)

### IV. Separation of Concerns (Angular & Spring)
- ✅ **Compliant**: Analyzer is a pure library with no UI or backend dependencies
- ✅ **Compliant**: Algorithm logic separated from presentation (no UI in this feature)
- ✅ **Compliant**: Designed for client-side use (Web Audio API), aligns with constitution

### V. API-First Design
- ⚠️ **Not Applicable**: This is a TypeScript library, not an API service
- ✅ **Compliant**: Library interface is well-defined for future integration

### VI. Testing & Validation
- ✅ **Compliant**: Comprehensive unit tests with synthetic audio inputs (per spec FR-011)
- ✅ **Compliant**: Unit tests for core algorithm functions (per spec FR-012, FR-013, FR-014)
- ✅ **Compliant**: Target 100% code coverage for core algorithm (per spec SC-004)

**Gate Status**: ✅ **PASS** - All applicable principles addressed. This feature focuses on the core algorithm with comprehensive testing, setting the foundation for future integration.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── frontend/
│   ├── app/                          # Angular application (future features)
│   │   └── audio-analyzer/           # Audio analyzer library (this feature)
│   │       ├── fft/
│   │       │   └── fft-processor.ts  # FFT frequency analysis using AnalyserNode
│   │       ├── pitch-detection/
│   │       │   ├── pitch-detector.ts # Note detection from frequencies
│   │       │   └── note-matcher.ts   # Frequency to note mapping
│   │       ├── tempo/
│   │       │   └── tempo-estimator.ts # BPM estimation and variation tracking
│   │       ├── analyzer.ts           # Main analyzer interface
│   │       └── types.ts              # TypeScript types
│   ├── assets/
│   └── index.html

backend/
├── src/
│   └── main/java/com/melanie/        # Spring Boot (future features)
└── pom.xml

tests/
├── unit/
│   └── audio-analyzer/
│       ├── fft/
│       │   └── fft-processor.test.ts
│       ├── pitch-detection/
│       │   ├── pitch-detector.test.ts
│       │   └── note-matcher.test.ts
│       ├── tempo/
│       │   └── tempo-estimator.test.ts
│       ├── analyzer.test.ts
│       └── fixtures/
│           └── synthetic-audio.ts    # Synthetic audio generation utilities
└── helpers/
    └── audio-generator.ts            # Test audio generation (sine waves, metronome, etc.)
```

**Structure Decision**: Web application structure (frontend + backend) selected to align with master plan. The audio analyzer library is placed in `src/frontend/app/audio-analyzer/` as a feature module within the Angular app structure. Angular application code will go in `src/frontend/app/` in future features. Backend structure is prepared for Spring Boot. Unit tests use Vitest in full browser mode, enabling Web Audio API for testing. This structure follows Angular feature-based organization while keeping the analyzer as a focused module within the app.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
