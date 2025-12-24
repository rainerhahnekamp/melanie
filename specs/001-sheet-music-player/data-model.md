# Data Model: Sheet Music Player

**Date**: 2025-12-23  
**Source**: Feature specification entities and requirements

## Overview

The data model supports a single-user, offline-first sheet music player application with real-time audio position tracking. All entities are primarily stored client-side using Dexie (IndexedDB wrapper) for offline functionality, with optional backend PostgreSQL storage for file management and future features. MusicXML files are parsed client-side using the musicxml library, and all processing happens client-side to meet offline requirements.

## Entities

### Sheet Music

**Purpose**: Represents a musical composition with notation data loaded from MusicXML files. Can represent either a standalone piece or a movement within a larger work (e.g., a symphony movement). Supports standard cataloging systems including ISWC (ISO 15707), opus numbers, and thematic catalogs (BWV, Köchel, etc.).

**Attributes**:
- `id` (string, UUID): Unique identifier for the sheet music file
- `title` (string, required): Title of the musical composition (movement title if part of a larger work)
- `composer` (string, optional): Composer name
- `workTitle` (string, optional): Title of the larger work (e.g., "Symphony No. 5")
- `catalogNumber` (string, optional): Catalog number (Opus, BWV, Köchel/KV, Hob., etc., e.g., "Op. 67", "BWV 565", "K. 550")
- `iswc` (string, optional): International Standard Musical Work Code (ISO 15707, format: T-XXX.XXX.XXX-C)
- `movementNumber` (number, optional): Movement number within the work (e.g., 1, 2, 3 for symphony movements)
- `movementTitle` (string, optional): Title of the movement (e.g., "Allegro con brio")
- `fileFormat` (string, enum: "MusicXML"): Format of the source file (MusicXML is primary format, PDF parsing deferred as separate feature)
- `fileData` (Blob/ArrayBuffer): Raw file data (MusicXML content, parsed using musicxml library)
- `pages` (array of Page): Array of page objects containing measures
- `metadata` (object, optional): Additional metadata (key signature, time signature defaults, etc.)
- `createdAt` (timestamp): When the file was first loaded
- `updatedAt` (timestamp): Last modification time
- `fileSize` (number): Size of the file in bytes

**Relationships**:
- Contains multiple `Page` entities
- Has many `Annotation` entities (one-to-many)
- Has one `PageTurnConfiguration` (optional, piece-specific)
- Referenced by `PerformanceRecording` entities (one-to-many)

**Validation Rules**:
- `title` must not be empty
- `fileFormat` must be "MusicXML" (per spec requirement FR-011)
- `fileData` must be valid MusicXML that can be parsed
- `pages` array must not be empty
- File size must be reasonable (target: support up to 50 pages per spec requirement SC-007)
- `iswc` must match ISWC format (T-XXX.XXX.XXX-C) if provided
- `movementNumber` must be >= 1 if provided
- If `movementNumber` is provided, `workTitle` should also be provided (movement belongs to a work)

**State Transitions**:
- `loading` → `loaded` → `parsed` → `ready`
- `ready` → `error` (if parsing fails)

---

### Page

**Purpose**: Represents a single page within sheet music, containing measures and visual layout information.

**Attributes**:
- `pageNumber` (number, 1-indexed): Page number within the sheet music
- `measures` (array of Measure): Array of measures on this page
- `layout` (object): Visual layout information (dimensions, margins, etc.)
- `pageEndMeasure` (number): Last measure number on this page (for page turn calculation)

**Relationships**:
- Belongs to one `SheetMusic` entity (many-to-one)
- Contains multiple `Measure` entities

**Validation Rules**:
- `pageNumber` must be >= 1
- `measures` array must not be empty
- `pageEndMeasure` must be >= first measure number on page

---

### Measure

**Purpose**: Represents a musical measure containing notes, rests, and timing information.

**Attributes**:
- `measureNumber` (number): Measure number within the piece
- `timeSignature` (object): Time signature (numerator, denominator)
- `keySignature` (object, optional): Key signature
- `notes` (array of Note): Array of notes in this measure
- `beats` (number): Number of beats in this measure (derived from time signature)
- `tempo` (number, optional): Tempo marking in BPM for this measure

**Relationships**:
- Belongs to one `Page` entity (many-to-one)
- Contains multiple `Note` entities

**Validation Rules**:
- `measureNumber` must be >= 1
- `timeSignature` must be valid (numerator > 0, denominator is power of 2)
- `notes` array must not be empty (unless measure contains only rests)
- `beats` must match time signature

---

### Note

**Purpose**: Represents a single musical note with pitch, duration, and timing information.

**Attributes**:
- `pitch` (object): Pitch information (step: A-G, octave: number, alter: -1/0/1 for flat/natural/sharp)
- `duration` (number): Duration in beats (e.g., 0.25 for quarter note, 0.5 for half note)
- `startBeat` (number): Starting beat position within the measure (0-indexed)
- `voice` (number, optional): Voice number for polyphonic music
- `tie` (object, optional): Tie information if note is tied to another
- `articulation` (string, optional): Articulation marking (staccato, legato, etc.)

**Relationships**:
- Belongs to one `Measure` entity (many-to-one)

**Validation Rules**:
- `pitch` must be valid (step A-G, octave 0-10, alter -1/0/1)
- `duration` must be > 0
- `startBeat` must be >= 0 and < measure beats
- `startBeat + duration` must not exceed measure beats

---

### Current Position

**Purpose**: Represents the artist's current location within the sheet music at a given moment, updated in real-time.

**Attributes**:
- `sheetMusicId` (string): Reference to the SheetMusic entity
- `pageNumber` (number): Current page number
- `measureNumber` (number): Current measure number
- `beatPosition` (number): Current beat position within the measure (0-indexed, can be fractional)
- `timestamp` (timestamp): When this position was calculated
- `confidence` (number, 0-1): Confidence score for position accuracy
- `tempo` (number, optional): Current estimated tempo in BPM

**Relationships**:
- References one `SheetMusic` entity (many-to-one)

**Validation Rules**:
- `sheetMusicId` must reference a valid SheetMusic entity
- `pageNumber` must be valid for the sheet music
- `measureNumber` must be valid for the page
- `beatPosition` must be >= 0 and < measure beats
- `confidence` must be between 0 and 1

**State Transitions**:
- Updated continuously during playback
- Reset when new sheet music is loaded
- Paused when audio tracking is paused

---

### Page Turn Configuration

**Purpose**: Represents user settings for automatic page turning behavior.

**Attributes**:
- `id` (string, UUID): Unique identifier
- `sheetMusicId` (string, optional): If null, this is a global configuration; otherwise, piece-specific
- `turnMethod` (string, enum: "measure-based" | "time-based"): Method for determining when to turn page
- `thresholdValue` (number): Threshold value (number of measures or seconds)
- `isGlobal` (boolean): Whether this applies globally or to specific piece
- `createdAt` (timestamp): When configuration was created
- `updatedAt` (timestamp): Last modification time

**Relationships**:
- Optionally references one `SheetMusic` entity (many-to-one, null for global config)

**Validation Rules**:
- `turnMethod` must be "measure-based" or "time-based" (per spec requirement FR-008)
- `thresholdValue` must be > 0
- If `turnMethod` is "measure-based", `thresholdValue` must be an integer
- If `turnMethod` is "time-based", `thresholdValue` is in seconds
- Either `sheetMusicId` is set (piece-specific) or `isGlobal` is true (global)

**State Transitions**:
- Created with default values
- Updated when user changes settings (per spec requirement FR-014)

---

### Audio Analysis Result

**Purpose**: Represents the output of real-time audio processing, used to determine current position.

**Attributes**:
- `timestamp` (timestamp): When this analysis was performed
- `detectedNotes` (array of DetectedNote): Array of detected notes with timing
- `tempoEstimation` (number): Estimated tempo in BPM
- `confidence` (number, 0-1): Overall confidence in the analysis
- `audioLevel` (number, 0-1): Audio input level (for feedback)

**Relationships**:
- Used to calculate `CurrentPosition` (one-to-one, transient)

**Validation Rules**:
- `detectedNotes` array may be empty (silence or no notes detected)
- `tempoEstimation` must be > 0 and reasonable (e.g., 20-300 BPM)
- `confidence` must be between 0 and 1
- `audioLevel` must be between 0 and 1

**State Transitions**:
- Generated continuously during audio tracking
- Discarded after position calculation (transient data)

---

### DetectedNote

**Purpose**: Represents a single note detected from audio analysis.

**Attributes**:
- `pitch` (object): Detected pitch (step, octave, alter)
- `startTime` (number): Start time in seconds relative to audio stream start
- `duration` (number): Duration in seconds
- `confidence` (number, 0-1): Confidence in pitch detection
- `amplitude` (number, 0-1): Note amplitude/volume

**Relationships**:
- Part of `AudioAnalysisResult` (many-to-one)

**Validation Rules**:
- `pitch` must be valid
- `startTime` must be >= 0
- `duration` must be > 0
- `confidence` must be between 0 and 1

---

### Annotation

**Purpose**: Represents user-added markings, notes, or symbols on sheet music.

**Attributes**:
- `id` (string, UUID): Unique identifier
- `sheetMusicId` (string): Reference to the SheetMusic entity
- `type` (string, enum: "text" | "symbol" | "marking"): Type of annotation
- `position` (object): Position coordinates on sheet music (pageNumber, x, y, measureNumber, beatPosition)
- `content` (string): Annotation content (text, symbol name, or marking description)
- `color` (string, optional): Color for the annotation
- `createdAt` (timestamp): When annotation was created
- `updatedAt` (timestamp): Last modification time

**Relationships**:
- Belongs to one `SheetMusic` entity (many-to-one)

**Validation Rules**:
- `sheetMusicId` must reference a valid SheetMusic entity
- `type` must be "text", "symbol", or "marking"
- `position` must be valid coordinates within the sheet music
- `content` must not be empty
- `position.pageNumber` must be valid for the sheet music
- `position.measureNumber` must be valid for the page

**State Transitions**:
- `created` → `updated` → `deleted`
- Persists across sessions (per spec requirement FR-022)

---

### Performance Recording

**Purpose**: Represents a recorded performance session with synchronized audio and position data.

**Attributes**:
- `id` (string, UUID): Unique identifier
- `sheetMusicId` (string): Reference to the SheetMusic entity that was played
- `audioRecording` (Blob/ArrayBuffer): Recorded audio data
- `positionSnapshots` (array of PositionSnapshot): Array of position data over time
- `duration` (number): Duration of recording in seconds
- `startedAt` (timestamp): When recording started
- `completedAt` (timestamp): When recording completed
- `metadata` (object, optional): Additional metadata (tempo analysis, accuracy metrics, etc.)

**Relationships**:
- References one `SheetMusic` entity (many-to-one)
- Contains multiple `PositionSnapshot` entities

**Validation Rules**:
- `sheetMusicId` must reference a valid SheetMusic entity
- `audioRecording` must not be empty
- `positionSnapshots` array must not be empty
- `duration` must be > 0
- `completedAt` must be >= `startedAt`

**State Transitions**:
- `recording` → `processing` → `ready` → `deleted`
- Can be played back with synchronized position highlighting (per spec requirement FR-024)

---

### PositionSnapshot

**Purpose**: Represents a position at a specific time during a performance recording.

**Attributes**:
- `timestamp` (number): Time offset in seconds from recording start
- `pageNumber` (number): Page number at this timestamp
- `measureNumber` (number): Measure number at this timestamp
- `beatPosition` (number): Beat position within measure at this timestamp
- `tempo` (number, optional): Tempo at this timestamp

**Relationships**:
- Belongs to one `PerformanceRecording` entity (many-to-one)

**Validation Rules**:
- `timestamp` must be >= 0 and <= recording duration
- `pageNumber`, `measureNumber`, `beatPosition` must be valid for the sheet music

---

## Data Storage Strategy

### Client-Side (Dexie/IndexedDB)

All entities are stored using Dexie (IndexedDB wrapper) for offline functionality:

- **SheetMusic**: Main store with file data and parsed structure (MusicXML files)
- **PageTurnConfiguration**: Settings store (global and piece-specific)
- **Annotation**: Annotations store, indexed by sheetMusicId
- **PerformanceRecording**: Recordings store, indexed by sheetMusicId
- **CurrentPosition**: Transient, stored in memory only (updated continuously)
- **AudioAnalysisResult**: Transient, stored in memory only (discarded after position calculation)

Dexie provides a simpler, promise-based API compared to native IndexedDB, with better TypeScript support and easier querying. All data persists offline using IndexedDB, enabling the offline-first requirement (FR-009).

### Backend (Optional - PostgreSQL)

For future features (file upload, sharing, sync):
- **Database**: PostgreSQL (all environments: development, testing via Testcontainers, production)
- **Migrations**: Flyway for database schema versioning
- **SheetMusic**: File storage + metadata (optional)
- **PerformanceRecording**: Optional cloud backup
- **Annotation**: Optional sync across devices

Backend storage is optional as the application is offline-first. When backend storage is needed, PostgreSQL is used with Testcontainers for integration testing, ensuring consistency across all environments. Flyway manages database schema migrations.

## Relationships Summary

```
SheetMusic (1) ──< (many) Page
SheetMusic (1) ──< (many) Annotation
SheetMusic (1) ──< (many) PerformanceRecording
SheetMusic (1) ──< (0..1) PageTurnConfiguration (piece-specific)
PageTurnConfiguration (global, sheetMusicId = null)

Page (1) ──< (many) Measure
Measure (1) ──< (many) Note

SheetMusic (1) ──< (1) CurrentPosition (transient, in-memory)

AudioAnalysisResult (1) ──< (many) DetectedNote
AudioAnalysisResult (1) ──> (1) CurrentPosition (used to calculate)

PerformanceRecording (1) ──< (many) PositionSnapshot
```

## Validation Summary

- All string IDs must be valid UUIDs
- All timestamps must be valid ISO 8601 dates
- All numeric values must be within reasonable ranges
- All enum values must match defined options
- All foreign key references must point to existing entities
- Position coordinates must be within valid bounds for their sheet music

