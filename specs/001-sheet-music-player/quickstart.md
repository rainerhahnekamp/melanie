# Quick Start Guide: Sheet Music Player

**Date**: 2025-12-23  
**Purpose**: Developer quick start guide for implementing the sheet music player feature

## Overview

This guide provides a quick overview of the key concepts, architecture, and implementation approach for the sheet music player application.

## Key Concepts

### Architecture
- **Offline-first**: All core functionality works without network connectivity
- **Client-side processing**: Audio analysis and position tracking happen in the browser
- **Real-time tracking**: Position updates within 100ms of note detection
- **Single-user**: Application designed for individual artists

### Data Flow
1. User loads MusicXML file → Parsed client-side using `musicxml` library
2. User presses start → Audio capture begins via Web Audio API
3. Audio analyzed in Web Worker → FFT-based pitch detection
4. Notes matched to sheet music → Position calculated
5. Position highlighted → Visual feedback updated
6. Page turns automatically → Based on configured thresholds

### Core Technologies
- **Frontend**: Angular (latest stable), TypeScript, NgRx SignalStore
- **Backend**: Spring Boot (latest stable), Java (latest LTS), PostgreSQL
- **Storage**: Dexie (IndexedDB) for client-side, PostgreSQL for backend (optional)
- **Audio**: Web Audio API, Web Workers for processing
- **Music**: MusicXML format, `musicxml` library for parsing

## Project Structure

```
backend/
├── src/main/java/com/melanie/
│   ├── api/controllers/        # REST API endpoints
│   ├── models/entities/        # JPA entities (if database used)
│   ├── services/               # Business logic
│   └── config/                 # Spring configuration
└── tests/                      # Integration and unit tests

frontend/
├── src/app/
│   ├── components/             # Angular components
│   ├── pages/                   # Page components
│   ├── services/                # Angular services
│   ├── stores/                  # NgRx SignalStore
│   └── workers/                 # Web Workers (audio processing)
└── tests/                       # Vitest tests
```

## Implementation Phases

### Phase 1: Setup
- Initialize Angular and Spring Boot projects
- Configure Dexie for IndexedDB
- Set up Web Audio API infrastructure
- Configure Workbox for PWA support

### Phase 2: Core Functionality (P1)
- MusicXML file loading and parsing
- Sheet music rendering
- Audio capture and FFT analysis
- Position tracking and highlighting

### Phase 3: Essential Features (P2)
- Automatic page turning
- Offline support (Service Workers, IndexedDB)
- Mobile responsive design

### Phase 4: Enhancements (P3)
- Page turn configuration
- Annotations
- Performance recording and playback
- Post-analysis features

## Key Implementation Details

### Audio Processing
- Use Web Audio API `AnalyserNode` for FFT analysis
- Process audio in dedicated Web Worker to prevent UI blocking
- Extract frequency peaks to identify musical notes
- Match detected notes to expected notes in sheet music
- Track tempo adaptively to handle ritardando/accelerando

### Position Tracking
- Compare detected pitches with sheet music notes
- Calculate position based on matched notes and estimated tempo
- Maintain confidence scores for position accuracy
- Handle tempo variations and pauses

### Data Storage
- **Client-side**: Use Dexie to store sheet music files, annotations, settings in IndexedDB
- **Backend**: Optional PostgreSQL storage for file management
- All core data must be available offline

### Sheet Music Rendering
- Parse MusicXML using `musicxml` library
- Render notes, measures, pages visually
- Support standard notation elements (notes, rests, time/key signatures)
- Handle multi-page sheet music

## Testing Approach

### Frontend (Vitest)
- Unit tests for services and components
- Integration tests for component interactions
- Test audio processing with synthetic audio inputs

### Backend (JUnit 5, AssertJ)
- Unit tests for services and controllers
- Integration tests with Testcontainers (PostgreSQL)
- API contract tests

### E2E (Playwright)
- Critical user workflows
- Offline functionality
- Mobile device testing

## Performance Targets

- Audio processing latency: <100ms (constitution requirement)
- Sheet music rendering: 60 FPS (constitution requirement)
- API response times: <200ms (constitution requirement)
- Position tracking accuracy: within 1 beat/measure for 90% of playback time

## Development Workflow

1. **Setup**: Clone repository, install dependencies
2. **Development**: Run frontend and backend in development mode
3. **Testing**: Run unit, integration, and E2E tests
4. **Offline Testing**: Disable network to verify offline functionality
5. **Mobile Testing**: Test on mobile devices or emulators

## Common Patterns

### Loading Sheet Music
```typescript
// Load MusicXML file
const file = await loadMusicXMLFile(fileData);
const sheetMusic = await parseMusicXML(file);
await storeInDexie(sheetMusic);
```

### Audio Processing
```typescript
// Start audio capture
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
// Process in Web Worker
worker.postMessage({ audioData, sheetMusic });
```

### Position Tracking
```typescript
// Calculate position from detected notes
const position = calculatePosition(detectedNotes, sheetMusic);
updateCurrentPosition(position);
highlightPositionInSheetMusic(position);
```

## Next Steps

1. Review `spec.md` for detailed requirements
2. Review `plan.md` for technical architecture
3. Review `data-model.md` for entity structure
4. Review `research.md` for technical decisions
5. Review `contracts/openapi.yaml` for API specification
6. Proceed to `tasks.md` for implementation tasks

## Resources

- [Angular Documentation](https://angular.dev)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [MusicXML Specification](https://www.musicxml.com)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Dexie Documentation](https://dexie.org)

