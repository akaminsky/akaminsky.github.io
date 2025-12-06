# Never Fret 🎸

*The songs you'll never forget.*

A native iOS app for managing your guitar songbook with chord diagrams, a built-in tuner, Spotify integration, and more.

## Features

### 🎵 Song Management
- Add, edit, and delete songs
- Store song details: title, artist, chords, capo position, notes
- Automatic date tracking
- Album cover images from Spotify
- Link and unlink Spotify songs anytime

### 🎚️ Guitar Tuner
- **Real-time pitch detection** using your device's microphone
- Visual tuning gauge (flat ← → sharp)
- Color feedback: 🟢 green = in tune, 🟡 orange = close, 🔴 red = off
- String selector for standard tuning (E-A-D-G-B-E)
- Frequency display in Hz
- Works completely offline

### ⭐ Categories & Favorites
- Mark songs as favorites with one tap from the song card
- Create custom categories (Learning, Campfire, etc.)
- Filter songs by category
- Manage categories from the category manager
- Organize your songbook your way

### 🎸 Chord Diagrams
- 50+ chord fingering diagrams built-in
- Visual chord charts with finger positions
- Support for major, minor, 7th, maj7, m7, sus, power, dim, aug chords
- Expandable accordion view per song
- Open fret indicators (green circles)

### 🔗 Spotify Integration
- Search Spotify's catalog for songs
- Auto-fill song details from Spotify
- Link/unlink songs to Spotify anytime
- Open songs directly in Spotify app
- Album cover art display
- Demo mode when API not available

### 🎼 Tab Links
- Save links to guitar tabs from popular sites
- Supported sites: Ultimate Guitar, Songsterr, Chordify, E-Chords, Chordie, 911tabs
- Quick search button opens Ultimate Guitar
- One-tap to open saved tab links

### 🔍 Filtering & Sorting
- Filter by chord
- Filter by capo position  
- Filter by category or favorites
- Text search for songs and artists
- Sort by title, artist, chords, capo, or date added
- Category pills for quick filtering

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
│   ├── ContentView.swift         # Main app view with song cards
│   ├── SongListView.swift        # Alternative list view
│   ├── FilterControlsView.swift  # Search & filter UI
│   ├── QuickAddView.swift        # Quick add form & color extensions
│   ├── AddSongView.swift         # Full add/edit form with Spotify linking
│   ├── SongDetailView.swift      # Song detail sheet
│   ├── ChordDiagramView.swift    # Chord diagram rendering
│   ├── TunerView.swift           # Guitar tuner UI
│   └── CategoryManagerView.swift # Category management
└── Assets.xcassets/              # App icons & colors
```

## Architecture

The app uses:
- **SwiftUI** for all UI components
- **@StateObject** and **@EnvironmentObject** for state management
- **UserDefaults + NSUbiquitousKeyValueStore** for local + iCloud persistence
- **AVAudioEngine** for real-time audio capture (tuner)
- **Accelerate framework** for FFT pitch detection
- **async/await** for network calls
- **Canvas** API for chord diagram rendering
- **Custom Codable decoding** for data migration

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

## Customization

### Spotify Credentials
For production use, update the credentials in `SpotifyService.swift`:
```swift
private let clientId = "your_client_id"
private let clientSecret = "your_client_secret"
```

Or remove real API calls and use demo mode only.

### Adding New Chords
Add new chord fingerings in `ChordLibrary.swift`:
```swift
"ChordName": ChordData(
    fingers: [E, A, D, G, B, e],  // -1 = mute, 0 = open, 1+ = fret
    name: "Full Chord Name",
    barre: nil  // or fret number for barre chords
)
```

## Privacy

The app requests one permission:
- **Microphone** - For the guitar tuner feature only. Audio is processed locally and never leaves your device.

No data is collected or transmitted except:
- iCloud sync (if enabled) - syncs to user's own iCloud account
- Spotify API calls - only when searching for songs

## UI Features

- Clean, modern iOS design inspired by Day One and Notion
- Dark mode support
- Context menus for quick actions (long press)
- Expandable chord diagrams with accordion animation
- Native iOS navigation patterns
- Real-time guitar tuner with visual feedback
- Floating action button for adding songs
- Category pills for quick filtering
- Swipe actions in list views

## App Store Preparation

To publish to the App Store:
1. Create an Apple Developer account ($99/year)
2. Update bundle identifier to your own (currently `com.yourname.NeverFret`)
3. Create an app icon (1024x1024)
4. Capture screenshots for required device sizes
5. Write a privacy policy
6. If using Spotify API with real credentials, document the integration
7. Archive and upload via Xcode

## Known Limitations

- Chord diagrams support common chords; exotic chords may show generic fingering
- Spotify integration requires valid API credentials for full functionality
- iCloud sync has slight delay between devices

## License

MIT License - Feel free to use this code for your own projects!

## Credits

- Chord fingering data compiled from standard guitar teaching resources
- Pitch detection using autocorrelation/FFT algorithm
- Spotify API for song search functionality
- SwiftUI and Apple's developer frameworks
