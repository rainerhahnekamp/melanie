# Feature Specification: Audio Analyzer

**Application Name**: Melanie  
**Feature Branch**: `002-audio-analyzer`  
**Created**: 2025-12-23  
**Status**: Draft  
**Related**: Master plan in `001-sheet-music-player` (reference for architecture and research)

**Input**: Create an audio analyzer that performs FFT-based pitch detection from microphone input. The analyzer should detect musical notes in real-time, estimate tempo, and provide confidence scores. This feature includes comprehensive unit tests with synthetic audio inputs to validate the core algorithm.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Audio Pitch Detection (Priority: P1)

A developer creates an audio analyzer that processes audio input and detects musical pitches. The analyzer uses FFT-based frequency analysis to identify which notes are being played, along with their timing and confidence scores.

**Why this priority**: This is the core algorithm that enables all position tracking functionality. Without accurate pitch detection, the application cannot determine the current position in sheet music.

**Independent Test**: Can be fully tested by providing synthetic audio input (generated test tones) to the analyzer and verifying that detected pitches match expected notes. This delivers immediate value by validating the core audio processing algorithm.

**Acceptance Scenarios**:

1. **Given** audio input containing a single note (e.g., A4 at 440Hz), **When** the analyzer processes the audio, **Then** it detects the correct pitch with high confidence
2. **Given** audio input containing multiple sequential notes, **When** the analyzer processes the audio, **Then** it detects each note with correct timing
3. **Given** audio input with background noise, **When** the analyzer processes the audio, **Then** it still detects the primary note with appropriate confidence scoring
4. **Given** audio input that is too quiet or contains no clear notes, **When** the analyzer processes the audio, **Then** it returns low confidence or empty results
5. **Given** audio input with tempo variations, **When** the analyzer processes the audio, **Then** it estimates tempo changes accurately

---

### User Story 2 - Tempo Estimation (Priority: P1)

The audio analyzer estimates the tempo (beats per minute) of the music being played, adapting to tempo variations such as ritardando and accelerando.

**Why this priority**: Tempo estimation is essential for matching detected notes to sheet music positions. Accurate tempo tracking enables the system to handle tempo variations during performance.

**Independent Test**: Can be fully tested by providing audio input with known tempo (e.g., metronome clicks or synthesized music) and verifying that estimated tempo matches the expected BPM within acceptable tolerance.

**Acceptance Scenarios**:

1. **Given** audio input with steady tempo, **When** the analyzer processes the audio, **Then** it estimates tempo within ±5 BPM accuracy
2. **Given** audio input with gradual tempo change (ritardando), **When** the analyzer processes the audio, **Then** it tracks the tempo change and updates the estimate
3. **Given** audio input with sudden tempo change (accelerando), **When** the analyzer processes the audio, **Then** it adapts to the new tempo quickly
4. **Given** audio input with irregular timing, **When** the analyzer processes the audio, **Then** it provides a best-effort tempo estimate with confidence indication

---

### User Story 3 - Unit Testing with Synthetic Audio (Priority: P1)

The audio analyzer has comprehensive unit tests that use synthetic audio inputs to validate pitch detection and tempo estimation algorithms.

**Why this priority**: Unit tests ensure the core algorithm works correctly before integrating with the rest of the application. Synthetic audio allows testing edge cases and specific scenarios that may be difficult to reproduce with real microphone input.

**Independent Test**: Can be fully tested by running the unit test suite and verifying all tests pass. Tests use synthetic audio (generated tones, test patterns) to validate algorithm behavior.

**Acceptance Scenarios**:

1. **Given** a unit test with synthetic pure tone (e.g., 440Hz sine wave), **When** the test runs, **Then** it verifies the analyzer detects A4 correctly
2. **Given** a unit test with synthetic note sequence, **When** the test runs, **Then** it verifies the analyzer detects all notes in correct order
3. **Given** a unit test with synthetic audio containing noise, **When** the test runs, **Then** it verifies the analyzer handles noise appropriately
4. **Given** a unit test with synthetic tempo variations, **When** the test runs, **Then** it verifies tempo estimation accuracy
5. **Given** edge case tests (silence, very quiet audio, multiple simultaneous frequencies), **When** the tests run, **Then** they verify appropriate handling of edge cases

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Analyzer MUST perform FFT-based frequency analysis on audio input
- **FR-002**: Analyzer MUST detect musical pitches (notes) from frequency data
- **FR-003**: Analyzer MUST provide confidence scores (0-1) for each detected note
- **FR-004**: Analyzer MUST estimate tempo (BPM) from audio input
- **FR-005**: Analyzer MUST track tempo variations (ritardando, accelerando)
- **FR-006**: Analyzer MUST handle single instrument audio (not ensemble)
- **FR-007**: Analyzer MUST process audio in real-time with low latency (<100ms per analysis cycle)
- **FR-008**: Analyzer MUST work with Web Audio API input (AudioBuffer or AudioNode)
- **FR-009**: Analyzer MUST return structured results (detected notes with pitch, timing, confidence)
- **FR-010**: Analyzer MUST handle edge cases (silence, noise, very quiet audio, multiple frequencies)
- **FR-011**: Analyzer MUST have comprehensive unit tests with synthetic audio inputs
- **FR-012**: Unit tests MUST validate pitch detection accuracy
- **FR-013**: Unit tests MUST validate tempo estimation accuracy
- **FR-014**: Unit tests MUST cover edge cases and error conditions

### Key Entities *(include if feature involves data)*

- **AudioAnalysisResult**: Represents the output of audio processing. Key attributes include detected notes, note timings, confidence scores, tempo estimation, and overall confidence. Relationships: used to determine current position (in future features).

- **DetectedNote**: Represents a single note detected from audio analysis. Key attributes include pitch (step, octave, alter), start time, duration, confidence, and amplitude. Relationships: part of AudioAnalysisResult.

- **TempoEstimate**: Represents tempo information. Key attributes include BPM value, confidence, and timestamp. Relationships: part of AudioAnalysisResult.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Analyzer detects single notes with 95% accuracy for pure tones (synthetic audio)
- **SC-002**: Analyzer estimates tempo within ±5 BPM for steady tempo audio (synthetic metronome)
- **SC-003**: Analyzer processes audio with latency <100ms per analysis cycle
- **SC-004**: Unit tests achieve 100% code coverage for core algorithm functions
- **SC-005**: Unit tests pass for all synthetic audio test cases
- **SC-006**: Analyzer handles edge cases (silence, noise, quiet audio) without errors
- **SC-007**: Confidence scores accurately reflect detection quality (high for clear notes, low for ambiguous/noisy input)

## Assumptions

- Audio input will be from a single instrument (not ensemble)
- Web Audio API will be available in the target environment
- Synthetic audio for testing can be generated programmatically
- FFT-based approach is sufficient for MVP (ML enhancement deferred per master plan)
- Audio processing will happen in Web Workers (implementation detail, not part of this feature)

## Dependencies

- Web Audio API support (for future integration, not required for unit tests)
- FFT implementation (can use Web Audio API AnalyserNode or custom implementation)
- Test framework (Vitest per master plan research)
- Ability to generate synthetic audio for testing

## Future Considerations

The following aspects are deferred to future features (see master plan `001-sheet-music-player`):

1. **Integration with Sheet Music**: Matching detected notes to sheet music positions (Feature 3)
2. **UI Integration**: Visual feedback and user interface (Feature 4)
3. **Real Microphone Input**: Integration with device microphone (Feature 4)
4. **ML Model Training**: Training models from FFT results (deferred per master plan)
5. **Web Worker Implementation**: Running analyzer in Web Worker (implementation detail for Feature 4)

## Notes

This feature focuses solely on the core audio analysis algorithm and its unit tests. It does not include:
- User interface
- Sheet music loading/rendering
- Position tracking integration
- Real microphone input (unit tests use synthetic audio)
- Web Worker implementation (can be added in integration phase)

Reference the master plan in `001-sheet-music-player` for:
- Complete architecture and research decisions
- Technology stack choices
- Performance requirements
- Overall system design
