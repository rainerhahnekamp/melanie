<!--
SYNC IMPACT REPORT
==================
Version change: 1.1.1 → 1.1.2 (PATCH: simplify testing strategy to follow common best practices)
Modified principles:
  - VI. Testing & Validation: Simplified to standard testing strategy with integration tests prioritized, unit tests for logic, and a few unit tests for audio algorithms
Added sections: N/A
Removed sections: N/A
Modified sections: N/A
Templates requiring updates:
  ✅ plan-template.md (Constitution Check section will reference these principles)
  ✅ spec-template.md (aligned with constitution principles)
  ✅ tasks-template.md (task organization aligns with constitution)
Follow-up TODOs: None
-->

# Melanie Constitution

## Core Principles

### I. Real-time Audio Processing & Performance

Audio analysis MUST operate in real-time with minimal latency. Web Audio API
processing MUST maintain sub-100ms latency for note detection. Audio analysis
algorithms MUST be optimized for browser performance constraints. All audio
processing MUST use Web Workers or similar non-blocking mechanisms to prevent
UI freezes. Performance degradation MUST be detectable and logged for analysis.

**Rationale**: Real-time music listening requires immediate feedback. High
latency breaks the user experience of following along with live music.

### II. Sheet Music Standardization

Sheet music representation MUST use a standardized, parseable format (e.g.,
MusicXML, MEI, or custom JSON schema). The chosen format MUST support both
import and export capabilities. Sheet music data MUST be versioned and
validated against a schema. Multiple format support SHOULD be implemented
through a unified internal representation.

**Rationale**: Consistent sheet music format enables reliable position tracking
and prevents format-related bugs. Standard formats ensure interoperability with
existing music notation software.

### III. Position Tracking & Synchronization

The system MUST accurately identify the current position in the sheet music
based on analyzed audio notes. Position tracking MUST account for tempo
variations, pauses, and repeat sections. Synchronization between audio playback
and sheet music position MUST be maintained within acceptable tolerance (target:
within 1 beat/measure). Position tracking algorithms MUST handle polyphonic
music and overlapping notes correctly.

**Rationale**: Accurate position identification is the core feature of the
application. Poor synchronization makes the application unusable for its
primary purpose.

### IV. Separation of Concerns (Angular & Spring)

Frontend (Angular) MUST handle all UI interactions, audio capture, and visual
rendering. Backend (Spring) MUST handle sheet music processing, position
calculation algorithms, and data persistence. Audio analysis MAY be performed
client-side (Web Audio API) or server-side based on performance requirements.
Business logic for position tracking MUST be clearly separated from presentation
logic. API boundaries MUST be well-defined with REST contracts.

**Rationale**: Clear separation enables independent development, testing, and
scaling of frontend and backend components. It also facilitates future platform
support (e.g., mobile apps using the same backend).

### V. API-First Design

All backend functionality MUST be exposed through well-defined REST API
endpoints. API contracts MUST be documented using OpenAPI/Swagger. Frontend
MUST NOT directly access backend services beyond the defined API. API versioning
MUST be supported for backward compatibility. All API responses MUST include
appropriate error codes and messages.

**Rationale**: API-first design ensures frontend and backend can evolve
independently. Clear contracts prevent integration issues and enable
testing of components in isolation.

### VI. Testing & Validation

Testing MUST follow common best practices: prioritize integration tests for
component interactions and service collaborations; use unit tests for pure logic
and business rules. Audio analysis algorithms MUST have a few unit tests with
synthetic audio inputs. End-to-end tests MUST verify critical user workflows.

**Rationale**: Integration tests verify how components work together. Unit tests
validate isolated logic. A few unit tests for audio algorithms ensure core
functionality correctness.

## Performance Standards

Real-time audio processing MUST maintain sub-100ms latency from audio input to
position update. Sheet music rendering MUST achieve 60 FPS for smooth scrolling
and highlighting. API response times MUST be under 200ms for position
calculation requests. The application MUST handle audio streams up to 96kHz
sample rate without degradation. Memory usage MUST remain stable during
extended playback sessions (target: no memory leaks over 30+ minute sessions).

## Development Workflow

Angular development MUST follow the instructions and best practices provided by
the Angular MCP (Model Context Protocol). All Angular-specific guidelines,
syntax requirements, and architectural patterns MUST be derived from the Angular
MCP documentation. Angular state management MUST use NgRx SignalStore. Spring
services MUST follow dependency injection patterns and be testable in
integration. All API endpoints MUST include comprehensive error handling and
logging. Code reviews MUST verify constitution compliance before merge.

## Governance

This constitution supersedes all other development practices and conventions.
Amendments to principles require:
1. Documentation of the change rationale
2. Impact analysis on existing code and templates
3. Update of dependent templates and documentation
4. Version increment following semantic versioning

**Versioning Policy**: 
- MAJOR: Backward incompatible principle changes or removals
- MINOR: New principles or materially expanded guidance
- PATCH: Clarifications, wording improvements, non-semantic refinements

**Compliance Review**: All feature specifications, implementation plans, and
task lists MUST be checked against constitution principles. The `/speckit.analyze`
command enforces constitution compliance. Violations MUST be resolved before
implementation begins.

**Version**: 1.1.2 | **Ratified**: 2025-12-21 | **Last Amended**: 2025-12-21
