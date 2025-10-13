# My Guitar Songbook 🎸

A comprehensive web application for tracking your guitar repertoire with chords, capo positions, and Spotify integration.

## Features

### 🎵 **Song Management**
- **Add Songs**: Track song title, artist, and personal notes
- **Edit Songs**: Update any song information easily
- **Delete Songs**: Remove songs from your collection
- **Local Storage**: All data persists between sessions

### 🎸 **Guitar-Specific Features**
- **Chord Tracking**: Add and display guitar chords for each song
- **Capo Position**: Track which fret you use your capo on (0-7)
- **Chord Filtering**: Filter songs by specific chords
- **Capo Filtering**: Find songs by capo position

### 🎧 **Spotify Integration**
- **Spotify URLs**: Add Spotify track links to songs
- **Embedded Player**: Play songs directly in the browser
- **Quick Access**: Open songs in Spotify app
- **Visual Indicators**: See which songs have Spotify links

### 🔍 **Advanced Filtering**
- **Chord Filter**: Find songs containing specific chords
- **Capo Filter**: Filter by capo position (0-7)
- **Search**: Search by song title or artist name
- **Combined Filters**: Use multiple filters simultaneously

### 📱 **User Experience**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Beautiful gradient design with smooth animations
- **Real-time Stats**: See total song count and filtered results
- **Notifications**: Success/error messages for all actions
- **Keyboard Support**: Full keyboard navigation

## How to Use

### Adding Songs
1. **Basic Info**: Enter song title and artist (required)
2. **Spotify Link**: Paste Spotify track URL (optional)
3. **Capo Position**: Select fret position (0-7)
4. **Chords**: Enter chords separated by commas (e.g., "Am, F, C, G")
5. **Notes**: Add any personal notes about the song
6. **Submit**: Click "Add Song" to save

### Playing Music
1. **Spotify Integration**: Songs with Spotify URLs show a "Play" button
2. **Embedded Player**: Click "Play" to open the Spotify player modal
3. **External Link**: Click "Open in Spotify" to launch the Spotify app

### Filtering Songs
1. **By Chord**: Select a chord from the dropdown to see songs containing that chord
2. **By Capo**: Choose a capo position to filter songs
3. **By Search**: Type song title or artist name to search
4. **Clear Filters**: Click "Clear Filters" to reset all filters

### Managing Songs
1. **Edit**: Click the edit button (pencil icon) to modify a song
2. **Delete**: Click the delete button (trash icon) to remove a song
3. **Play**: Click the play button (Spotify icon) to play the song

## File Structure

```
ai/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling and responsive design
├── script.js      # JavaScript functionality
└── README.md      # This documentation
```

## Technical Features

- **Pure JavaScript**: No frameworks, lightweight and fast
- **Local Storage**: All data saved in browser's local storage
- **Responsive CSS**: Modern CSS Grid and Flexbox layouts
- **Spotify Embed**: Uses Spotify's official embed API
- **Accessibility**: Semantic HTML and keyboard navigation
- **Performance**: Efficient DOM manipulation and event handling

## Browser Support

Works in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Getting Started

1. Open `index.html` in your web browser
2. Start adding your guitar songs
3. All data is automatically saved locally
4. No installation or setup required!

## Example Usage

### Adding a Song
- **Title**: "Wonderwall"
- **Artist**: "Oasis"
- **Spotify URL**: "https://open.spotify.com/track/2CT3r93YuSHtm57mjxvjhH"
- **Capo Position**: "2nd Fret"
- **Chords**: "Am, F, C, G"
- **Notes**: "Great campfire song, easy strumming pattern"

### Filtering Examples
- **Find all songs with Am chord**: Select "Am" from chord filter
- **Find songs with capo on 2nd fret**: Select "2nd Fret" from capo filter
- **Find songs by Oasis**: Type "Oasis" in search box
- **Complex filter**: Find Oasis songs with Am chord and capo on 2nd fret

## Tips for Best Results

1. **Consistent Chord Names**: Use standard chord notation (Am, F, C, G, etc.)
2. **Spotify URLs**: Copy the full Spotify track URL from the share menu
3. **Capo Positions**: Be consistent with capo numbering (0 = no capo)
4. **Notes**: Use notes for strumming patterns, difficulty level, or performance tips
5. **Regular Updates**: Keep your songbook updated as you learn new songs

Enjoy building your guitar repertoire! 🎸🎵
