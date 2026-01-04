/**
 * Maps frequencies to musical notes.
 * Uses standard pitch mapping (A4 = 440Hz).
 */

import type { Pitch } from '../types';

/**
 * Standard pitch: A4 = 440Hz
 * MIDI note 69 = A4
 * Formula: frequency = 440 * 2^((midiNote - 69) / 12)
 */

const A4_FREQUENCY = 440;
const A4_MIDI_NOTE = 69;
const SEMITONES_PER_OCTAVE = 12;

/**
 * Note names in order (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
 * MIDI note 0 = C-1, MIDI note 60 = C4
 */
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
const NOTE_STEPS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

/**
 * Maps frequency (Hz) to musical pitch.
 * @param frequency - Frequency in Hz
 * @returns Pitch information (step, octave, alter)
 */
export function frequencyToPitch(frequency: number): Pitch {
  if (frequency <= 0) {
    throw new Error('Frequency must be positive');
  }

  // Calculate MIDI note number from frequency
  // midiNote = 69 + 12 * log2(frequency / 440)
  const midiNote = A4_MIDI_NOTE + SEMITONES_PER_OCTAVE * Math.log2(frequency / A4_FREQUENCY);
  const roundedMidiNote = Math.round(midiNote);

  // Calculate octave (MIDI note 0 = C-1, MIDI note 60 = C4)
  const octave = Math.floor(roundedMidiNote / SEMITONES_PER_OCTAVE) - 1;

  // Get note name from MIDI note (0-11)
  const noteIndex = roundedMidiNote % SEMITONES_PER_OCTAVE;
  const noteName = NOTE_NAMES[noteIndex];

  // Extract step and alter
  const step = noteName[0] as Pitch['step'];
  const alter = noteName.length > 1 ? (noteName[1] === '#' ? 1 : -1) : 0;

  return { step, octave, alter };
}

/**
 * Maps pitch to frequency (Hz).
 * @param pitch - Pitch information
 * @returns Frequency in Hz
 */
export function pitchToFrequency(pitch: Pitch): number {
  // Map step to semitone offset from C
  const stepOffsets: Record<Pitch['step'], number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };

  const stepOffset = stepOffsets[pitch.step];
  const alterOffset = pitch.alter;
  const semitoneOffset = stepOffset + alterOffset;

  // Calculate MIDI note number
  // MIDI note 0 = C-1, so C4 = 60
  // octave 4 means MIDI note = (4 + 1) * 12 + semitoneOffset
  const midiNote = (pitch.octave + 1) * SEMITONES_PER_OCTAVE + semitoneOffset;

  // Calculate frequency from MIDI note
  // frequency = 440 * 2^((midiNote - 69) / 12)
  return A4_FREQUENCY * Math.pow(2, (midiNote - A4_MIDI_NOTE) / SEMITONES_PER_OCTAVE);
}

