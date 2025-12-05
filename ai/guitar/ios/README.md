# Guitar Songbook iOS App

A native iOS app for managing your guitar songbook with chord diagrams, Spotify integration, and more.

## Features

All functionality from the web app has been implemented in native SwiftUI:

### 📱 Song Management
- Add, edit, and delete songs
- Store song details: title, artist, chords, capo position, notes
- Automatic date tracking
- Album cover images from Spotify

### 🎵 Spotify Integration
- Search Spotify's catalog for songs
- Auto-fill song details from Spotify
- Open songs directly in Spotify
- Demo mode when API not available

### 🎸 Chord Diagrams
- 50+ chord fingering diagrams built-in
- Visual chord charts with finger positions
- Support for major, minor, 7th, maj7, m7, sus, power, dim, aug chords
- Expandable chord view per song

### 🔍 Filtering & Sorting
- Filter by chord
- Filter by capo position  
- Text search for songs and artists
- Sort by title, artist, chords, capo, or date added

### ⚡ Quick Add
- Streamlined quick add flow
- Search → Select → Add chords → Save
- Full form available for advanced editing

### 🔗 External Links
- Open songs in Spotify
- Search Ultimate Guitar for tabs
- Save tab URLs for quick access

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

3. **Build and Run**
   - Select your target device or simulator
   - Press ⌘R to build and run

## Project Structure

```
GuitarSongbook/
├── GuitarSongbookApp.swift     # App entry point
├── Models/
│   ├── Song.swift              # Song data model
│   ├── ChordLibrary.swift      # Chord fingering database
│   └── SpotifyModels.swift     # Spotify API response models
├── Services/
│   ├── SongStore.swift         # Song data persistence & state
│   └── SpotifyService.swift    # Spotify API integration
├── Views/
│   ├── ContentView.swift       # Main app view
│   ├── SongListView.swift      # Song list with swipe actions
│   ├── FilterControlsView.swift # Search & filter UI
│   ├── QuickAddView.swift      # Quick add form
│   ├── AddSongView.swift       # Full add/edit form
│   ├── SongDetailView.swift    # Song detail sheet
│   └── ChordDiagramView.swift  # Chord diagram rendering
└── Assets.xcassets/            # App icons & colors
```

## Architecture

The app uses:
- **SwiftUI** for all UI components
- **@StateObject** and **@EnvironmentObject** for state management
- **UserDefaults** for local data persistence
- **async/await** for network calls
- **Canvas** API for chord diagram rendering

## Customization

### Spotify Credentials
Update the credentials in `SpotifyService.swift`:
```swift
private let clientId = "your_client_id"
private let clientSecret = "your_client_secret"
```

### Accent Color
Modify the color in `Assets.xcassets/AccentColor.colorset/Contents.json` to match your brand.

### Adding New Chords
Add new chord fingerings in `ChordLibrary.swift`:
```swift
"ChordName": ChordData(
    fingers: [E, A, D, G, B, e],  // -1 = mute, 0 = open, 1+ = fret
    name: "Full Chord Name",
    barre: nil  // or fret number for barre chords
)
```

## Screenshots

The app features:
- Clean, modern iOS design
- Dark mode support
- Swipe actions for quick edit/delete
- Expandable chord diagrams
- Native iOS navigation patterns

## Data Persistence

Songs are stored locally using UserDefaults. Data persists between app launches but is not synced across devices. For cloud sync, you could integrate:
- iCloud/CloudKit
- Firebase
- Your own backend

## License

MIT License - Feel free to use this code for your own projects!

## Credits

- Chord fingering data compiled from standard guitar teaching resources
- Spotify API for song search functionality
- SwiftUI and Apple's developer frameworks

