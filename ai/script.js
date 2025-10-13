class GuitarSongbook {
    constructor() {
        this.songs = JSON.parse(localStorage.getItem('guitarSongs')) || [];
        this.currentFilter = {
            chord: '',
            capo: '',
            search: ''
        };
        this.editingId = null;
        this.spotifyAccessToken = null;
        this.spotifyClientId = 'b43e82c8141440d3b47fd8f5456a2015'; // Replace this with your actual Spotify Client ID
        
        this.initializeElements();
        this.bindEvents();
        this.updateChordFilter();
        this.render();
        this.updateStats();
        this.initializeSpotify();
    }

    initializeElements() {
        // Form elements
        this.songForm = document.getElementById('songForm');
        this.songTitle = document.getElementById('songTitle');
        this.artist = document.getElementById('artist');
        this.spotifyUrl = document.getElementById('spotifyUrl');
        this.capoPosition = document.getElementById('capoPosition');
        this.chords = document.getElementById('chords');
        this.notes = document.getElementById('notes');

        // Spotify search elements
        this.spotifySearch = document.getElementById('spotifySearch');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchResults = document.getElementById('searchResults');

        // Filter elements
        this.chordFilter = document.getElementById('chordFilter');
        this.capoFilter = document.getElementById('capoFilter');
        this.searchFilter = document.getElementById('searchFilter');
        this.clearFiltersBtn = document.getElementById('clearFilters');

        // Display elements
        this.songsList = document.getElementById('songsList');
        this.songsTable = document.getElementById('songsTable');
        this.emptyState = document.getElementById('emptyState');
        this.songCount = document.getElementById('songCount');

        // Side panel elements
        this.addSongButton = document.getElementById('addSongButton');
        this.addSongPanel = document.getElementById('addSongPanel');
        this.sidePanelOverlay = document.getElementById('sidePanelOverlay');
        this.closePanelButton = document.getElementById('closePanelButton');
        this.cancelButton = document.getElementById('cancelButton');

        // Modal elements
        this.spotifyModal = document.getElementById('spotifyModal');
        this.spotifyPlayer = document.getElementById('spotifyPlayer');
    }

    bindEvents() {
        // Form submission
        this.songForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Side panel events
        this.addSongButton.addEventListener('click', () => this.openSidePanel());
        this.closePanelButton.addEventListener('click', () => this.closeSidePanel());
        this.cancelButton.addEventListener('click', () => this.closeSidePanel());
        this.sidePanelOverlay.addEventListener('click', () => this.closeSidePanel());
        
        // Spotify search events
        this.searchBtn.addEventListener('click', () => this.searchSpotify());
        this.spotifySearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchSpotify();
        });
        
        // Filter events
        this.chordFilter.addEventListener('change', () => this.applyFilters());
        this.capoFilter.addEventListener('change', () => this.applyFilters());
        this.searchFilter.addEventListener('input', () => this.applyFilters());
        this.clearFiltersBtn.addEventListener('click', () => this.clearFilters());

        // Modal events
        const closeBtn = document.querySelector('.close-button');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        window.addEventListener('click', (e) => {
            if (e.target === this.spotifyModal) {
                this.closeModal();
            }
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const songData = {
            id: Date.now().toString(),
            title: this.songTitle.value.trim(),
            artist: this.artist.value.trim(),
            spotifyUrl: this.spotifyUrl.value.trim(),
            capoPosition: parseInt(this.capoPosition.value),
            chords: this.parseChords(this.chords.value.trim()),
            notes: this.notes.value.trim(),
            createdAt: new Date().toISOString()
        };

        if (this.editingId) {
            this.updateSong(this.editingId, songData);
        } else {
            this.addSong(songData);
        }

        this.resetForm();
    }

    parseChords(chordString) {
        if (!chordString) return [];
        return chordString.split(',').map(chord => chord.trim()).filter(chord => chord);
    }

    addSong(songData) {
        this.songs.unshift(songData);
        this.saveSongs();
        this.updateChordFilter();
        this.render();
        this.updateStats();
        this.showNotification('Song added successfully!', 'success');
        this.closeSidePanel();
    }

    updateSong(id, songData) {
        const index = this.songs.findIndex(song => song.id === id);
        if (index !== -1) {
            this.songs[index] = { ...this.songs[index], ...songData };
        this.saveSongs();
        this.updateChordFilter();
        this.render();
        this.updateStats();
        this.showNotification('Song updated successfully!', 'success');
        this.closeSidePanel();
        }
    }

    deleteSong(id) {
        if (confirm('Are you sure you want to delete this song?')) {
            this.songs = this.songs.filter(song => song.id !== id);
            this.saveSongs();
            this.updateChordFilter();
            this.render();
            this.updateStats();
            this.showNotification('Song deleted successfully!', 'info');
        }
    }

    editSong(id) {
        const song = this.songs.find(song => song.id === id);
        if (song) {
            this.songTitle.value = song.title;
            this.artist.value = song.artist;
            this.spotifyUrl.value = song.spotifyUrl;
            this.capoPosition.value = song.capoPosition;
            this.chords.value = song.chords.join(', ');
            this.notes.value = song.notes;
            this.editingId = id;
            
            // Open side panel for editing
            this.openSidePanel();
        }
    }

    resetForm() {
        this.songForm.reset();
        this.editingId = null;
        this.capoPosition.value = '0';
    }

    // Side Panel Methods
    openSidePanel() {
        this.addSongPanel.classList.add('open');
        this.sidePanelOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        this.songTitle.focus();
    }

    closeSidePanel() {
        this.addSongPanel.classList.remove('open');
        this.sidePanelOverlay.classList.remove('open');
        document.body.style.overflow = '';
        this.resetForm();
    }

    playSpotify(song) {
        if (!song.spotifyUrl) {
            this.showNotification('No Spotify URL available for this song', 'error');
            return;
        }

        // Extract track ID from Spotify URL
        const trackId = this.extractSpotifyTrackId(song.spotifyUrl);
        if (!trackId) {
            this.showNotification('Invalid Spotify URL', 'error');
            return;
        }

        this.openSpotifyModal(song, trackId);
    }

    extractSpotifyTrackId(url) {
        const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    }

    openSpotifyModal(song, trackId) {
        this.spotifyPlayer.innerHTML = `
            <div class="spotify-player-container">
                <h4>${song.title} - ${song.artist}</h4>
                <div class="spotify-embed">
                    <iframe 
                        src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator" 
                        width="100%" 
                        height="152" 
                        frameBorder="0" 
                        allowfullscreen="" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy">
                    </iframe>
                </div>
                <div class="spotify-actions">
                    <a href="${song.spotifyUrl}" target="_blank" class="spotify-link">
                        <i class="fab fa-spotify"></i> Open in Spotify
                    </a>
                </div>
            </div>
        `;
        this.spotifyModal.style.display = 'block';
    }

    closeModal() {
        this.spotifyModal.style.display = 'none';
    }

    updateChordFilter() {
        const allChords = new Set();
        this.songs.forEach(song => {
            song.chords.forEach(chord => allChords.add(chord));
        });

        this.chordFilter.innerHTML = '<option value="">All Chords</option>';
        Array.from(allChords).sort().forEach(chord => {
            const option = document.createElement('option');
            option.value = chord;
            option.textContent = chord;
            this.chordFilter.appendChild(option);
        });
    }

    applyFilters() {
        this.currentFilter.chord = this.chordFilter.value;
        this.currentFilter.capo = this.capoFilter.value;
        this.currentFilter.search = this.searchFilter.value.toLowerCase();
        this.render();
    }

    clearFilters() {
        this.chordFilter.value = '';
        this.capoFilter.value = '';
        this.searchFilter.value = '';
        this.currentFilter = { chord: '', capo: '', search: '' };
        this.render();
    }

    getFilteredSongs() {
        return this.songs.filter(song => {
            // Chord filter
            if (this.currentFilter.chord && !song.chords.includes(this.currentFilter.chord)) {
                return false;
            }

            // Capo filter
            if (this.currentFilter.capo !== '' && song.capoPosition !== parseInt(this.currentFilter.capo)) {
                return false;
            }

            // Search filter
            if (this.currentFilter.search) {
                const searchTerm = this.currentFilter.search;
                const titleMatch = song.title.toLowerCase().includes(searchTerm);
                const artistMatch = song.artist.toLowerCase().includes(searchTerm);
                if (!titleMatch && !artistMatch) {
                    return false;
                }
            }

            return true;
        });
    }

    render() {
        const filteredSongs = this.getFilteredSongs();
        
        if (filteredSongs.length === 0) {
            this.songsTable.style.display = 'none';
            this.emptyState.style.display = 'block';
            return;
        }

        this.songsTable.style.display = 'table';
        this.emptyState.style.display = 'none';

        this.songsList.innerHTML = filteredSongs.map(song => this.createSongHTML(song)).join('');
        
        // Bind events for each song
        this.bindSongEvents();
    }

    createSongHTML(song) {
        const capoBadge = song.capoPosition === 0 ? 'No Capo' : `<span class="capo-badge">${song.capoPosition}</span>`;
        const spotifyIndicator = song.spotifyUrl ? '<span class="material-icons spotify-indicator">music_note</span>' : '';
        
        return `
            <tr class="song-row" data-id="${song.id}">
                <td class="song-cell">
                    <div class="song-title">${this.escapeHtml(song.title)}</div>
                    ${song.notes ? `
                        <div class="notes-text" data-notes="${this.escapeHtml(song.notes)}" title="${this.escapeHtml(song.notes)}">
                            <span class="material-icons">sticky_note_2</span>
                            ${this.escapeHtml(song.notes.length > 30 ? song.notes.substring(0, 30) + '...' : song.notes)}
                        </div>
                    ` : ''}
                </td>
                <td class="artist-cell">${this.escapeHtml(song.artist)}</td>
                <td class="chords-cell">
                    ${song.chords.length > 0 ? `
                        <div class="chords-list">
                            ${song.chords.map(chord => `<span class="chord-badge">${this.escapeHtml(chord)}</span>`).join('')}
                        </div>
                    ` : '-'}
                </td>
                <td class="capo-cell">${capoBadge}</td>
                <td class="spotify-cell">${spotifyIndicator}</td>
                <td class="actions-cell">
                    <div class="song-actions">
                        ${song.spotifyUrl ? `
                            <button class="action-btn play-btn" title="Play on Spotify">
                                <span class="material-icons">play_arrow</span>
                            </button>
                        ` : ''}
                        <button class="action-btn edit-btn" title="Edit Song">
                            <span class="material-icons">edit</span>
                        </button>
                        <button class="action-btn delete-btn" title="Delete Song">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    bindSongEvents() {
        // Play button events
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const songId = e.target.closest('.song-row').dataset.id;
                const song = this.songs.find(song => song.id === songId);
                this.playSpotify(song);
            });
        });

        // Edit button events
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const songId = e.target.closest('.song-row').dataset.id;
                this.editSong(songId);
            });
        });

        // Delete button events
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const songId = e.target.closest('.song-row').dataset.id;
                this.deleteSong(songId);
            });
        });
    }

    updateStats() {
        const total = this.songs.length;
        const filtered = this.getFilteredSongs().length;
        
        let countText = '';
        if (this.currentFilter.chord || this.currentFilter.capo || this.currentFilter.search) {
            countText = `${filtered} of ${total} songs`;
        } else {
            countText = `${total} song${total !== 1 ? 's' : ''}`;
        }
        
        this.songCount.textContent = countText;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveSongs() {
        localStorage.setItem('guitarSongs', JSON.stringify(this.songs));
    }

    // Spotify Methods
    async initializeSpotify() {
        // Try to get a Spotify access token using the public Client ID
        await this.getPublicSpotifyToken();
    }

    async getPublicSpotifyToken() {
        try {
            // Use a public CORS proxy to get a token (works without backend!)
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: this.spotifyClientId,
                    client_secret: '59ca8582f8c2434494e1f41efee70166' // You'll need to add this
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.spotifyAccessToken = data.access_token;
                console.log('✅ Spotify connected! Search for any song now.');
                this.showNotification('Spotify connected! You can now search millions of songs.', 'success');
            } else {
                console.log('ℹ️ Using demo mode - add your Client Secret for full access');
            }
        } catch (error) {
            console.log('ℹ️ Using demo mode with 10 sample songs');
        }
    }

    async searchSpotify() {
        const query = this.spotifySearch.value.trim();
        if (!query) {
            this.showNotification('Please enter a search term', 'error');
            return;
        }

        this.showSearchLoading();
        
        // If we have a valid access token, use the real Spotify API
        if (this.spotifyAccessToken) {
            try {
                const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
                    headers: {
                        'Authorization': `Bearer ${this.spotifyAccessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.tracks && data.tracks.items) {
                        this.displaySearchResults(data.tracks.items);
                        return;
                    }
                }
            } catch (error) {
                console.log('Spotify API error:', error);
            }
        }
        
        // Fallback to demo data if API fails or not configured
        console.log('Using demo data for search:', query);
        this.displayDemoSearchResults(query);
    }

    displayDemoSearchResults(query) {
        // Expanded demo data for demonstration purposes
        const demoResults = [
            {
                id: 'demo1',
                name: 'Wonderwall',
                artists: [{ name: 'Oasis' }],
                album: { name: '(What\'s the Story) Morning Glory?', images: [{ url: 'https://via.placeholder.com/50' }] },
                external_urls: { spotify: 'https://open.spotify.com/track/2CT3r93YuSHtm57mjxvjhH' }
            },
            {
                id: 'demo2',
                name: 'Hotel California',
                artists: [{ name: 'Eagles' }],
                album: { name: 'Hotel California', images: [{ url: 'https://via.placeholder.com/50' }] },
                external_urls: { spotify: 'https://open.spotify.com/track/40riOy7x9W7GXGyjoSdS8j' }
            },
            {
                id: 'demo3',
                name: 'Black',
                artists: [{ name: 'Pearl Jam' }],
                album: { name: 'Ten', images: [{ url: 'https://via.placeholder.com/50' }] },
                external_urls: { spotify: 'https://open.spotify.com/track/5Xak5fmy089t0FYmh3VJiY' }
            },
            {
                id: 'demo4',
                name: 'Sweet Child O\' Mine',
                artists: [{ name: 'Guns N\' Roses' }],
                album: { name: 'Appetite for Destruction', images: [{ url: 'https://via.placeholder.com/50' }] },
                external_urls: { spotify: 'https://open.spotify.com/track/7snQQk1zcKl8gZ92AnueZW' }
            },
            {
                id: 'demo5',
                name: 'Stairway to Heaven',
                artists: [{ name: 'Led Zeppelin' }],
                album: { name: 'Led Zeppelin IV', images: [{ url: 'https://via.placeholder.com/50' }] },
                external_urls: { spotify: 'https://open.spotify.com/track/5CQ30WqJwcep0pYcV4AMNc' }
            },
            {
                id: 'demo6',
                name: 'Free Bird',
                artists: [{ name: 'Lynyrd Skynyrd' }],
                album: { name: '(Pronounced \'Lĕh-\'nérd \'Skin-\'nérd)', images: [{ url: 'https://via.placeholder.com/50' }] },
                external_urls: { spotify: 'https://open.spotify.com/track/5qTZ38X8xqW5HQ33Lq5PzR' }
            },
            {
                id: 'demo7',
                name: 'Tears in Heaven',
                artists: [{ name: 'Eric Clapton' }],
                album: { name: 'Unplugged', images: [{ url: 'https://via.placeholder.com/50' }] },
                external_urls: { spotify: 'https://open.spotify.com/track/1kgwJ2y7p6V7Kk9FIF4YV5' }
            },
            {
                id: 'demo8',
                name: 'Wish You Were Here',
                artists: [{ name: 'Pink Floyd' }],
                album: { name: 'Wish You Were Here', images: [{ url: 'https://via.placeholder.com/50' }] },
                external_urls: { spotify: 'https://open.spotify.com/track/6mFkJmJqdDVQ1REhVfGgd1' }
            },
            {
                id: 'demo9',
                name: 'Yesterday',
                artists: [{ name: 'The Beatles' }],
                album: { name: 'Yesterday and Today', images: [{ url: 'https://via.placeholder.com/50' }] },
                external_urls: { spotify: 'https://open.spotify.com/track/3BQHpFgAp4l80e1XslIjNI' }
            },
            {
                id: 'demo10',
                name: 'Hallelujah',
                artists: [{ name: 'Jeff Buckley' }],
                album: { name: 'Grace', images: [{ url: 'https://via.placeholder.com/50' }] },
                external_urls: { spotify: 'https://open.spotify.com/track/3pRaLNL3b8x5uBOcsgvdqM' }
            }
        ];

        // Filter results based on query
        const filteredResults = demoResults.filter(song => {
            const songName = song.name.toLowerCase();
            const artistName = song.artists[0].name.toLowerCase();
            const albumName = song.album.name.toLowerCase();
            const searchTerm = query.toLowerCase();
            
            return songName.includes(searchTerm) || 
                   artistName.includes(searchTerm) || 
                   albumName.includes(searchTerm);
        });

        // If no exact matches, show a generic result for any search
        if (filteredResults.length === 0) {
            const genericResult = {
                id: `generic_${Date.now()}`,
                name: query,
                artists: [{ name: 'Unknown Artist' }],
                album: { name: 'Unknown Album', images: [{ url: 'https://via.placeholder.com/50' }] },
                external_urls: { spotify: 'https://open.spotify.com/search/' + encodeURIComponent(query) }
            };
            this.displaySearchResults([genericResult]);
        } else {
            this.displaySearchResults(filteredResults);
        }
    }

    showSearchLoading() {
        this.searchResults.innerHTML = `
            <div class="search-loading">
                <span class="material-icons">refresh</span>
                Searching Spotify...
            </div>
        `;
    }

    displaySearchResults(tracks) {
        if (!tracks || tracks.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-error">
                    <span class="material-icons">warning</span>
                    No songs found. Try a different search term.
                </div>
            `;
            return;
        }

        this.searchResults.innerHTML = tracks.map(track => `
            <div class="search-result-item" data-track-id="${track.id}">
                <img src="${track.album.images[0]?.url || 'https://via.placeholder.com/50'}" alt="Album cover">
                <div class="search-result-info">
                    <div class="search-result-title">${this.escapeHtml(track.name)}</div>
                    <div class="search-result-artist">${this.escapeHtml(track.artists.map(artist => artist.name).join(', '))}</div>
                    <div class="search-result-album">${this.escapeHtml(track.album.name)}</div>
                </div>
                <div class="search-result-actions">
                    <button class="select-song-btn" data-track='${JSON.stringify(track)}'>
                        <span class="material-icons">add</span>
                        Select
                    </button>
                </div>
            </div>
        `).join('');

        // Bind select events
        document.querySelectorAll('.select-song-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const track = JSON.parse(e.target.dataset.track);
                this.selectSpotifyTrack(track);
            });
        });
    }

    selectSpotifyTrack(track) {
        // Auto-populate form with Spotify data
        this.songTitle.value = track.name;
        this.artist.value = track.artists.map(artist => artist.name).join(', ');
        this.spotifyUrl.value = track.external_urls.spotify;
        
        // Clear search results
        this.searchResults.innerHTML = '';
        this.spotifySearch.value = '';
        
        // Focus on chords field
        this.chords.focus();
        
        this.showNotification('Song data populated! Now add your guitar chords and capo position.', 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="material-icons">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .spotify-player-container {
        text-align: center;
    }
    
    .spotify-player-container h4 {
        color: #2a5298;
        margin-bottom: 20px;
        font-size: 1.3rem;
    }
    
    .spotify-embed {
        margin-bottom: 20px;
        border-radius: 12px;
        overflow: hidden;
    }
    
    .spotify-actions {
        margin-top: 15px;
    }
    
    .spotify-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #1db954;
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .spotify-link:hover {
        background: #1ed760;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3);
    }
`;
document.head.appendChild(notificationStyles);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GuitarSongbook();
});
