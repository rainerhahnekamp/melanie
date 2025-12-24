# Research: Sheet Music Player Technical Decisions

**Date**: 2025-12-23  
**Purpose**: Resolve all NEEDS CLARIFICATION items from plan.md Technical Context section

## Language/Version Decisions

### Frontend: TypeScript & Angular

**Decision**: TypeScript (latest stable), Angular (latest stable)

**Rationale**:
- Latest stable Angular provides improved performance and developer experience
- Latest stable TypeScript provides excellent type safety and modern language features
- Latest stable Angular has full support for NgRx SignalStore and modern Angular patterns
- Strong ecosystem support and long-term maintenance

**Alternatives considered**:
- Older versions: Missing latest performance improvements and features

### Backend: Java & Spring Boot

**Decision**: Java (latest LTS), Spring Boot (latest stable)

**Rationale**:
- Latest LTS Java provides long-term support and modern features
- Latest stable Spring Boot has excellent Java support
- Latest LTS Java includes virtual threads (Project Loom) for better concurrency
- Long-term support ensures stability and security updates

**Alternatives considered**:
- Older LTS versions: Missing modern features and optimizations
- Non-LTS versions: Lack long-term support guarantees

## Primary Dependencies

### Frontend Dependencies

**Decision**: 
- Angular (latest stable, framework)
- @ngrx/signal-store (latest stable, state management)
- Web Audio API (browser-native, no library needed)
- musicxml (latest stable, MusicXML parsing library by stringsync)
- Workbox (latest stable, Service Worker and PWA support)
- Dexie (latest stable, IndexedDB wrapper library)
- Angular Material (latest stable, UI component library)

**Rationale**:
- NgRx SignalStore (latest stable) is the recommended state management solution per constitution
- musicxml library provides full MusicXML parsing and editing capabilities with TypeScript support, validation, and handles invalid exports from various software
- Angular Material provides consistent, accessible UI components with mobile support
- Workbox provides flexible Service Worker and PWA support with better caching strategies for large files like sheet music, making it more suitable than @angular/service-worker for offline-first applications with substantial file storage needs
- Dexie provides a simpler, promise-based API for IndexedDB with better TypeScript support and easier querying

**Alternatives considered**:
- music21.js: Python-based, heavier, may have compatibility issues
- musicxml-interfaces + custom parser: More work, custom parser provides complete control but musicxml library already handles parsing well
- Other UI libraries (PrimeNG, ng-bootstrap): Angular Material has best Angular integration
- Native IndexedDB: More verbose and harder to work with than Dexie
- @angular/service-worker: Workbox provides better flexibility and caching strategies for large files, making it more suitable for offline-first applications with substantial file storage needs

### Backend Dependencies

**Decision**:
- Spring Web (Spring MVC, REST API)
- Spring Boot Starter Web
- Spring Data JPA (if database storage needed)
- PostgreSQL (all environments: development, testing, production)
- Testcontainers (for integration testing with PostgreSQL)
- Flyway (database migration tooling)

**Rationale**:
- Spring Web (MVC) provides REST API foundation with mature ecosystem and extensive documentation
- Spring Data JPA provides abstraction if database storage is needed
- PostgreSQL for all environments ensures consistency between development, testing, and production
- Testcontainers makes it easy to spin up PostgreSQL containers for testing, eliminating need for separate H2 database
- Flyway provides simple SQL-based database migrations with version control, well-integrated with Spring Boot
- Mature framework with large community and extensive resources
- Java 21 virtual threads provide good concurrency without needing reactive framework
- Personal preference and team familiarity with Spring ecosystem
- No server-side MusicXML parsing needed as all processing happens client-side for offline support

**Framework Choice: Spring MVC vs Quarkus vs Micronaut**

Spring MVC was chosen over Quarkus and Micronaut. Spring MVC offers a mature ecosystem with extensive documentation, large community support, and well-established patterns. While Quarkus provides faster startup and lower memory footprint (good for cloud-native/serverless), and Micronaut offers compile-time DI with similar patterns to Spring, the performance benefits are negligible for this single-user, offline-first application with a lightweight backend. Spring MVC's maturity, documentation, and personal preference make it the better choice for this project. Full reactive (Spring WebFlux) is not needed as the backend handles optional features and most processing happens client-side.

**Alternatives considered**:
- Quarkus: Faster startup and lower memory, but less mature ecosystem and cloud-native focus not needed for this project
- Micronaut: Compile-time DI with similar patterns to Spring, but less mature ecosystem
- Spring WebFlux: Reactive framework, but unnecessary complexity for single-user application with client-side processing
- H2 Database: Simpler for development but Testcontainers makes PostgreSQL easy, and consistency across environments is valuable
- Liquibase: More flexible migration tool but Flyway's SQL-based approach is simpler and sufficient for this project
- File-based storage only: Simpler but limits future features
- MongoDB: Overkill for single-user application
- No server-side MusicXML processing: Keep all processing client-side for offline support

## Storage Strategy

**Decision**: 
- **Frontend**: Dexie (IndexedDB wrapper) for all offline data (sheet music files, annotations, settings, cached data)
- **Backend**: File-based storage for sheet music files (optional upload/management), minimal metadata storage

**Rationale**:
- Offline-first requirement (FR-009) means most data must be client-side
- IndexedDB provides persistent storage that works offline
- Dexie provides simpler, promise-based API compared to native IndexedDB's callback-based API
- Better TypeScript support and type safety with Dexie
- Easier querying, indexing, and error handling
- Smaller learning curve and better developer experience
- Backend primarily serves as API for optional features (file upload, sharing, etc.)
- File-based backend storage is simpler for MVP, can add database later if needed
- Aligns with single-user application scope

**Alternatives considered**:
- Native IndexedDB: More verbose, callback-based, harder to work with
- Full database backend: Overkill for single-user, adds complexity
- LocalStorage: Too small (5-10MB limit) for sheet music files
- Service Worker cache only: Less reliable than IndexedDB for large files

## Testing Framework Decisions

**Decision**:
- **Frontend**: Vitest (Angular 21 default)
- **Backend**: JUnit 5, Spring Boot Test, MockMvc, AssertJ
- **E2E**: Playwright (modern, fast, cross-browser)

**Rationale**:
- Vitest is Angular 21's default testing framework, providing fast execution and modern tooling
- Vitest runs with full browser mode, eliminating need for separate testing library
- JUnit 5 and Spring Boot Test are standard for Spring applications
- AssertJ provides fluent assertions for more readable and maintainable test code
- Playwright is modern, fast, and has excellent cross-browser support
- Playwright supports mobile device emulation for responsive testing

**Alternatives considered**:
- Jasmine/Karma: Previous Angular default, but Vitest is now the standard in Angular 21
- Angular Testing Library: Not needed as Vitest runs with full browser mode
- Jest: Popular but Vitest is Angular 21's default and provides better integration
- Cypress: Good but Playwright is faster and more modern
- Protractor: Deprecated, not recommended

## Target Platform - Browser Support

**Decision**: 
- **Minimum versions**: Latest stable versions of Chrome, Firefox, Safari, Edge that support required APIs
- **Progressive Web App (PWA)** with Service Worker support
- **Responsive design**: 320px to 2560px width

**Rationale**:
- These versions support Web Audio API, Service Workers, and IndexedDB reliably
- Covers 95%+ of current browser usage
- PWA enables offline functionality and mobile app-like experience
- Responsive design requirement from spec (SC-004)

**Alternatives considered**:
- Older browser support: Would require polyfills and limit modern API usage
- Native mobile apps: Web app is more maintainable and works across platforms

## Audio Analysis Algorithm Approach

**Decision**: 
- **Client-side processing** using Web Audio API in Web Workers
- **Algorithm**: Real-time pitch detection (FFT-based) + note matching against sheet music
- **Tempo tracking**: Adaptive tempo estimation with tempo variation handling
- **ML enhancement**: Deferred as separate feature (FFT-based model training from recordings)

**Rationale**:
- Client-side processing meets <100ms latency requirement (constitution)
- Web Workers prevent UI blocking during audio analysis
- FFT-based pitch detection is standard for real-time audio analysis, providing 5-20ms latency
- Adaptive tempo tracking handles ritardando/accelerando (spec requirement FR-012)
- Single instrument tracking simplifies algorithm (spec requirement FR-020)
- FFT is sufficient for MVP; ML model training from FFT results and recordings can be added later as enhancement

**Future Enhancement - ML Model Training**:
ML model training from FFT results and recordings is deferred as a separate feature. This would involve recording performances (audio + FFT results + position data), using FFT as features or labels for training, and deploying trained models as background/fallback to improve accuracy. This enables self-improving system that learns from real usage patterns without manual labeling.

**Alternatives considered**:
- Server-side processing: Network latency would exceed <100ms requirement
- Pre-recorded audio analysis: Doesn't meet real-time requirement
- MIDI input: Requires additional hardware, not microphone-based
- ML as primary: FFT is simpler and sufficient for MVP; ML can be added later as enhancement

## MusicXML Parser Library

**Decision**: 
- **Frontend**: musicxml (TypeScript library by stringsync) for parsing and editing MusicXML
- **Backend**: No MusicXML parsing needed (server only handles file storage/retrieval)

**Rationale**:
- musicxml library provides full parsing and editing capabilities with TypeScript support
- Validates MusicXML against specification and handles invalid exports from various software
- Reduces development time compared to custom parser
- Can add custom logic on top for position tracking optimization
- All MusicXML processing happens client-side for offline support
- Backend only needs to store and retrieve files, not parse them

**Format Choice: MusicXML vs LilyPond**

MusicXML was chosen over LilyPond as the primary format. MusicXML is the industry standard for notation interchange with broad software support (Finale, Sibelius, MuseScore) and provides structured XML data with timing, pitch, measures, and notation elements needed for position tracking. It has better library support (musicxml-interfaces, musicxml4j) and wider availability on sources like IMSLP. LilyPond is text-based and primarily for LilyPond software, with less standardized interchange, fewer parsing libraries, and would require custom parsing. While LilyPond could work, MusicXML better serves the project's needs for structured data access and tooling support. PDF parsing is deferred as a separate feature.

**Alternatives considered**:
- music21.js: Python-based, heavier, may have compatibility issues
- musicxml-interfaces + custom parser: More work, custom parser provides complete control but musicxml library already handles parsing well
- Full custom parser: More work but provides complete control, musicxml library reduces this need
- musicxml4j (server-side): Not needed as all parsing happens client-side for offline support
- Server-side only: Would break offline functionality
- LilyPond format: Less standardized, fewer tools, requires custom parsing

## API Boundary - Client vs Server Processing

**Decision**: 
- **Client-side**: Audio capture, audio analysis, position tracking, sheet music rendering, offline storage
- **Server-side**: Sheet music file upload/management (optional), metadata storage (optional), API for future features

**Rationale**:
- Offline-first requirement (FR-009) means core functionality must work client-side
- Real-time audio processing latency requirement (<100ms) requires client-side processing
- Constitution requires Angular to handle audio capture and visual rendering
- Backend serves as optional enhancement for file management and future features

**Alternatives considered**:
- Server-side audio analysis: Network latency would exceed <100ms requirement
- Hybrid approach: Adds complexity, client-side is sufficient for requirements

## OpenAPI/Swagger Documentation

**Decision**: 
- SpringDoc OpenAPI 3 (Swagger UI integration)
- API versioning via URL path: `/api/v1/...`

**Rationale**:
- SpringDoc OpenAPI 3 is the standard for Spring Boot applications
- Provides automatic API documentation generation
- Swagger UI enables interactive API testing
- URL path versioning is simple and clear for REST APIs

**Alternatives considered**:
- Header-based versioning: Less discoverable
- No versioning: Limits future API evolution

## Web Worker Implementation Pattern

**Decision**: 
- Dedicated Web Worker for audio processing (`audio-processor.worker.ts`)
- Message passing between main thread and worker for audio data and results
- Shared memory (SharedArrayBuffer) if supported, fallback to message passing

**Rationale**:
- Web Workers prevent UI blocking during intensive audio analysis
- Dedicated worker isolates audio processing from UI thread
- Message passing is reliable across all browsers
- SharedArrayBuffer can improve performance but requires HTTPS and proper headers

**Alternatives considered**:
- Inline audio processing: Would block UI thread, violates performance requirements
- Multiple workers: Adds complexity, single worker is sufficient

## Position Tracking Algorithm Details

**Decision**: 
- **Note matching**: Compare detected pitches from audio with expected notes in sheet music
- **Tempo estimation**: Adaptive algorithm that tracks tempo changes (ritardando/accelerando)
- **Position calculation**: Measure position based on matched notes and estimated tempo
- **Confidence scoring**: Track confidence in position matches to handle ambiguous cases

**Rationale**:
- Note matching is standard approach for audio-to-sheet-music synchronization
- Adaptive tempo handles tempo variations (spec requirement FR-012)
- Confidence scoring enables handling of wrong notes or improvisation (spec edge cases)
- Within 1 beat/measure tolerance is achievable with this approach (spec requirement SC-005)

**Alternatives considered**:
- Time-based only: Doesn't account for tempo variations
- MIDI-based: Requires additional hardware
- Machine learning approach: Overkill for MVP, can be added later

## Summary of Resolved Clarifications

All NEEDS CLARIFICATION items from plan.md have been resolved:

1. ✅ **TypeScript/Angular versions**: TypeScript (latest stable), Angular (latest stable)
2. ✅ **Java/Spring Boot versions**: Java (latest LTS), Spring Boot (latest stable)
3. ✅ **NgRx SignalStore version**: Latest stable
4. ✅ **MusicXML parser**: musicxml-interfaces + custom parser (frontend), musicxml4j (backend if needed)
5. ✅ **UI library**: Angular Material (latest stable)
6. ✅ **Backend storage**: File-based for MVP, can add database later
7. ✅ **Testing frameworks**: Jasmine/Karma + Angular Testing Library (frontend), JUnit 5 + Spring Boot Test (backend), Playwright (E2E)
8. ✅ **Browser support**: Latest stable versions of major browsers with Web Audio API, Service Workers, and IndexedDB support
9. ✅ **Audio analysis location**: Client-side using Web Audio API in Web Workers
10. ✅ **Audio analysis algorithm**: FFT-based pitch detection + note matching + adaptive tempo tracking
11. ✅ **API documentation**: SpringDoc OpenAPI 3 with Swagger UI
12. ✅ **API versioning**: URL path-based (`/api/v1/...`)
13. ✅ **Web Worker pattern**: Dedicated worker with message passing
14. ✅ **Position tracking algorithm**: Note matching with adaptive tempo and confidence scoring

All technical decisions align with constitution principles and feature specification requirements.

## Deferred Features

The following features and enhancements have been identified but deferred for future implementation:

### Technical Enhancements

1. **PDF Parsing**: Support for PDF sheet music files in addition to MusicXML. Deferred as separate feature to keep MVP focused on MusicXML format.

2. **ML Model Training from FFT Results**: Self-improving system that trains ML models from recorded performances (audio + FFT results + position data). Enables background/fallback model to improve accuracy over time. Deferred as separate feature as FFT is sufficient for MVP.

### User-Facing Features (from spec.md Future Considerations)

3. **Error Recovery and Manual Recalibration**: Ability to manually correct position when tracking is lost or drifts, with recalibration options and confidence indicators.

4. **Visual Customization for Performance Conditions**: Zoom levels, brightness/contrast adjustments, and night mode for different viewing environments (stage lighting, practice rooms).

5. **Initial Calibration/Setup Process**: Onboarding flow to calibrate for specific instruments, test audio input, and configure tuning references.

6. **Audio Quality and Sensitivity Settings**: Adjustable sensitivity for quiet/loud instruments, background noise filtering, and frequency range selection for different instrument types.

7. **Sheet Music Library Management**: Organization features such as folders, favorites, search functionality, and recent files list.

8. **Battery Optimization**: Power-saving modes and options to reduce processing intensity for extended practice sessions on mobile devices.

9. **Manual Navigation Enhancements**: Bookmark/jump-to-section features and quick navigation to specific measures.

**Note**: These features are preserved in this research document and in `spec.md` Future Considerations section. When this feature branch is merged to main, all artifacts in `specs/001-sheet-music-player/` will be preserved, ensuring no deferred features are lost.

