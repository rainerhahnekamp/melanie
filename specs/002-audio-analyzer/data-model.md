# Data Model: Audio Analyzer

**Date**: 2025-12-24  
**Source**: Feature specification entities and requirements

## Overview

The data model for the audio analyzer consists of TypeScript interfaces/types representing the input and output of audio processing. Since this is a pure algorithm library with no persistence requirements, the model focuses on in-memory data structures for audio analysis results.

## Entities

### AudioAnalysisResult

**Purpose**: Represents the complete output of audio processing, containing detected notes, tempo estimation, and overall analysis metadata.

**Attributes**:
- `timestamp` (number): When this analysis was performed (milliseconds since epoch or relative to audio start)
- `detectedNotes` (array of DetectedNote): Array of detected notes with timing and confidence
- `tempoEstimation` (TempoEstimate): Estimated tempo information
- `confidence` (number, 0-1): Overall confidence in the analysis quality
- `audioLevel` (number, 0-1): Audio input level (for feedback, indicates if audio is too quiet)

**Relationships**:
- Contains multiple `DetectedNote` entities
- Contains one `TempoEstimate` entity

**Validation Rules**:
- `detectedNotes` array may be empty (silence or no notes detected)
- `confidence` must be between 0 and 1
- `audioLevel` must be between 0 and 1
- `timestamp` must be >= 0

**State Transitions**:
- Generated for each analysis cycle
- Transient (in-memory only, no persistence)

---

### DetectedNote

**Purpose**: Represents a single musical note detected from audio analysis.

**Attributes**:
- `pitch` (Pitch): Detected pitch information (step, octave, alter)
- `startTime` (number): Start time in seconds relative to audio stream start
- `duration` (number): Duration in seconds
- `confidence` (number, 0-1): Confidence in pitch detection accuracy
- `amplitude` (number, 0-1): Note amplitude/volume (normalized)
- `frequency` (number, optional): Detected frequency in Hz (for debugging/analysis)

**Relationships**:
- Part of `AudioAnalysisResult` (many-to-one)

**Validation Rules**:
- `pitch` must be valid (see Pitch type definition)
- `startTime` must be >= 0
- `duration` must be > 0
- `confidence` must be between 0 and 1
- `amplitude` must be between 0 and 1
- `frequency` must be > 0 if provided

---

### Pitch

**Purpose**: Represents musical pitch information (note name, octave, accidental).

**Attributes**:
- `step` (string, enum: "A" | "B" | "C" | "D" | "E" | "F" | "G"): Note name
- `octave` (number): Octave number (typically 0-10)
- `alter` (number, enum: -1 | 0 | 1): Accidental (-1 = flat, 0 = natural, 1 = sharp)

**Validation Rules**:
- `step` must be one of: A, B, C, D, E, F, G
- `octave` must be between 0 and 10 (reasonable range)
- `alter` must be -1, 0, or 1

**Examples**:
- A4 (440Hz): `{ step: "A", octave: 4, alter: 0 }`
- C#5: `{ step: "C", octave: 5, alter: 1 }`
- Bb3: `{ step: "B", octave: 3, alter: -1 }`

---

### TempoEstimate

**Purpose**: Represents tempo (beats per minute) estimation with confidence and variation tracking.

**Attributes**:
- `bpm` (number): Estimated tempo in beats per minute
- `confidence` (number, 0-1): Confidence in tempo estimate accuracy
- `timestamp` (number): When this tempo was estimated (milliseconds)
- `isStable` (boolean): Whether tempo is stable or changing
- `trend` (string, enum: "steady" | "accelerating" | "decelerating", optional): Tempo trend direction

**Relationships**:
- Part of `AudioAnalysisResult` (one-to-one)

**Validation Rules**:
- `bpm` must be > 0 and reasonable (e.g., 20-300 BPM)
- `confidence` must be between 0 and 1
- `timestamp` must be >= 0
- `trend` must be one of the enum values if provided

**State Transitions**:
- Updated continuously as audio is analyzed
- Reflects current tempo state (may change with ritardando/accelerando)

---

## TypeScript Interface Definitions

```typescript
interface AudioAnalysisResult {
  timestamp: number;
  detectedNotes: DetectedNote[];
  tempoEstimation: TempoEstimate;
  confidence: number; // 0-1
  audioLevel: number; // 0-1
}

interface DetectedNote {
  pitch: Pitch;
  startTime: number; // seconds
  duration: number; // seconds
  confidence: number; // 0-1
  amplitude: number; // 0-1
  frequency?: number; // Hz, optional
}

interface Pitch {
  step: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  octave: number; // 0-10
  alter: -1 | 0 | 1; // flat, natural, sharp
}

interface TempoEstimate {
  bpm: number;
  confidence: number; // 0-1
  timestamp: number;
  isStable: boolean;
  trend?: "steady" | "accelerating" | "decelerating";
}
```

## Input Types

### AudioInput

**Purpose**: Represents audio input to the analyzer (from Web Audio API).

**Types**:
- `AudioBuffer`: Pre-recorded audio data
- `AudioNode`: Live audio stream (AnalyserNode)
- `Float32Array`: Raw audio samples (for testing with synthetic audio)

**Validation Rules**:
- AudioBuffer must have valid sample rate (> 0)
- Audio samples must be valid numbers (not NaN, not Infinity)
- Sample rate should be reasonable (e.g., 44100 Hz, 48000 Hz)

---

## Relationships Summary

```
AudioAnalysisResult (1) ──< (many) DetectedNote
AudioAnalysisResult (1) ──< (1) TempoEstimate

DetectedNote (1) ──< (1) Pitch
```

## Validation Summary

- All numeric values must be within reasonable ranges
- All confidence scores must be between 0 and 1
- All timestamps must be >= 0
- All durations must be > 0
- All enum values must match defined options
- Pitch values must be valid (step A-G, octave 0-10, alter -1/0/1)
- BPM values must be reasonable (20-300 BPM)

## Notes

- All entities are transient (in-memory only)
- No persistence required for this feature
- Types are designed for TypeScript with strict type checking
- Interfaces align with master plan data model (`001-sheet-music-player/data-model.md`) for future integration


