# Fret Not 🎸

*The songs you'll never forget.*

A native iOS app for managing your guitar songbook with chord diagrams, a built-in tuner, Spotify integration, and more.

## Features

### 🎵 Song Management
- Add, edit, and delete songs
- Store song details: title, artist, chords (optional), capo position, notes
- Automatic date tracking
- Album cover images from Spotify
- Link and unlink Spotify songs anytime (even after adding manually)
- Swipe actions for quick edit/delete/favorite
- **Bulk import from Spotify playlists** - Paste a playlist link to add all songs at once
- Add songs manually or via Spotify search
- Duplicate detection prevents adding the same song twice

### 📚 Chord Log
- **View all chords you've learned** across all your songs
- **Chord Identifier** - Tap the fretboard to identify any chord you're playing
- Interactive fretboard interface (5 frets x 6 strings)
- Tap strings to toggle open (O) or muted (×)
- Instantly see matching chords with diagrams
- Visual chord diagrams for each chord
- Search chords by name
- See how many songs use each chord
- Beautiful grid layout with stats

### 🎚️ Guitar Tuner
- **Real-time pitch detection** using your device's microphone
- **Improved accuracy** - Uses actual device sample rate for precise frequency detection
- Visual tuning gauge (flat ← → sharp)
- Color feedback: 🟢 green = in tune, 🟡 orange = close, 🔴 red = off
- String selector for standard tuning (E-A-D-G-B-E)
- Frequency display in Hz with smoothing for stable readings
- Works completely offline
- Bluetooth headset support

### ⭐ Lists & Favorites
- Mark songs as favorites with one tap from the song card
- Create custom lists (Learning, Campfire, etc.)
- Filter songs by list or favorites
- Manage lists from Settings
- Organize your songbook your way
- Favorites cannot be deleted (built-in list)

### 🎸 Chord Diagrams
- **200+ chord fingering diagrams built-in** - Comprehensive chord library!
- Visual chord charts with finger positions
- **All chord types supported:**
  - Major, minor, 7th, maj7, m7 in all keys (including sharps/flats)
  - Suspended chords (sus2, sus4)
  - Power chords (5)
  - 6th chords (6, m6)
  - Add9 chords
  - 9th chords (9, maj9, m9)
  - Diminished (dim, dim7)
  - Half-diminished (m7b5)
  - Augmented (aug)
  - Altered dominants (7#5, 7b5, 7#9, 7b9)
- Expandable accordion view per song
- Open fret indicators (green circles)
- Large, bold chord names for easy reading
- Barre chord indicators

### 🔗 Spotify Integration
- Search Spotify's catalog for songs via secure Netlify backend
- Auto-fill song details from Spotify
- Link/unlink songs to Spotify anytime (even when adding manually)
- Open songs directly in Spotify app
- Album cover art display
- Dedicated Spotify search sheets
- **Bulk playlist import** - Import entire Spotify playlists at once
- Secure backend architecture - Credentials stored server-side, never in app
- Demo mode fallback when API unavailable

### 🎼 Tab Links
- Save links to guitar tabs from popular sites
- Supported sites: Ultimate Guitar, Songsterr, Chordify, E-Chords, Chordie, 911tabs
- Quick search button opens Ultimate Guitar
- One-tap to open saved tab links
- Edit or remove tab links anytime

### 🔍 Filtering & Sorting
- Filter by chord (including "Has Chords" and "No Chords" options)
- Filter by capo position  
- Filter by list or favorites
- Text search for songs and artists
- Sort by title, artist, chords, capo, or date added
- List pills for quick filtering
- Instant filter updates with smooth animations
- "No Chords" filter helps quickly find songs that need chords added

### ⚙️ Settings
- **Manage Lists** - Create, rename, and delete custom lists
- **Import Playlist** - Bulk import songs from Spotify playlists
- **Stats** - View total songs, favorites, and unique chords
- **iCloud Sync** - See sync status
- **Send Feedback** - Link to feedback form
- **Website** - Link to fretnot.app
- **About** - Version info and credits

### ☁️ iCloud Sync
- Automatic sync across iPhone, iPad, and Mac
- Works offline with automatic sync when online
- Falls back to local storage if iCloud unavailable
- Data migration for backwards compatibility

### ♿ Accessibility
- WCAG AA compliant color contrast
- VoiceOver support
- Dynamic Type support
- Clear visual hierarchy

## Navigation

The app uses a bottom tab bar with four main sections:

1. **Songs** 🎵 - Your song library with filters and search
2. **Chords** 🎸 - Chord log showing all learned chords
3. **Tuner** 🎚️ - Guitar tuner with real-time pitch detection
4. **Settings** ⚙️ - App settings, stats, and feedback

## Requirements

- iOS 17.0+
- Xcode 15.0+
- Swift 5.9+

## Installation

1. **Open in Xcode**
   ```bash
   cd ai/guitar/ios/GuitarSongbook
   open GuitarSongbook.xcodeproj
   ```

2. **Configure Signing**
   - Select the project in the navigator
   - Go to "Signing & Capabilities"
   - Select your development team

3. **Enable iCloud (Optional)**
   - In Signing & Capabilities, click "+ Capability"
   - Add "iCloud"
   - Check "Key-value storage"

4. **Build and Run**
   - Select your target device or simulator
   - Press ⌘R to build and run

## Project Structure

```
GuitarSongbook/
├── GuitarSongbookApp.swift       # App entry point
├── Models/
│   ├── Song.swift                # Song data model with migration support
│   ├── ChordLibrary.swift        # Chord fingering database
│   └── SpotifyModels.swift       # Spotify API response models
├── Services/
│   ├── SongStore.swift           # Song data persistence & iCloud sync
│   ├── SpotifyService.swift      # Spotify API integration
│   ├── AudioPitchDetector.swift  # Real-time pitch detection for tuner
│   └── TabURLDetector.swift      # Tab URL detection from clipboard
├── Views/
│   ├── MainTabView.swift         # Tab bar navigation
│   ├── ContentView.swift         # Songs tab - main app view
│   ├── ChordLogView.swift        # Chords tab - chord library
│   ├── ChordIdentifierView.swift # Interactive chord identifier
│   ├── TunerView.swift           # Tuner tab - guitar tuner
│   ├── SettingsView.swift        # Settings tab - app settings
│   ├── SongListView.swift        # Alternative list view
│   ├── FilterControlsView.swift  # Search & filter UI with chord filters
│   ├── QuickAddView.swift        # Quick add form & color extensions
│   ├── AddSongView.swift         # Full add/edit form with Spotify linking
│   ├── BulkImportView.swift      # Spotify playlist bulk import
│   ├── SongDetailView.swift      # Song detail sheet
│   ├── ChordDiagramView.swift    # Chord diagram rendering
│   └── CategoryManagerView.swift # List management
└── Assets.xcassets/              # App icons & colors
```

## Architecture

The app uses:
- **SwiftUI** for all UI components
- **TabView** for bottom navigation
- **@StateObject** and **@EnvironmentObject** for state management
- **UserDefaults + NSUbiquitousKeyValueStore** for local + iCloud persistence
- **AVAudioEngine** for real-time audio capture (tuner)
- **Accelerate framework** for FFT pitch detection with improved autocorrelation algorithm
- **async/await** for network calls
- **Canvas** API for chord diagram rendering
- **Custom Codable decoding** for data migration
- **@MainActor** for thread-safe UI updates
- **Netlify Functions** for secure Spotify API integration
- **Hann windowing** and **frequency smoothing** for accurate pitch detection

## Color System

The app uses a simplified, accessible color palette:

| Color | Hex | Use |
|-------|-----|-----|
| App Accent | #F38C03 | Primary actions, buttons, favorites, links |
| Accent Text | #B35A00 | Text on light backgrounds (WCAG AA compliant) |
| System Grays | - | Badges, backgrounds, secondary elements |
| Green | - | Spotify branding, tuner "in tune" indicator |
| Red | - | Destructive actions (delete) |

All interactive text colors meet WCAG AA contrast requirements (4.5:1 minimum).

## Data Migration

The app includes automatic data migration for backwards compatibility:
- Songs saved with older versions are automatically migrated
- Missing fields receive sensible defaults:
  - `isFavorite` → `false`
  - `categories` → `[]`
  - `tabUrl` → `nil`
  - `createdAt` → uses `dateAdded`
- No user action required

## Spotify Backend Setup

The app uses a Netlify backend for secure Spotify API integration. See `NETLIFY_SETUP.md` for detailed setup instructions.

### Quick Setup:

1. Deploy Netlify functions from `netlify/functions/`
2. Set environment variables in Netlify:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
3. Update `netlifyBaseURL` in `SpotifyService.swift` with your Netlify site URL

The backend handles:
- Spotify authentication (client credentials flow)
- Song search
- Playlist track fetching

This keeps credentials secure (server-side only) and allows the app to work without embedding secrets.

### Adding New Chords
The app includes 200+ chords covering virtually all common guitar chords. To add more chord fingerings, edit `ChordLibrary.swift`:
```swift
"ChordName": ChordData(
    fingers: [E, A, D, G, B, e],  // -1 = mute, 0 = open, 1+ = fret
    name: "Full Chord Name",
    barre: nil  // or fret number for barre chords
)
```

Supported chord types include:
- Major, minor (all keys including sharps/flats)
- 7th, maj7, m7 (all keys)
- sus2, sus4, power chords (5)
- 6th, add9, 9th, maj9, m9
- dim, dim7, aug, m7b5
- Altered dominants (7#5, 7b5, 7#9, 7b9)

## Privacy

The app requests one permission:
- **Microphone** - For the guitar tuner feature only. Audio is processed locally and never leaves your device.

No data is collected or transmitted except:
- iCloud sync (if enabled) - syncs to user's own iCloud account
- Spotify API calls - only when searching for songs

## UI Features

- Clean, modern iOS design inspired by Day One and Notion
- Bottom tab bar navigation (Songs, Chords, Tuner, Settings)
- Dark mode support
- Context menus for quick actions (long press)
- Expandable chord diagrams with accordion animation
- Native iOS navigation patterns
- Real-time guitar tuner with visual feedback
- Floating action button for adding songs
- List pills for quick filtering
- Swipe actions in list views
- Keyboard dismissal on tap outside search fields
- Searchable chord log

## App Store Preparation

See `APP_STORE_CHECKLIST.md` for a comprehensive submission checklist.

Quick steps:
1. Create an Apple Developer account ($99/year)
2. Bundle identifier: `com.akaminsky.neverfret`
3. Create app icon (1024x1024) - current: `neverfreticon.png`
4. Capture screenshots for required device sizes
5. Create privacy policy (required for iCloud/data sync)
6. Set up Netlify backend for Spotify integration
7. Archive and upload via Xcode

The app uses:
- iCloud sync (requires privacy policy)
- Microphone access (tuner feature)
- Spotify API via Netlify backend

## Recent Updates

### Latest Improvements
- ✅ **Chord Identifier** - Interactive fretboard to identify chords you're playing!
  - Tap the fretboard grid to place fingers on any fret (1-5)
  - Tap string names to toggle open or muted
  - Instantly see matching chords with visual diagrams
  - Clear button to reset and try again
- ✅ **Massive chord library expansion** - From 50+ to 200+ chords!
  - All major and minor chords in every key (including C#, Db, Eb, F#, etc.)
  - Complete 7th, maj7, and m7 variations across all keys
  - Extended chords: 6th, add9, 9th, maj9, m9
  - Jazz chords: dim7, m7b5 (half-diminished), altered dominants
  - All suspended chords (sus2, sus4) for every key
  - Comprehensive power chord collection
- ✅ **Bulk playlist import** - Import entire Spotify playlists at once
- ✅ **Improved tuner accuracy** - Fixed sample rate detection for precise pitch readings
- ✅ **Manual song entry** - Add songs manually with optional chords field
- ✅ **Smart chord filters** - "Has Chords" and "No Chords" filters for quick organization
- ✅ **Spotify linking** - Link Spotify songs even when adding manually
- ✅ **Netlify backend** - Secure server-side Spotify API integration
- ✅ **Duplicate detection** - Prevents adding the same song twice
- ✅ **Filter animations** - Smooth, instant filter updates
- ✅ **Required fields** - Clear indicators (*) for required fields
- ✅ **App renaming** - Updated from "Never Fret" to "Fret Not"

### Technical Improvements
- Fixed deprecation warnings (allowBluetooth → allowBluetoothHFP)
- Improved pitch detection algorithm with normalization
- Better error handling and logging
- Thread-safe UI updates with @MainActor
- Data migration for backwards compatibility

## Known Limitations

- Chord identifier matches exact finger positions within first 5 frets
- Spotify integration requires Netlify backend setup for full functionality (see NETLIFY_SETUP.md)
- iCloud sync has slight delay between devices
- Tuner works best in quiet environments

## Feedback & Support

- **Feedback Form**: Available in Settings → Send Feedback
- **Website**: [fretnot.app](http://fretnot.app)
- **Built by**: [Alexa Kaminsky](http://alexakaminsky.com)

## License

MIT License - Feel free to use this code for your own projects!

## Credits

- Chord fingering data compiled from standard guitar teaching resources
- Pitch detection using autocorrelation/FFT algorithm
- Spotify API for song search functionality
- SwiftUI and Apple's developer frameworks
