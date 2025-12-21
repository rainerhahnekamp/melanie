# Feature Specification: Melanie - Sheet Music Player with Audio Position Tracking

**Application Name**: Melanie  
**Feature Branch**: `001-sheet-music-player`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "My goal is to write an web based application, which can also be used on mobile and offline mode. The application's goal is show sheets (music) to the artist while he is playing. The app should listen to the artist and be able to identify at which position he is at any time. The location inside the sheet should the be used to support automatic swtich to a new page. The artist should be able to set the time when the page turn should happen. That could be 2 \"Takte\" before the end of the page or also just 4 seconds before the end."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Sheet Music and Track Position (Priority: P1)

An artist loads a sheet music file into the application. After the sheet music is displayed, the artist presses a start button to begin audio tracking. Once started, the application captures audio from the device microphone, analyzes the music in real-time, and highlights the current position in the sheet music as the artist plays. The artist can see exactly where they are in the music at any moment.

**Why this priority**: This is the core functionality of the application. Without accurate position tracking and visual feedback, the application cannot fulfill its primary purpose of helping artists follow along with their sheet music while playing.

**Independent Test**: Can be fully tested by loading a sheet music file, pressing the start button to begin audio capture, playing a known piece of music, and verifying that the highlighted position in the sheet music matches the played notes. This delivers immediate value by showing artists their current position in the music.

**Acceptance Scenarios**:

1. **Given** an artist has loaded a sheet music file, **When** the sheet music is displayed, **Then** a start button is available to begin audio tracking
2. **Given** an artist has loaded sheet music and sees the start button, **When** they press the start button, **Then** the application begins capturing audio and tracking position in the sheet music
3. **Given** the application is tracking position in the sheet music, **When** the artist plays notes, **Then** the highlighted position updates in real-time to match the played notes
4. **Given** the artist is playing, **When** they pause or stop playing, **Then** the position tracking pauses and resumes when playing continues
5. **Given** the artist is viewing sheet music, **When** they navigate to a different section manually, **Then** the position tracking adjusts to the new location

---

### User Story 2 - Automatic Page Turning (Priority: P2)

An artist configures automatic page turning settings (e.g., turn page 2 measures before the end or 4 seconds before the end). While playing, the application monitors the current position and automatically advances to the next page when the configured threshold is reached, allowing the artist to continue playing without manual intervention.

**Why this priority**: Automatic page turning significantly improves the user experience by eliminating the need for manual page navigation during performance, but it depends on accurate position tracking (P1) to function correctly.

**Independent Test**: Can be fully tested by loading a multi-page sheet music file, configuring page turn settings, playing through the first page, and verifying that the page automatically advances when the threshold is reached. This delivers value by enabling hands-free operation during performance.

**Acceptance Scenarios**:

1. **Given** an artist has loaded multi-page sheet music, **When** they configure page turn settings (e.g., 2 measures before end), **Then** the application saves these settings and applies them during playback
2. **Given** the artist is playing on a page, **When** the current position reaches the configured threshold before the page end, **Then** the application automatically advances to the next page
3. **Given** the artist has configured time-based page turning (e.g., 4 seconds), **When** the estimated time remaining on the current page reaches the threshold, **Then** the application automatically advances to the next page
4. **Given** the artist is on the last page, **When** the position reaches the end, **Then** the application does not attempt to turn to a non-existent page

---

### User Story 3 - Offline and Mobile Support (Priority: P2)

An artist downloads sheet music files to their device. The application works completely offline, allowing the artist to use it in locations without internet connectivity (e.g., during performances, rehearsals, or practice sessions). The application functions identically on mobile devices and desktop browsers.

**Why this priority**: Offline capability is essential for real-world use cases where internet connectivity may be unreliable or unavailable. Mobile support ensures the application can be used on portable devices during performances.

**Independent Test**: Can be fully tested by loading sheet music files, disabling network connectivity, and verifying that all core functionality (position tracking, page turning) continues to work. Mobile testing verifies responsive design and touch interactions. This delivers value by enabling use in any location regardless of connectivity.

**Acceptance Scenarios**:

1. **Given** an artist has loaded sheet music files, **When** they disconnect from the internet, **Then** the application continues to function normally (position tracking, page turning, navigation)
2. **Given** an artist accesses the application on a mobile device, **When** they load sheet music and start playing, **Then** the interface is responsive and touch-friendly, and all features work as on desktop
3. **Given** the application is offline, **When** the artist attempts to load new sheet music files, **Then** the application uses cached files or provides clear feedback that online access is required for new downloads
4. **Given** an artist is using the mobile version, **When** they rotate their device, **Then** the sheet music display adapts appropriately to the new orientation

---

### User Story 4 - Configure Page Turn Settings (Priority: P3)

An artist customizes when automatic page turns should occur. They can choose between measure-based timing (e.g., turn 2 measures before the end) or time-based timing (e.g., turn 4 seconds before the end). These settings are saved and can be adjusted per piece or globally.

**Why this priority**: While automatic page turning (P2) provides value with default settings, customization allows artists to optimize the experience for their playing style and tempo. This is a refinement feature that enhances usability.

**Independent Test**: Can be fully tested by accessing settings, configuring different page turn thresholds (both measure-based and time-based), saving settings, and verifying that page turns occur at the configured thresholds. This delivers value by allowing personalization of the automatic page turning behavior.

**Acceptance Scenarios**:

1. **Given** an artist wants to configure page turn settings, **When** they access the settings interface, **Then** they can choose between measure-based and time-based page turning
2. **Given** an artist selects measure-based page turning, **When** they specify a number of measures (e.g., 2), **Then** the application saves this setting and uses it for automatic page turns
3. **Given** an artist selects time-based page turning, **When** they specify a duration (e.g., 4 seconds), **Then** the application saves this setting and uses it for automatic page turns
4. **Given** an artist has configured page turn settings, **When** they load a different piece of music, **Then** they can choose to apply the same settings or configure piece-specific settings

---

### User Story 5 - Annotate Sheet Music (Priority: P3)

An artist adds personal annotations to sheet music (e.g., fingerings, practice notes, reminders, markings). These annotations are saved and persist with the sheet music file, allowing the artist to maintain their personal notes and markings.

**Why this priority**: Annotations enhance the practice and performance experience by allowing artists to personalize their sheet music with reminders and technical notes. This is a valuable feature but not essential for core functionality.

**Independent Test**: Can be fully tested by loading sheet music, adding annotations at specific positions, saving, and verifying that annotations persist and display correctly when the sheet music is reloaded. This delivers value by enabling artists to maintain personalized notes on their music.

**Acceptance Scenarios**:

1. **Given** an artist is viewing sheet music, **When** they add an annotation (text, symbol, or marking), **Then** the annotation is saved and displayed on the sheet music
2. **Given** an artist has added annotations to sheet music, **When** they save and reload the file, **Then** all annotations are preserved and displayed in their original positions
3. **Given** an artist wants to edit an annotation, **When** they select an existing annotation, **Then** they can modify or delete it
4. **Given** an artist has annotated sheet music, **When** they view it during playback, **Then** annotations remain visible and do not interfere with position tracking

---

### User Story 6 - Playback and Post-Analysis (Priority: P3)

An artist records their performance while playing. After the performance, the artist can review the recording, see a visual representation of their playing synchronized with the sheet music, and analyze aspects of their performance (e.g., tempo consistency, note accuracy, timing).

**Why this priority**: Playback and post-analysis provide valuable practice tools for artists to review and improve their performance, but this is a secondary feature that enhances the learning experience rather than being essential for live performance tracking.

**Independent Test**: Can be fully tested by recording a performance, stopping recording, and verifying that the recording can be played back with position tracking synchronized to the sheet music. This delivers value by enabling artists to review and analyze their practice sessions.

**Acceptance Scenarios**:

1. **Given** an artist is playing and tracking position, **When** they start recording, **Then** the application records both audio and position data synchronized with the sheet music
2. **Given** an artist has recorded a performance, **When** they play back the recording, **Then** the sheet music displays with position highlighting synchronized to the recorded audio
3. **Given** an artist is reviewing a recorded performance, **When** they analyze the recording, **Then** the application provides visual feedback about tempo, note accuracy, and timing relative to the sheet music
4. **Given** an artist has multiple recordings, **When** they access their recordings, **Then** they can select and review any previous recording with its associated sheet music

---

### Edge Cases

- What happens when the audio input is too quiet or contains significant background noise?
- How does the system handle tempo variations (ritardando, accelerando) during playback?
- What happens when the artist skips ahead or repeats a section manually?
- How does the system handle sheet music with repeat signs, codas, or other navigation markers?
- What happens when the artist plays notes that don't match the sheet music (wrong notes, improvisation)?
- How does the system handle polyphonic music where multiple notes are played simultaneously?
- What happens when the device microphone is denied or unavailable?
- How does the system handle very long pieces of music (memory and performance)?
- What happens when the artist pauses for an extended period (several minutes)?
- How does the system handle sheet music with irregular time signatures or complex rhythms?
- What happens when page turn settings would cause a turn before the page has been visible for a minimum duration?
- How does the system handle sheet music files that are corrupted or in unsupported formats?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display sheet music in a readable format optimized for viewing during performance
- **FR-002**: System MUST provide a start button that the artist must press after loading sheet music to begin audio tracking
- **FR-003**: System MUST capture audio input from the device microphone in real-time only after the start button is pressed
- **FR-004**: System MUST analyze captured audio to identify musical notes and their timing
- **FR-005**: System MUST determine the current position in the sheet music based on analyzed audio notes
- **FR-006**: System MUST highlight or indicate the current position in the displayed sheet music
- **FR-007**: System MUST support automatic page turning based on current position in the sheet music
- **FR-008**: System MUST allow artists to configure page turn timing using either measure-based (e.g., number of measures before page end) or time-based (e.g., seconds before page end) settings
- **FR-009**: System MUST function completely offline after initial setup and file loading
- **FR-010**: System MUST provide a responsive user interface that works on both mobile devices and desktop browsers
- **FR-011**: System MUST support loading sheet music files in standard formats (e.g., MusicXML, PDF with embedded music data)
- **FR-012**: System MUST handle tempo variations and maintain position tracking accuracy during tempo changes
- **FR-013**: System MUST allow manual navigation (scrolling, jumping to sections) that updates position tracking accordingly
- **FR-014**: System MUST persist page turn settings and allow per-piece or global configuration
- **FR-015**: System MUST handle multi-page sheet music files and navigate between pages automatically
- **FR-016**: System MUST provide visual feedback when audio input is unavailable or insufficient
- **FR-017**: System MUST maintain position tracking accuracy within acceptable tolerance (target: within 1 beat/measure) during normal playback
- **FR-018**: System MUST handle pause and resume scenarios without losing position context
- **FR-019**: System MUST support sheet music with standard musical notation elements (notes, rests, time signatures, key signatures, repeat signs)
- **FR-020**: System MUST support tracking audio from a single instrument only (not ensemble or multiple simultaneous instruments)
- **FR-021**: System MUST allow artists to add, edit, and delete annotations (text, symbols, markings) on sheet music
- **FR-022**: System MUST persist annotations with sheet music files and display them during playback
- **FR-023**: System MUST support recording performances with synchronized position tracking data
- **FR-024**: System MUST allow playback of recorded performances with position highlighting synchronized to recorded audio
- **FR-025**: System MUST provide post-analysis capabilities for recorded performances (e.g., tempo analysis, note accuracy, timing visualization)

### Key Entities *(include if feature involves data)*

- **Sheet Music**: Represents a musical composition with notation data. Key attributes include pages, measures, notes with timing information, time signatures, key signatures, and navigation markers (repeats, codas). Relationships: contains multiple pages, each page contains multiple measures.

- **Current Position**: Represents the artist's location within the sheet music at a given moment. Key attributes include current page number, current measure, current beat position within measure, and timestamp. Relationships: references specific locations in Sheet Music entity.

- **Page Turn Configuration**: Represents user settings for automatic page turning. Key attributes include turn method (measure-based or time-based), threshold value (number of measures or seconds), and scope (global or piece-specific). Relationships: applies to Sheet Music entities.

- **Audio Analysis Result**: Represents the output of real-time audio processing. Key attributes include detected notes, note timings, confidence scores, and tempo estimation. Relationships: used to determine Current Position.

- **Annotation**: Represents user-added markings on sheet music. Key attributes include annotation type (text, symbol, marking), position coordinates on sheet music, content, and timestamp. Relationships: associated with specific locations in Sheet Music entity.

- **Performance Recording**: Represents a recorded performance session. Key attributes include audio recording, synchronized position data, timestamp, duration, and associated sheet music reference. Relationships: linked to Sheet Music entity and contains multiple position snapshots over time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Artists can view and follow along with sheet music while playing, with position highlighting updating within 100ms of note detection
- **SC-002**: Automatic page turning occurs at the configured threshold (measure-based or time-based) with 95% accuracy across different musical pieces
- **SC-003**: The application functions identically offline and online, with 100% of core features (position tracking, page turning, navigation) available without network connectivity
- **SC-004**: The application provides a responsive interface on mobile devices, with touch interactions and display adapting correctly to screen sizes from 320px to 2560px width
- **SC-005**: Position tracking maintains accuracy within 1 beat/measure tolerance for 90% of playback time during normal performance conditions
- **SC-006**: Artists can configure and save page turn settings, with settings persisting across sessions and applying correctly during playback
- **SC-007**: The application handles sheet music files up to 50 pages in length without performance degradation or memory issues
- **SC-008**: Artists can successfully load and use sheet music files in supported formats, with 95% of standard MusicXML files loading and displaying correctly
- **SC-009**: Artists can add, edit, and delete annotations on sheet music, with annotations persisting across sessions and displaying correctly during playback
- **SC-010**: Artists can record performances with synchronized position tracking, with 100% of recordings preserving both audio and position data
- **SC-011**: Artists can play back recorded performances with position highlighting synchronized to recorded audio, with synchronization accuracy within 100ms
- **SC-012**: Artists can access post-analysis features for recorded performances, with analysis results displaying within 2 seconds of playback completion

## Assumptions

- Artists will use the application primarily with acoustic instruments that produce audible sound captured by device microphones
- Standard sheet music notation formats (MusicXML, PDF with music data) are sufficient for initial implementation
- Artists have basic familiarity with musical notation and terminology (measures, beats, tempo)
- Device microphones provide adequate audio quality for note detection in typical performance environments
- Artists primarily use the application during practice sessions and performances where they are actively playing
- Internet connectivity may be unavailable during actual use, making offline functionality essential
- Mobile devices have sufficient processing power for real-time audio analysis using Web Audio API
- The application tracks audio from a single instrument only (not ensembles or multiple simultaneous instruments)
- Artists may want to add personal annotations and review recorded performances for practice improvement

## Dependencies

- Browser support for Web Audio API and microphone access
- Device microphone permissions and availability
- Sheet music files in supported formats (MusicXML or equivalent)
- Sufficient device memory and processing power for real-time audio analysis
- Responsive web design frameworks or capabilities for mobile support
- Offline storage mechanisms (e.g., IndexedDB, Service Workers) for caching sheet music files

## Future Considerations

The following features have been identified as potentially valuable but are deferred for future consideration:

1. **Error Recovery and Manual Recalibration**: Ability to manually correct position when tracking is lost or drifts, with recalibration options and confidence indicators

2. **Visual Customization for Performance Conditions**: Zoom levels, brightness/contrast adjustments, and night mode for different viewing environments (stage lighting, practice rooms)

3. **Initial Calibration/Setup Process**: Onboarding flow to calibrate for specific instruments, test audio input, and configure tuning references

4. **Audio Quality and Sensitivity Settings**: Adjustable sensitivity for quiet/loud instruments, background noise filtering, and frequency range selection for different instrument types

5. **Sheet Music Library Management**: Organization features such as folders, favorites, search functionality, and recent files list

6. **Battery Optimization**: Power-saving modes and options to reduce processing intensity for extended practice sessions on mobile devices

7. **Manual Navigation Enhancements**: Bookmark/jump-to-section features and quick navigation to specific measures

These features may be prioritized and added in future iterations based on user feedback and development capacity.
