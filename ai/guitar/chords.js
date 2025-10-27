// Guitar Chord Library
// Format: [string1, string2, string3, string4, string5, string6] (low E to high E)
// -1 = don't play, 0 = open, 1-15 = fret number

const CHORD_LIBRARY = {
    // Major Chords
    'C': { fingers: [-1, 3, 2, 0, 1, 0], name: 'C Major' },
    'D': { fingers: [-1, -1, 0, 2, 3, 2], name: 'D Major' },
    'E': { fingers: [0, 2, 2, 1, 0, 0], name: 'E Major' },
    'F': { fingers: [1, 3, 3, 2, 1, 1], name: 'F Major', barre: 1 },
    'G': { fingers: [3, 2, 0, 0, 0, 3], name: 'G Major' },
    'A': { fingers: [-1, 0, 2, 2, 2, 0], name: 'A Major' },
    'B': { fingers: [-1, 2, 4, 4, 4, 2], name: 'B Major', barre: 2 },
    
    // Minor Chords
    'Am': { fingers: [-1, 0, 2, 2, 1, 0], name: 'A Minor' },
    'Bm': { fingers: [-1, 2, 4, 4, 3, 2], name: 'B Minor', barre: 2 },
    'Cm': { fingers: [-1, 3, 5, 5, 4, 3], name: 'C Minor', barre: 3 },
    'Dm': { fingers: [-1, -1, 0, 2, 3, 1], name: 'D Minor' },
    'Em': { fingers: [0, 2, 2, 0, 0, 0], name: 'E Minor' },
    'Fm': { fingers: [1, 3, 3, 1, 1, 1], name: 'F Minor', barre: 1 },
    'Gm': { fingers: [3, 5, 5, 3, 3, 3], name: 'G Minor', barre: 3 },
    
    // Seventh Chords
    'A7': { fingers: [-1, 0, 2, 0, 2, 0], name: 'A Seventh' },
    'B7': { fingers: [-1, 2, 1, 2, 0, 2], name: 'B Seventh' },
    'C7': { fingers: [-1, 3, 2, 3, 1, 0], name: 'C Seventh' },
    'D7': { fingers: [-1, -1, 0, 2, 1, 2], name: 'D Seventh' },
    'E7': { fingers: [0, 2, 0, 1, 0, 0], name: 'E Seventh' },
    'F7': { fingers: [1, 3, 1, 2, 1, 1], name: 'F Seventh', barre: 1 },
    'G7': { fingers: [3, 2, 0, 0, 0, 1], name: 'G Seventh' },
    
    // Major Seventh
    'Amaj7': { fingers: [-1, 0, 2, 1, 2, 0], name: 'A Major 7' },
    'Cmaj7': { fingers: [-1, 3, 2, 0, 0, 0], name: 'C Major 7' },
    'Dmaj7': { fingers: [-1, -1, 0, 2, 2, 2], name: 'D Major 7' },
    'Emaj7': { fingers: [0, 2, 1, 1, 0, 0], name: 'E Major 7' },
    'Fmaj7': { fingers: [1, 3, 2, 2, 1, 1], name: 'F Major 7', barre: 1 },
    'Gmaj7': { fingers: [3, 2, 0, 0, 0, 2], name: 'G Major 7' },
    
    // Minor Seventh
    'Am7': { fingers: [-1, 0, 2, 0, 1, 0], name: 'A Minor 7' },
    'Bm7': { fingers: [-1, 2, 4, 2, 3, 2], name: 'B Minor 7', barre: 2 },
    'Cm7': { fingers: [-1, 3, 5, 3, 4, 3], name: 'C Minor 7', barre: 3 },
    'Dm7': { fingers: [-1, -1, 0, 2, 1, 1], name: 'D Minor 7' },
    'Em7': { fingers: [0, 2, 0, 0, 0, 0], name: 'E Minor 7' },
    'Fm7': { fingers: [1, 3, 1, 1, 1, 1], name: 'F Minor 7', barre: 1 },
    'Gm7': { fingers: [3, 5, 3, 3, 3, 3], name: 'G Minor 7', barre: 3 },
    
    // Suspended Chords
    'Asus4': { fingers: [-1, 0, 2, 2, 3, 0], name: 'A Suspended 4' },
    'Dsus4': { fingers: [-1, -1, 0, 2, 3, 3], name: 'D Suspended 4' },
    'Esus4': { fingers: [0, 2, 2, 2, 0, 0], name: 'E Suspended 4' },
    'Gsus4': { fingers: [3, 3, 0, 0, 1, 3], name: 'G Suspended 4' },
    
    'Asus2': { fingers: [-1, 0, 2, 2, 0, 0], name: 'A Suspended 2' },
    'Dsus2': { fingers: [-1, -1, 0, 2, 3, 0], name: 'D Suspended 2' },
    'Esus2': { fingers: [0, 2, 2, 4, 0, 0], name: 'E Suspended 2' },
    
    // Power Chords
    'A5': { fingers: [-1, 0, 2, 2, -1, -1], name: 'A Power Chord' },
    'D5': { fingers: [-1, -1, 0, 2, 3, -1], name: 'D Power Chord' },
    'E5': { fingers: [0, 2, 2, -1, -1, -1], name: 'E Power Chord' },
    'G5': { fingers: [3, 5, 5, -1, -1, -1], name: 'G Power Chord' },
    
    // Diminished
    'Adim': { fingers: [-1, 0, 1, 2, 1, 2], name: 'A Diminished' },
    'Bdim': { fingers: [-1, 2, 3, 4, 3, -1], name: 'B Diminished' },
    'Cdim': { fingers: [-1, 3, 4, 2, 4, 2], name: 'C Diminished' },
    'Ddim': { fingers: [-1, -1, 0, 1, 0, 1], name: 'D Diminished' },
    'Edim': { fingers: [-1, -1, 2, 3, 2, 3], name: 'E Diminished' },
    
    // Augmented
    'Aaug': { fingers: [-1, 0, 3, 2, 2, 1], name: 'A Augmented' },
    'Caug': { fingers: [-1, 3, 2, 1, 1, 0], name: 'C Augmented' },
    'Daug': { fingers: [-1, -1, 0, 3, 3, 2], name: 'D Augmented' },
    'Eaug': { fingers: [0, 3, 2, 1, 1, 0], name: 'E Augmented' },
};

// Function to find chord by various notations
function findChord(chordName) {
    // Normalize the chord name
    const normalized = chordName.trim();
    
    // Direct match
    if (CHORD_LIBRARY[normalized]) {
        return CHORD_LIBRARY[normalized];
    }
    
    // Try common variations
    const variations = [
        normalized,
        normalized.replace('min', 'm'),
        normalized.replace('maj', ''),
        normalized.replace('M', ''),
        normalized.replace('minor', 'm'),
        normalized.replace('major', ''),
    ];
    
    for (const variation of variations) {
        if (CHORD_LIBRARY[variation]) {
            return CHORD_LIBRARY[variation];
        }
    }
    
    return null;
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CHORD_LIBRARY, findChord };
}

