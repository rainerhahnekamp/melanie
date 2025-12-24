# Implementation Plan: Sheet Music Player with Audio Position Tracking

**Branch**: `001-sheet-music-player` | **Date**: 2025-12-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-sheet-music-player/spec.md`
**Type**: Master Plan/Epic - This represents the complete vision. Implementation will be broken down into smaller features, starting with `002-audio-analyzer`.

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

A web-based application that displays sheet music and tracks the artist's position in real-time by analyzing audio input from the device microphone. The application automatically turns pages based on configurable thresholds (measure-based or time-based) and works offline on both mobile and desktop browsers. Core functionality includes real-time audio analysis, position tracking, automatic page turning, and offline support using Web Audio API for client-side processing and Angular/Spring architecture.

## Technical Context

**Language/Version**: 
- Frontend: TypeScript (NEEDS CLARIFICATION: version), Angular (NEEDS CLARIFICATION: version, likely 18.x or 19.x)
- Backend: Java (NEEDS CLARIFICATION: version, likely 17 or 21), Spring Boot (NEEDS CLARIFICATION: version, likely 3.2.x or 3.3.x)

**Primary Dependencies**: 
- Frontend: Angular framework, NgRx SignalStore (NEEDS CLARIFICATION: version), Web Audio API (browser-native), MusicXML parser library (NEEDS CLARIFICATION: which library - musicxml-interfaces, music21.js, or custom), Service Worker API (browser-native), IndexedDB API (browser-native), Angular Material or other UI library (NEEDS CLARIFICATION: if used)
- Backend: Spring Web, Spring Boot, Jackson for JSON, MusicXML processing library (NEEDS CLARIFICATION: server-side parser if needed), possibly Spring Data (NEEDS CLARIFICATION: if database storage needed)

**Storage**: 
- Frontend: IndexedDB for offline sheet music files, annotations, and cached data; Service Workers for offline functionality
- Backend: NEEDS CLARIFICATION - File-based storage for sheet music files, or database (PostgreSQL/H2) for metadata and user data? Constitution suggests API-first but doesn't specify persistence strategy.

**Testing**: 
- Frontend: NEEDS CLARIFICATION - Jasmine/Karma (Angular default), Jest, or Angular Testing Library
- Backend: JUnit 5, Spring Boot Test, MockMvc (standard Spring testing)
- E2E: NEEDS CLARIFICATION - Playwright, Cypress, or Protractor

**Target Platform**: 
- Web browsers with Web Audio API support (Chrome, Firefox, Safari, Edge - NEEDS CLARIFICATION: minimum versions)
- Progressive Web App (PWA) for mobile offline support
- Responsive design: 320px to 2560px width (mobile to desktop)

**Project Type**: Web application (frontend + backend) - confirmed by constitution (Angular frontend, Spring backend)

**Performance Goals**: 
- Audio processing latency: <100ms from audio input to position update (constitution requirement)
- Sheet music rendering: 60 FPS for smooth scrolling and highlighting (constitution requirement)
- API response times: <200ms for position calculation requests (constitution requirement)
- Position update frequency: real-time updates within 100ms of note detection (spec requirement SC-001)
- Audio sample rate: up to 96kHz without degradation (constitution requirement)

**Constraints**: 
- Offline-first: must function completely offline after initial setup (spec requirement FR-009)
- Mobile responsive: support screen widths from 320px to 2560px (spec requirement SC-004)
- Memory stability: no memory leaks over 30+ minute sessions (constitution requirement)
- Position tracking accuracy: within 1 beat/measure tolerance for 90% of playback time (spec requirement SC-005)
- Sheet music file size: handle up to 50 pages without performance degradation (spec requirement SC-007)
- Single instrument tracking only (spec requirement FR-020)

**Scale/Scope**: 
- Single-user application (no multi-user requirements in spec)
- Sheet music files: up to 50 pages per file (spec requirement SC-007)
- Audio analysis: real-time, single instrument (spec requirement FR-020)
- Format support: 95% of standard MusicXML files (spec requirement SC-008)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Real-time Audio Processing & Performance
- ✅ **Compliant**: Plan uses Web Audio API with Web Workers for non-blocking audio processing
- ✅ **Compliant**: Target latency <100ms from audio input to position update
- ⚠️ **NEEDS CLARIFICATION**: Specific Web Worker implementation pattern and audio analysis algorithm approach

### II. Sheet Music Standardization
- ✅ **Compliant**: Plan uses MusicXML as standardized format (spec requirement FR-011)
- ⚠️ **NEEDS CLARIFICATION**: Specific MusicXML parser library choice and internal representation schema
- ⚠️ **NEEDS CLARIFICATION**: Import/export capabilities and versioning strategy

### III. Position Tracking & Synchronization
- ✅ **Compliant**: Plan includes real-time position tracking based on audio analysis
- ✅ **Compliant**: Target accuracy within 1 beat/measure tolerance (spec requirement SC-005)
- ⚠️ **NEEDS CLARIFICATION**: Specific algorithm approach for note matching, tempo tracking, and handling tempo variations

### IV. Separation of Concerns (Angular & Spring)
- ✅ **Compliant**: Frontend (Angular) handles UI, audio capture, visual rendering
- ✅ **Compliant**: Backend (Spring) handles sheet music processing, position calculation, data persistence
- ⚠️ **NEEDS CLARIFICATION**: Exact API boundary - which processing happens client-side vs server-side (audio analysis location)

### V. API-First Design
- ✅ **Compliant**: Plan includes REST API with Spring backend
- ⚠️ **NEEDS CLARIFICATION**: OpenAPI/Swagger documentation approach and API versioning strategy

### VI. Testing & Validation
- ✅ **Compliant**: Plan includes integration tests, unit tests, and E2E tests
- ⚠️ **NEEDS CLARIFICATION**: Specific testing framework choices (Jasmine/Jest for Angular, testing library selection)

**Gate Status**: ✅ **PASS** - All principles addressed, clarifications needed for implementation details (to be resolved in Phase 0 research)

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
backend/
├── src/
│   ├── main/java/com/melanie/
│   │   ├── api/
│   │   │   └── controllers/
│   │   ├── models/
│   │   │   └── entities/
│   │   ├── services/
│   │   │   ├── sheetmusic/
│   │   │   ├── position/
│   │   │   └── storage/
│   │   └── config/
│   └── test/java/com/melanie/
│       ├── integration/
│       └── unit/
└── pom.xml

src/
├── frontend/
│   ├── app/
│   │   ├── audio-analyzer/          # Audio analyzer library (feature 002)
│   │   │   ├── fft/
│   │   │   ├── pitch-detection/
│   │   │   ├── tempo/
│   │   │   ├── analyzer.ts
│   │   │   └── types.ts
│   │   ├── components/
│   │   │   ├── sheet-music-viewer/
│   │   │   ├── audio-controls/
│   │   │   └── settings/
│   │   ├── pages/
│   │   │   ├── player/
│   │   │   └── library/
│   │   ├── services/
│   │   │   ├── audio/
│   │   │   ├── position-tracking/
│   │   │   ├── sheet-music/
│   │   │   └── storage/
│   │   ├── stores/ (NgRx SignalStore)
│   │   └── workers/
│   │       └── audio-processor.worker.ts
│   ├── assets/
│   └── index.html
├── tests/
│   ├── integration/
│   └── unit/
│       └── audio-analyzer/      # Analyzer unit tests
├── angular.json
├── package.json
└── tsconfig.json
```

**Structure Decision**: Web application structure (Option 2) selected based on constitution requirement for Angular frontend and Spring backend separation. Frontend handles all UI, audio capture, and visual rendering. Backend handles sheet music processing, position calculation algorithms, and data persistence. Audio analysis will be performed client-side using Web Audio API in Web Workers to meet real-time performance requirements.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
