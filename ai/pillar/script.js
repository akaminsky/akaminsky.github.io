class PillarApp {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.currentPage = 'landing';
        this.currentTab = 'ai-triage';
        this.currentNetworkTab = 'friends';
        this.currentBookingStep = 1;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        
        // Data storage
        this.assessments = [];
        this.friends = [];
        this.contractors = [];
        this.forumTopics = [];
        this.posts = [];
        this.points = 0;
        this.pointsHistory = [];
        this.chatMessages = [];
        this.selectedDate = null;
        this.selectedTime = null;
        this.currentFilter = 'all';
        this.currentCategory = 'all';
        
        // OpenAI API Key - Only needed for local development
        // In production, the Netlify function handles the API key securely
        this.openaiApiKey = ''; // Add your key here ONLY for local testing - DO NOT commit with real key!
        
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupRouting();
        this.setupEventListeners();
        this.updateNavigation();
        this.showPage(this.currentPage);
    }

    setupRouting() {
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || (this.isLoggedIn ? 'dashboard' : 'landing');
            this.showPage(page);
        });

        // Initial page load
        const path = window.location.pathname;
        let page = this.isLoggedIn ? 'dashboard' : 'landing';
        
        if (path.includes('/dashboard')) page = 'dashboard';
        else if (path.includes('/assessments')) page = 'assessments';
        else if (path.includes('/forum')) page = 'forum';
        else if (path.includes('/network')) page = 'network';
        else if (path.includes('/points')) page = 'points';
        else if (path.includes('/profile')) page = 'profile';
        else if (path.includes('/settings')) page = 'settings';
        else if (path.includes('/triage')) page = 'triage';
        
        this.showPage(page);
    }

    navigateTo(page) {
        this.showPage(page);
        window.history.pushState({ page }, '', `/${page}`);
    }

    showPage(page) {
        console.log('Navigating to page:', page);
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
        
        // Show target page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.style.display = 'block';
            this.currentPage = page;
            this.handlePageLoad(page);
        } else {
            console.error('Page not found:', `${page}-page`);
        }
    }

    handlePageLoad(page) {
        switch (page) {
            case 'dashboard':
                this.setupDashboardPage();
                break;
            case 'assessments':
                this.setupAssessmentsPage();
                break;
            case 'forum':
                this.setupForumPage();
                break;
            case 'network':
                this.setupNetworkPage();
                break;
            case 'points':
                this.setupPointsPage();
                break;
            case 'profile':
                this.setupProfilePage();
                break;
            case 'settings':
                this.setupSettingsPage();
                break;
            case 'triage':
                this.setupTriagePage();
                break;
            case 'issue-details':
                this.displayIssueDetails();
                break;
        }
    }

    setupEventListeners() {
        // Navigation event delegation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[onclick*="navigateTo"]')) {
                e.preventDefault();
            }
        });

        // Modal close on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }

    updateNavigation() {
        const loggedOutNav = document.querySelector('.nav-logged-out');
        const loggedInNav = document.querySelector('.nav-logged-in');
        const brandLink = document.getElementById('brand-link');
        
        if (this.isLoggedIn) {
            loggedOutNav.style.display = 'none';
            loggedInNav.style.display = 'flex';
            document.getElementById('user-name').textContent = this.currentUser.name;
            if (brandLink) {
                brandLink.setAttribute('onclick', "navigateTo('dashboard')");
            }
        } else {
            loggedOutNav.style.display = 'flex';
            loggedInNav.style.display = 'none';
            if (brandLink) {
                brandLink.setAttribute('onclick', "navigateTo('landing')");
            }
        }
    }

    // Authentication
    login(email, password) {
        // Mock authentication
        this.isLoggedIn = true;
        this.currentUser = {
            id: 1,
            name: 'John Doe',
            email: email,
            joinDate: new Date().toISOString()
        };
        this.updateNavigation();
        this.saveToStorage();
        this.navigateTo('dashboard');
        this.closeModal('login-modal');
    }

    signup(name, email, password) {
        // Mock authentication
        this.isLoggedIn = true;
        this.currentUser = {
            id: 1,
            name: name,
            email: email,
            joinDate: new Date().toISOString()
        };
        this.updateNavigation();
        this.saveToStorage();
        this.navigateTo('dashboard');
        this.closeModal('signup-modal');
    }

    logout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.updateNavigation();
        this.saveToStorage();
        this.navigateTo('landing');
    }

    // Page Setup Methods
    setupDashboardPage() {
        if (!this.isLoggedIn) {
            this.showLoginPrompt();
            return;
        }
        this.displayDashboard();
    }

    setupAssessmentsPage() {
        if (!this.isLoggedIn) {
            this.showLoginPrompt();
            return;
        }
        this.displayAssessments();
    }

    setupForumPage() {
        if (!this.isLoggedIn) {
            this.showLoginPrompt();
            return;
        }
        this.displayForumTopics();
    }

    setupNetworkPage() {
        if (!this.isLoggedIn) {
            this.showLoginPrompt();
            return;
        }
        this.displayNetwork();
    }

    setupPointsPage() {
        if (!this.isLoggedIn) {
            this.showLoginPrompt();
            return;
        }
        this.displayPoints();
    }

    setupProfilePage() {
        if (!this.isLoggedIn) {
            this.showLoginPrompt();
            return;
        }
        this.displayProfile();
    }

    setupSettingsPage() {
        if (!this.isLoggedIn) {
            this.showLoginPrompt();
            return;
        }
        this.displaySettings();
    }

    setupTriagePage() {
        this.displayTriagePage();
    }

    showLoginPrompt() {
        if (confirm('Please log in to access this feature. Would you like to log in now?')) {
            this.showModal('login-modal');
        } else {
            this.navigateTo('landing');
        }
    }

    // Display Methods
    displayDashboard() {
        this.displayActiveAssessments();
        this.displayPostsFeed();
    }

    displayRecentAssessments() {
        const container = document.getElementById('recent-assessments');
        if (!container) return;

        if (this.assessments.length === 0) {
            container.innerHTML = '<p class="no-data">No assessments yet. <a href="#" onclick="navigateTo(\'triage\')">Create your first assessment</a></p>';
            return;
        }

        const recentAssessments = this.assessments.slice(0, 3);
        container.innerHTML = recentAssessments.map(assessment => `
            <div class="assessment-card">
                <h4>${assessment.title}</h4>
                <p class="assessment-status">Status: ${assessment.status}</p>
                <p class="assessment-date">${new Date(assessment.date).toLocaleDateString()}</p>
            </div>
        `).join('');
    }

    displayPointsBalance() {
        const balanceElement = document.getElementById('points-balance');
        const progressElement = document.getElementById('points-progress');
        
        if (balanceElement) {
            balanceElement.textContent = this.points;
        }
        
        if (progressElement) {
            const progress = (this.points % 10) / 10 * 100;
            progressElement.style.width = `${progress}%`;
        }
    }

    displayCommunityActivity() {
        const container = document.getElementById('community-activity');
        if (!container) return;

        container.innerHTML = '<p class="no-data">No community activity yet.</p>';
    }

    displayActiveAssessments() {
        const container = document.getElementById('active-assessments');
        if (!container) return;

        const activeAssessments = this.assessments.filter(a => a.status === 'active' || a.status === 'in-progress');
        
        if (activeAssessments.length === 0) {
            container.innerHTML = '<p class="no-data">No active assessments. <a href="#" onclick="navigateTo(\'triage\')">Create your first assessment</a></p>';
            return;
        }

        container.innerHTML = activeAssessments.map(assessment => {
            const hasUpdates = this.hasAssessmentUpdates(assessment);
            const unreadResponses = this.getUnreadResponsesCount(assessment);
            
            return `
                <div class="assessment-card ${hasUpdates ? 'has-updates' : ''}" onclick="navigateTo('issue-details', ${assessment.id})">
                    <div class="card-header">
                        <div class="card-title">${assessment.title}</div>
                        <div class="card-status ${assessment.status}">${assessment.status.replace('-', ' ')}</div>
                    </div>
                    <div class="card-notifications">
                        ${this.getCommunityNotifications(assessment) > 0 ? `<span class="notification-icon community" title="${this.getCommunityNotifications(assessment)} community messages">👥</span>` : ''}
                        ${this.getExpertNotifications(assessment) > 0 ? `<span class="notification-icon expert" title="${this.getExpertNotifications(assessment)} expert messages">👨‍🔧</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    hasAssessmentUpdates(assessment) {
        // Check if assessment has new responses, comments, or status changes
        const lastViewed = localStorage.getItem(`assessment-${assessment.id}-last-viewed`);
        if (!lastViewed) return true;
        
        const lastViewedDate = new Date(lastViewed);
        const assessmentDate = new Date(assessment.date);
        
        return assessmentDate > lastViewedDate;
    }

    getUnreadResponsesCount(assessment) {
        // Mock function - in real app, this would count unread responses
        return Math.floor(Math.random() * 5);
    }

    getCommunityNotifications(assessment) {
        // Mock function - returns number of unread community messages
        return Math.floor(Math.random() * 3);
    }

    getExpertNotifications(assessment) {
        // Mock function - returns number of unread expert messages
        return Math.floor(Math.random() * 2);
    }

    displayAssessments() {
        const container = document.getElementById('assessments-list');
        if (!container) return;

        if (this.assessments.length === 0) {
            container.innerHTML = '<p class="no-data">No assessments yet. <a href="#" onclick="navigateTo(\'triage\')">Create your first assessment</a></p>';
            return;
        }

        container.innerHTML = this.assessments.map(assessment => `
            <div class="assessment-item" onclick="navigateTo('issue-details', ${assessment.id})">
                <div class="card-header">
                    <div class="card-title">${assessment.title}</div>
                    <div class="card-status ${assessment.status}">${assessment.status.replace('-', ' ')}</div>
                </div>
                <div class="card-notifications">
                    ${this.getCommunityNotifications(assessment) > 0 ? `<span class="notification-icon community" title="${this.getCommunityNotifications(assessment)} community messages">👥</span>` : ''}
                    ${this.getExpertNotifications(assessment) > 0 ? `<span class="notification-icon expert" title="${this.getExpertNotifications(assessment)} expert messages">👨‍🔧</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    displayForumTopics() {
        this.displayPostsFeed();
    }

    displayPostsFeed() {
        const container = document.getElementById('posts-feed');
        if (!container) return;

        console.log('Posts array length:', this.posts.length);
        console.log('Posts:', this.posts);

        if (this.posts.length === 0) {
            container.innerHTML = `
                <div class="welcome-post">
                    <div class="post-card">
                        <div class="post-header">
                            <div class="post-avatar">🏠</div>
                            <div class="post-info">
                                <div class="post-author">Pillar Community</div>
                                <div class="post-time">Welcome!</div>
                            </div>
                        </div>
                        <div class="post-content">
                            <h3>Welcome to the Community Feed!</h3>
                            <p>Share your home repair experiences, ask questions, and help others in the community. This is your space to connect with fellow homeowners and get expert advice.</p>
                        </div>
                        <div class="post-actions">
                            <button class="action-btn" onclick="showNewTopicModal()">
                                <span class="action-icon">📝</span>
                                <span>Create Your First Post</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        const filteredPosts = this.getFilteredPosts();
        container.innerHTML = filteredPosts.map(post => this.renderPost(post)).join('');
    }

    getFilteredPosts() {
        let filtered = this.posts;

        // Filter by category
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(post => post.category === this.currentCategory);
        }

        // Filter by type
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(post => post.type === this.currentFilter);
        }

        // Sort by date (newest first)
        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    renderPost(post) {
        const timeAgo = this.getTimeAgo(new Date(post.date));
        const isLiked = post.isLiked || false;
        const isBookmarked = post.isBookmarked || false;

        return `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-avatar">${post.author.charAt(0)}</div>
                    <div class="post-info">
                        <div class="post-author">${post.author}</div>
                        <div class="post-meta">
                            <span class="post-time">${timeAgo}</span>
                            <span class="post-category">${post.category}</span>
                        </div>
                    </div>
                    <div class="post-menu">
                        <button class="menu-btn" onclick="togglePostMenu(${post.id})">⋯</button>
                    </div>
                </div>

                <div class="post-content">
                    <h3 class="post-title">${post.title}</h3>
                    <div class="post-description">${post.content}</div>
                    ${post.images ? this.renderPostImages(post.images) : ''}
                </div>

                <div class="post-stats">
                    <div class="reactions-summary">
                        ${this.renderReactionsSummary(post.reactions)}
                    </div>
                    <div class="comments-count">
                        ${post.comments ? post.comments.length : 0} comments
                    </div>
                </div>

                <div class="post-actions">
                    <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                        <span class="action-icon">${isLiked ? '❤️' : '🤍'}</span>
                        <span>Like</span>
                        ${post.likes > 0 ? `<span class="count">${post.likes}</span>` : ''}
                    </button>
                    <button class="action-btn" onclick="toggleComments(${post.id})">
                        <span class="action-icon">💬</span>
                        <span>Comment</span>
                    </button>
                    <button class="action-btn" onclick="sharePost(${post.id})">
                        <span class="action-icon">📤</span>
                        <span>Share</span>
                    </button>
                    <button class="action-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark(${post.id})">
                        <span class="action-icon">${isBookmarked ? '🔖' : '📌'}</span>
                        <span>Save</span>
                    </button>
                </div>

                <div class="comments-section" id="comments-${post.id}" style="display: none;">
                    <div class="comments-list">
                        ${post.comments ? post.comments.map(comment => this.renderComment(comment)).join('') : ''}
                    </div>
                    <div class="comment-input">
                        <div class="comment-avatar">👤</div>
                        <input type="text" placeholder="Write a comment..." onkeypress="handleCommentKeypress(event, ${post.id})">
                        <button class="btn btn-primary btn-sm" onclick="addComment(${post.id})">Post</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderPostImages(images) {
        if (!images || images.length === 0) return '';
        
        if (images.length === 1) {
            return `<div class="post-image-single"><img src="${images[0]}" alt="Post image"></div>`;
        } else {
            return `
                <div class="post-images-grid">
                    ${images.slice(0, 4).map((img, index) => `
                        <div class="post-image ${index === 3 && images.length > 4 ? 'more-images' : ''}" onclick="openImageModal('${img}')">
                            <img src="${img}" alt="Post image">
                            ${index === 3 && images.length > 4 ? `<div class="more-count">+${images.length - 4}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    renderReactionsSummary(reactions) {
        if (!reactions || Object.keys(reactions).length === 0) return '';
        
        const total = Object.values(reactions).reduce((sum, count) => sum + count, 0);
        const topReactions = Object.entries(reactions)
            .filter(([_, count]) => count > 0)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);

        return `
            <div class="reactions-display">
                ${topReactions.map(([emoji, count]) => `
                    <span class="reaction-item">${emoji} ${count}</span>
                `).join('')}
                ${total > 0 ? `<span class="total-reactions">${total}</span>` : ''}
            </div>
        `;
    }

    renderComment(comment) {
        const timeAgo = this.getTimeAgo(new Date(comment.date));
        return `
            <div class="comment">
                <div class="comment-avatar">${comment.author.charAt(0)}</div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-time">${timeAgo}</span>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                    <div class="comment-actions">
                        <button class="comment-action" onclick="likeComment(${comment.id})">
                            <span class="action-icon">🤍</span>
                            <span>Like</span>
                        </button>
                        <button class="comment-action" onclick="replyToComment(${comment.id})">
                            <span class="action-icon">↩️</span>
                            <span>Reply</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString();
    }

    displayNetwork() {
        this.displayFriends();
        this.displayContractors();
    }

    displayFriends() {
        const container = document.getElementById('friends-list');
        if (!container) return;

        if (this.friends.length === 0) {
            container.innerHTML = '<p class="no-data">No friends yet. <a href="#" onclick="showAddFriendModal()">Add your first friend</a></p>';
            return;
        }

        container.innerHTML = this.friends.map(friend => `
            <div class="friend-item">
                <div class="friend-avatar">${friend.name.charAt(0)}</div>
                <div class="friend-info">
                    <h4>${friend.name}</h4>
                    <p>${friend.email}</p>
                </div>
                <div class="friend-actions">
                    <button class="btn btn-secondary btn-sm" onclick="removeFriend(${friend.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }

    displayContractors() {
        const container = document.getElementById('contractors-list');
        if (!container) return;

        if (this.contractors.length === 0) {
            container.innerHTML = '<p class="no-data">No contractors yet. <a href="#" onclick="showAddContractorModal()">Add your first contractor</a></p>';
            return;
        }

        container.innerHTML = this.contractors.map(contractor => `
            <div class="contractor-item">
                <div class="contractor-info">
                    <h4>${contractor.name}</h4>
                    <p>${contractor.type} • ${contractor.contact}</p>
                    <p class="contractor-notes">${contractor.notes}</p>
                </div>
                <div class="contractor-actions">
                    <button class="btn btn-secondary btn-sm" onclick="removeContractor(${contractor.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }

    displayPoints() {
        const balanceElement = document.getElementById('points-balance-large');
        const progressElement = document.getElementById('points-progress-large');
        
        if (balanceElement) {
            balanceElement.textContent = this.points;
        }
        
        if (progressElement) {
            const progress = (this.points % 10) / 10 * 100;
            progressElement.style.width = `${progress}%`;
        }

        this.displayPointsHistory();
    }

    displayPointsHistory() {
        const container = document.getElementById('points-history-list');
        if (!container) return;

        if (this.pointsHistory.length === 0) {
            container.innerHTML = '<p class="no-data">No points earned yet.</p>';
            return;
        }

        container.innerHTML = this.pointsHistory.map(entry => `
            <div class="points-entry">
                <div class="points-entry-info">
                    <h4>${entry.description}</h4>
                    <p>${new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <div class="points-entry-amount ${entry.amount > 0 ? 'positive' : 'negative'}">
                    ${entry.amount > 0 ? '+' : ''}${entry.amount}
                </div>
            </div>
        `).join('');
    }

    displayProfile() {
        if (!this.currentUser) return;

        document.getElementById('profile-name').textContent = this.currentUser.name;
        document.getElementById('profile-email').textContent = this.currentUser.email;
        document.getElementById('member-since').textContent = new Date(this.currentUser.joinDate).toLocaleDateString();
        
        document.getElementById('stat-assessments').textContent = this.assessments.length;
        document.getElementById('stat-points').textContent = this.points;
        document.getElementById('stat-friends').textContent = this.friends.length;
    }

    displaySettings() {
        if (!this.currentUser) return;

        document.getElementById('settings-email').value = this.currentUser.email;
        // Load other settings from user data
    }

    displayIssueDetails() {
        const container = document.getElementById('issue-details-content');
        if (!container) return;

        // Get assessment ID from URL or current assessment
        const assessmentId = this.currentAssessmentId || 1;
        const assessment = this.assessments.find(a => a.id == assessmentId);
        
        if (!assessment) {
            container.innerHTML = '<p class="no-data">Assessment not found.</p>';
            return;
        }

        // Update page title and status
        document.getElementById('assessment-title').textContent = assessment.title;
        document.getElementById('assessment-description').innerHTML = `<p>${assessment.description}</p>`;
        
        const statusElement = document.getElementById('assessment-status');
        statusElement.textContent = assessment.status;
        statusElement.className = `assessment-status-badge ${assessment.status}`;

        // Display timeline
        this.displayAssessmentTimeline(assessment);
        
        // Display media
        this.displayAssessmentMedia(assessment);
        
        // Display community responses
        this.displayCommunityResponses(assessment);
    }

    displayAssessmentTimeline(assessment) {
        const timelineContainer = document.getElementById('timeline-steps');
        if (!timelineContainer) return;

        const steps = [
            {
                title: 'Assessment Created',
                date: new Date(assessment.date),
                completed: true,
                description: 'Issue assessment was created'
            },
            {
                title: 'AI Triage',
                date: assessment.aiComplete ? new Date(assessment.date) : null,
                completed: assessment.aiComplete,
                description: assessment.aiComplete ? 'AI analysis completed' : 'AI analysis in progress'
            },
            {
                title: 'Community Feedback',
                date: assessment.communityActive ? new Date(assessment.date) : null,
                completed: assessment.communityActive,
                description: assessment.communityActive ? 'Community responses received' : 'Awaiting community input'
            },
            {
                title: 'Professional Consultation',
                date: assessment.professionalBooked ? new Date(assessment.date) : null,
                completed: assessment.professionalBooked,
                description: assessment.professionalBooked ? 'Professional consultation scheduled' : 'Professional consultation available'
            }
        ];

        timelineContainer.innerHTML = steps.map(step => `
            <div class="timeline-step ${step.completed ? 'completed' : 'pending'}">
                <div class="step-icon">
                    ${step.completed ? '✓' : '○'}
                </div>
                <div class="step-content">
                    <h5>${step.title}</h5>
                    <p>${step.description}</p>
                    ${step.date ? `<span class="step-date">${step.date.toLocaleDateString()}</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    displayAssessmentMedia(assessment) {
        const mediaContainer = document.getElementById('assessment-media');
        if (!mediaContainer) return;

        // Mock media data
        const mediaItems = [
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
                title: 'Issue Photo 1',
                date: new Date(assessment.date)
            },
            {
                type: 'image', 
                url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
                title: 'Issue Photo 2',
                date: new Date(assessment.date)
            }
        ];

        const mediaGrid = mediaContainer.querySelector('.media-grid');
        if (mediaGrid) {
            mediaGrid.innerHTML = mediaItems.map(item => `
                <div class="media-item">
                    <img src="${item.url}" alt="${item.title}" onclick="openImageModal('${item.url}')">
                    <div class="media-info">
                        <h5>${item.title}</h5>
                        <span class="media-date">${item.date.toLocaleDateString()}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    displayCommunityResponses(assessment) {
        const responsesContainer = document.getElementById('community-responses');
        if (!responsesContainer) return;

        // Mock community responses
        const responses = [
            {
                author: 'Mike Chen',
                text: 'I had the same issue last year. The problem was usually the O-ring or cartridge. Try replacing those first before calling a plumber.',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                helpful: true,
                type: 'friend'
            },
            {
                author: 'Sarah Johnson',
                text: 'Check if the faucet has a warranty. Many manufacturers offer free replacement parts.',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                helpful: false,
                type: 'friend'
            },
            {
                author: 'Tom Wilson',
                text: 'I\'m a licensed plumber. Based on your description, it sounds like a worn cartridge. This is a common issue with older faucets.',
                date: new Date(Date.now() - 12 * 60 * 60 * 1000),
                helpful: true,
                type: 'expert'
            }
        ];

        const responsesList = responsesContainer.querySelector('.responses-list');
        if (responsesList) {
            responsesList.innerHTML = responses.map(response => `
                <div class="response-item">
                    <div class="response-header">
                        <div class="response-author">
                            <span class="author-name">${response.author}</span>
                            <span class="author-badge ${response.type}">${response.type === 'expert' ? 'Expert' : 'Friend'}</span>
                        </div>
                        <span class="response-date">${this.getTimeAgo(response.date)}</span>
                    </div>
                    <div class="response-content">
                        <p>${response.text}</p>
                        <div class="response-actions">
                            <button class="helpful-btn ${response.helpful ? 'helpful' : ''}" onclick="toggleHelpful(${response.id})">
                                ${response.helpful ? '✓ Helpful' : 'Mark Helpful'}
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    displayTriagePage() {
        // Initialize chat if on AI triage tab
        if (this.currentTab === 'ai-triage') {
            this.initializeChat();
        }
    }

    // AI Chat Interface
    initializeChat() {
        // Get user context for personalized AI
        const userContext = this.getUserContext();
        
        // Check if we need to collect user context
        if (!this.isLoggedIn && !this.hasUserContext()) {
            this.chatMessages = [
                {
                    type: 'ai',
                       content: `Hi! I'm your AI home project assistant. To give you the most personalized guidance, I'd like to learn a bit about your home and your experience level.

**Quick questions to help me tailor my recommendations:**

1. **What type of home do you live in?**
   • Single-family house
   • Apartment/Condo
   • Townhouse
   • Mobile home
   • Other

2. **How would you describe your handiness level?**
   • Beginner (I prefer to hire professionals)
   • Some experience (I can handle basic projects)
   • Confident DIYer (I enjoy tackling most projects)
   • Expert (I can handle complex renovations)

3. **How old is your home?**
   • New construction (0-5 years)
   • Recent (6-15 years)
   • Established (16-30 years)
   • Older (30+ years)

Please answer these questions, and then tell me about your home project!`,
                    timestamp: new Date()
                }
            ];
        } else {
            this.chatMessages = [
                {
                    type: 'ai',
                    content: `Hi! I'm your AI home project assistant. I'm here to help guide you through your project and provide personalized recommendations.

**To give you the best help, please tell me:**
• What exactly are you working on? (be as specific as possible)
• What's your goal with this project?
• Have you started anything yet?
• Are there any challenges or concerns?
• Which room/area is involved?

Take your time describing your project - the more details you provide, the better I can help!`,
                    timestamp: new Date()
                }
            ];
        }
        this.renderChatMessages();
    }

    hasUserContext() {
        // Check if we have user context stored locally
        const context = localStorage.getItem('pillar-user-context');
        return context !== null;
    }

    getUserContext() {
        if (this.isLoggedIn && this.currentUser) {
            return {
                homeType: this.currentUser.homeType || 'home',
                handinessLevel: this.currentUser.handinessLevel || 'some experience',
                homeAge: this.currentUser.homeAge || 'unknown',
                squareFootage: this.currentUser.squareFootage || 'unknown'
            };
        }
        
        // For logged-out users, get from local storage
        const context = localStorage.getItem('pillar-user-context');
        if (context) {
            return JSON.parse(context);
        }
        
        return null;
    }

    parseUserContext(message) {
        const context = {};
        
        // Parse home type
        if (message.toLowerCase().includes('single-family') || message.toLowerCase().includes('house')) {
            context.homeType = 'Single-family house';
        } else if (message.toLowerCase().includes('apartment') || message.toLowerCase().includes('condo')) {
            context.homeType = 'Apartment/Condo';
        } else if (message.toLowerCase().includes('townhouse')) {
            context.homeType = 'Townhouse';
        } else if (message.toLowerCase().includes('mobile')) {
            context.homeType = 'Mobile home';
        }
        
        // Parse handiness level
        if (message.toLowerCase().includes('beginner') || message.toLowerCase().includes('hire professionals')) {
            context.handinessLevel = 'Beginner';
        } else if (message.toLowerCase().includes('some experience') || message.toLowerCase().includes('basic repairs')) {
            context.handinessLevel = 'Some experience';
        } else if (message.toLowerCase().includes('confident') || message.toLowerCase().includes('most projects')) {
            context.handinessLevel = 'Confident DIYer';
        } else if (message.toLowerCase().includes('expert') || message.toLowerCase().includes('complex renovations')) {
            context.handinessLevel = 'Expert';
        }
        
        // Parse home age
        if (message.toLowerCase().includes('new construction') || message.toLowerCase().includes('0-5 years')) {
            context.homeAge = 'New construction (0-5 years)';
        } else if (message.toLowerCase().includes('recent') || message.toLowerCase().includes('6-15 years')) {
            context.homeAge = 'Recent (6-15 years)';
        } else if (message.toLowerCase().includes('established') || message.toLowerCase().includes('16-30 years')) {
            context.homeAge = 'Established (16-30 years)';
        } else if (message.toLowerCase().includes('older') || message.toLowerCase().includes('30+ years')) {
            context.homeAge = 'Older (30+ years)';
        }
        
        return context;
    }

    saveUserContext(context) {
        localStorage.setItem('pillar-user-context', JSON.stringify(context));
    }

    async sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message
        this.chatMessages.push({
            type: 'user',
            content: message,
            timestamp: new Date()
        });

        input.value = '';
        this.renderChatMessages();

        // Check if this is context collection for logged-out users
        if (!this.isLoggedIn && !this.hasUserContext()) {
            const context = this.parseUserContext(message);
            if (Object.keys(context).length > 0) {
                this.saveUserContext(context);
                
                   // Add AI response acknowledging context
                   this.chatMessages.push({
                       type: 'ai',
                       content: `Perfect! I've saved your home information. Now, please tell me about your home project:

**To give you the best help, please tell me:**
• What exactly are you working on? (be as specific as possible)
• What's your goal with this project?
• Have you started anything yet?
• Are there any challenges or concerns?
• Which room/area is involved?

Take your time describing your project - the more details you provide, the better I can help!`,
                       timestamp: new Date()
                   });
                this.renderChatMessages();
                return;
            }
        }

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Call OpenAI API
            const response = await this.callOpenAI(message);
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add AI response
            this.chatMessages.push({
                type: 'ai',
                content: response,
                timestamp: new Date()
            });

            this.renderChatMessages();
            
            // Check if this is the final AI response (triage complete)
            if (this.isTriageComplete()) {
                this.showAssessmentSummary();
            }
        } catch (error) {
            console.error('Error calling OpenAI:', error);
            this.hideTypingIndicator();
            
            // Add error message
            this.chatMessages.push({
                type: 'ai',
                content: 'I apologize, but I\'m having trouble processing your request right now. Please try again later.',
                timestamp: new Date()
            });

            this.renderChatMessages();
        }
    }

    isTriageComplete() {
        // Check if the last AI message contains the assessment completion marker
        const lastAIMessage = this.chatMessages.filter(msg => msg.type === 'ai').pop();
        if (!lastAIMessage) return false;
        
        const hasCompleteMarker = lastAIMessage.content.includes('PROJECT ASSESSMENT COMPLETE');
        const hasCompletionText = lastAIMessage.content.includes('I\'ve completed your project assessment');
        const hasShareText = lastAIMessage.content.includes('You can now share this with friends for advice or connect with a professional');
        
        return hasCompleteMarker || hasCompletionText || hasShareText;
    }

    showAssessmentSummary() {
        // Parse the last AI message to extract assessment details
        const lastAIMessage = this.chatMessages.filter(msg => msg.type === 'ai').pop();
        const assessment = this.parseAssessmentFromMessage(lastAIMessage.content);
        
        // Show the sidebar
        const sidebar = document.getElementById('assessment-sidebar');
        const assessmentContent = document.getElementById('assessment-content');
        
        if (sidebar && assessmentContent) {
            // Remove hidden class
            sidebar.classList.remove('hidden');
            console.log('Sidebar shown, classes:', sidebar.className);
            
            // Show close button on mobile
            const closeBtn = sidebar.querySelector('.close-sidebar-btn');
            if (window.innerWidth <= 768 && closeBtn) {
                closeBtn.style.display = 'block';
            }
            
            // Populate the assessment content
            console.log('Populating assessment content...');
            assessmentContent.innerHTML = `
                <div class="assessment-summary">
                    <div class="summary-section">
                        <h4>Project</h4>
                        <p>${assessment.project || 'Home project assessment'}</p>
                    </div>
                    
                    <div class="summary-section">
                        <h4>Diagnosis</h4>
                        <p>${assessment.diagnosis || 'Based on your description, this appears to be a home project that requires attention.'}</p>
                    </div>
                    
                    <div class="summary-section">
                        <h4>Complexity</h4>
                        <p><span class="complexity-badge ${assessment.complexity?.toLowerCase()}">${assessment.complexity || 'Medium'}</span></p>
                    </div>
                    
                    <div class="summary-section">
                        <h4>DIY Feasible</h4>
                        <p><span class="diy-badge ${assessment.diyFeasible?.toLowerCase()}">${assessment.diyFeasible || 'Partial'}</span></p>
                    </div>
                    
                    ${assessment.safetyConcerns ? `
                    <div class="summary-section">
                        <h4>Safety Concerns</h4>
                        <p>${assessment.safetyConcerns}</p>
                    </div>
                    ` : ''}
                    
                    <div class="summary-section">
                        <h4>Recommended Next Steps</h4>
                        <ul>
                            ${assessment.nextSteps ? assessment.nextSteps.map(step => `<li>${step}</li>`).join('') : '<li>Document the issue with photos/videos</li><li>Get multiple opinions before proceeding</li><li>Consider DIY vs professional approach</li>'}
                        </ul>
                    </div>
                    
                    ${assessment.specialistNeeded ? `
                    <div class="summary-section">
                        <h4>Specialist Needed</h4>
                        <p>${assessment.specialistNeeded}</p>
                    </div>
                    ` : ''}
                </div>
                
                <div class="assessment-actions">
                    <button class="btn btn-primary" onclick="requestCommunityHelp()">
                        👥 Ask My Friends
                    </button>
                    <button class="btn btn-secondary" onclick="requestExpertHelp()">
                        👨‍🔧 Find a Specialist
                    </button>
                    <button class="btn btn-outline" onclick="saveAssessment()">
                        💾 Save Assessment
                    </button>
                </div>
            `;
        }
    }

    parseAssessmentFromMessage(message) {
        const assessment = {};
        
        // Extract project title
        const projectMatch = message.match(/\*\*Project:\*\*\s*(.+)/);
        if (projectMatch) assessment.project = projectMatch[1].trim();
        
        // Extract diagnosis
        const diagnosisMatch = message.match(/\*\*Diagnosis:\*\*\s*(.+)/);
        if (diagnosisMatch) assessment.diagnosis = diagnosisMatch[1].trim();
        
        // Extract complexity
        const complexityMatch = message.match(/\*\*Complexity:\*\*\s*(.+)/);
        if (complexityMatch) assessment.complexity = complexityMatch[1].trim();
        
        // Extract DIY feasibility
        const diyMatch = message.match(/\*\*DIY Feasible:\*\*\s*(.+)/);
        if (diyMatch) assessment.diyFeasible = diyMatch[1].trim();
        
        // Extract safety concerns
        const safetyMatch = message.match(/\*\*Safety Concerns:\*\*\s*(.+)/);
        if (safetyMatch) assessment.safetyConcerns = safetyMatch[1].trim();
        
        // Extract next steps
        const nextStepsMatch = message.match(/\*\*Recommended Next Steps:\*\*([\s\S]*?)(?:\*\*|$)/);
        if (nextStepsMatch) {
            const stepsText = nextStepsMatch[1];
            assessment.nextSteps = stepsText.split('\n')
                .map(step => step.replace(/^\d+\.\s*/, '').trim())
                .filter(step => step.length > 0);
        }
        
        // Extract specialist needed
        const specialistMatch = message.match(/\*\*Specialist Needed:\*\*\s*(.+)/);
        if (specialistMatch) assessment.specialistNeeded = specialistMatch[1].trim();
        
        return assessment;
    }

    closeAssessmentSidebar() {
        const sidebar = document.getElementById('assessment-sidebar');
        if (sidebar) {
            sidebar.classList.add('hidden');
        }
    }

    // Ask Friends Modal Functions
    showAskFriendsModal() {
        const modal = document.getElementById('ask-friends-modal');
        const previewContent = document.getElementById('assessment-preview-content');
        
        if (modal && previewContent) {
            // Populate the assessment preview
            const assessment = this.parseAssessmentFromMessage(this.chatMessages.filter(msg => msg.type === 'ai').pop().content);
            
            previewContent.innerHTML = `
                <div class="assessment-summary">
                    <div class="assessment-header">
                        <h4>📋 ${assessment.project || 'Home Project Assessment'}</h4>
                        <div class="assessment-badges">
                            <span class="complexity-badge ${assessment.complexity?.toLowerCase()}">Complexity: ${assessment.complexity || 'Medium'}</span>
                            <span class="diy-badge ${assessment.diyFeasible?.toLowerCase()}">DIY: ${assessment.diyFeasible || 'Partial'}</span>
                            ${assessment.estimatedPrice ? `<span class="price-badge">${assessment.estimatedPrice}</span>` : ''}
                        </div>
                    </div>
                    <div class="assessment-content">
                        <p class="assessment-diagnosis">${assessment.diagnosis || 'Based on your description, this appears to be a home project that requires attention.'}</p>
                        ${assessment.safetyConcerns ? `<div class="safety-warning">⚠️ ${assessment.safetyConcerns}</div>` : ''}
                        ${assessment.nextSteps && assessment.nextSteps.length > 0 ? `
                        <div class="next-steps">
                            <strong>Next Steps:</strong>
                            <ul>
                                ${assessment.nextSteps.map(step => `<li>${step}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                        ${assessment.specialistNeeded ? `<div class="specialist-info">👨‍🔧 ${assessment.specialistNeeded}</div>` : ''}
                    </div>
                </div>
            `;
            
            modal.classList.add('show');
        }
    }

    closeAskFriendsModal() {
        const modal = document.getElementById('ask-friends-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    createCommunityPost() {
        const friendMessage = document.getElementById('friend-message').value;
        const assessment = this.parseAssessmentFromMessage(this.chatMessages.filter(msg => msg.type === 'ai').pop().content);
        
        // Create assessment summary for the post
        const assessmentSummary = `
            <div class="assessment-summary">
                <div class="assessment-header">
                    <h4>📋 ${assessment.project || 'Home Project Assessment'}</h4>
                    <div class="assessment-badges">
                        <span class="complexity-badge ${assessment.complexity?.toLowerCase()}">Complexity: ${assessment.complexity || 'Medium'}</span>
                        <span class="diy-badge ${assessment.diyFeasible?.toLowerCase()}">DIY: ${assessment.diyFeasible || 'Partial'}</span>
                        ${assessment.estimatedPrice ? `<span class="price-badge">${assessment.estimatedPrice}</span>` : ''}
                    </div>
                </div>
                <div class="assessment-content">
                    <p class="assessment-diagnosis">${assessment.diagnosis || 'Based on your description, this appears to be a home project that requires attention.'}</p>
                    ${assessment.safetyConcerns ? `<div class="safety-warning">⚠️ ${assessment.safetyConcerns}</div>` : ''}
                    ${assessment.nextSteps && assessment.nextSteps.length > 0 ? `
                    <div class="next-steps">
                        <strong>Next Steps:</strong>
                        <ul>
                            ${assessment.nextSteps.map(step => `<li>${step}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    ${assessment.specialistNeeded ? `<div class="specialist-info">👨‍🔧 ${assessment.specialistNeeded}</div>` : ''}
                </div>
            </div>
        `;
        
        // Create the community post
        const post = {
            id: Date.now(),
            title: assessment.project || 'Home Project Help Needed',
            content: (friendMessage ? friendMessage + '\n\n' : '') + assessmentSummary,
            author: this.currentUser.name,
            category: 'general',
            type: 'question',
            date: new Date().toISOString(),
            likes: 0,
            isLiked: false,
            isBookmarked: false,
            reactions: {},
            comments: [],
            images: [],
            assessmentId: this.currentAssessmentId, // Link to the assessment
            assessmentData: assessment // Store the full assessment data
        };
        
        // Add to posts array
        this.posts.unshift(post);
        this.saveToStorage();
        
        // Close modal
        this.closeAskFriendsModal();
        
        // Show success message
        alert('Your post has been shared with the community!');
        
        // Navigate to dashboard to see the post
        this.navigateTo('dashboard');
    }

    createAssessmentFromChat() {
        // Extract key information from chat messages
        const userMessages = this.chatMessages.filter(msg => msg.type === 'user');
        const aiMessages = this.chatMessages.filter(msg => msg.type === 'ai');
        
        // Create assessment from chat data
        const assessment = {
            id: Date.now(),
            title: this.extractTitleFromChat(),
            description: this.extractDescriptionFromChat(),
            status: 'active',
            type: 'AI Triage',
            date: new Date().toISOString(),
            aiComplete: true,
            communityActive: false,
            professionalBooked: false,
            chatTranscript: this.chatMessages,
            diagnosis: this.extractDiagnosisFromChat(),
            confidence: this.extractConfidenceFromChat(),
            specialistType: this.extractSpecialistTypeFromChat(),
            nextSteps: this.extractNextStepsFromChat()
        };
        
        return assessment;
    }

    extractTitleFromChat() {
        const firstUserMessage = this.chatMessages.find(msg => msg.type === 'user');
        if (firstUserMessage) {
            const words = firstUserMessage.content.split(' ');
            return words.slice(0, 6).join(' ') + (words.length > 6 ? '...' : '');
        }
        return 'Home Repair Issue';
    }

    extractDescriptionFromChat() {
        const userMessages = this.chatMessages.filter(msg => msg.type === 'user');
        return userMessages.map(msg => msg.content).join(' ');
    }

    extractDiagnosisFromChat() {
        const lastAiMessage = this.chatMessages.filter(msg => msg.type === 'ai').pop();
        return lastAiMessage ? lastAiMessage.content : 'Issue requires further assessment';
    }

    extractConfidenceFromChat() {
        // Mock confidence based on chat length
        const aiCount = this.chatMessages.filter(msg => msg.type === 'ai').length;
        if (aiCount >= 3) return 'High';
        if (aiCount >= 2) return 'Medium';
        return 'Low';
    }

    extractSpecialistTypeFromChat() {
        // Mock specialist type based on keywords
        const allText = this.chatMessages.map(msg => msg.content).join(' ').toLowerCase();
        if (allText.includes('water') || allText.includes('pipe') || allText.includes('faucet')) {
            return 'Licensed Plumber';
        }
        if (allText.includes('electrical') || allText.includes('wire') || allText.includes('outlet')) {
            return 'Licensed Electrician';
        }
        if (allText.includes('hvac') || allText.includes('heating') || allText.includes('cooling')) {
            return 'HVAC Technician';
        }
        return 'General Contractor';
    }

    extractNextStepsFromChat() {
        return [
            'Document the issue with photos/videos',
            'Get multiple opinions before proceeding',
            'Consider DIY vs professional approach'
        ];
    }

    async callOpenAI(message) {
        const userContext = this.getUserContext();
        const conversationHistory = this.chatMessages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

           const systemPrompt = `You are a helpful home project assistant that conducts structured assessments. Your goal is to gather enough information to provide a comprehensive project summary.

**User Context:**
${userContext ? `
- Home Type: ${userContext.homeType}
- Handiness Level: ${userContext.handinessLevel}
- Home Age: ${userContext.homeAge}
- Square Footage: ${userContext.squareFootage}
` : 'No user profile information available.'}

**CRITICAL: Do NOT provide recommendations or next steps until you have gathered sufficient information.**

When you have enough information, provide a structured assessment with these fields:
- Project: Brief title
- Diagnosis: What the project involves
- Complexity: Low, Medium, or High
- DIY Feasible: Yes, Partial, or No
- Estimated Price: Cost range (e.g., "$500-1,200", "$2,000-5,000", "Contact for quote")
- Safety Concerns: Any safety issues (optional)
- Next Steps: Array of recommended actions
- Specialist Needed: Type of professional needed (optional)

**Assessment Process:**
1. **Ask specific follow-up questions** to understand their project completely
2. **Gather essential details** about: scope, timeline, budget, challenges, goals, current state
3. **Only provide assessment** when you have enough information to give accurate guidance
4. **Ask clarifying questions** if the initial description is vague or incomplete

**Information you need before providing assessment:**
- What exactly they want to do (specific scope)
- Current state of the area/project
- Their budget range or constraints
- Timeline expectations
- Their experience level with similar projects
- Any specific challenges or concerns they have
- What they hope to achieve

**When you have enough information, provide a structured summary in this exact format:**

**PROJECT ASSESSMENT COMPLETE**

**Project:** [Brief title]
**Diagnosis:** [What the issue/project involves]
**Complexity:** [Low/Medium/High]
**DIY Feasible:** [Yes/No/Partial]
**Safety Concerns:** [Any safety issues to address]
**Recommended Next Steps:**
1. [First step]
2. [Second step]
3. [Third step]
**Specialist Needed:** [Type of professional if needed]

**IMPORTANT: When you have enough information, end your response with exactly this text:**
"I've completed your project assessment. You can now share this with friends for advice or connect with a professional."

**This triggers the summary card to appear, so it's critical you include this exact phrase.**

**Safety First:** Always mention any safety concerns (electrical, gas, structural) and when to turn off utilities.`;

        // Use Netlify function for production, direct API for local development
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        const apiUrl = isProduction ? 'https://alexakaminsky.com/ai/pillar/.netlify/functions/openai' : 'https://api.openai.com/v1/chat/completions';
        
        const requestBody = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                ...conversationHistory
            ],
            max_tokens: 600,
            temperature: 0.7
        };

        const headers = {
            'Content-Type': 'application/json'
        };

        // Only add Authorization header for local development (direct OpenAI calls)
        if (!isProduction && this.openaiApiKey) {
            headers['Authorization'] = `Bearer ${this.openaiApiKey}`;
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('API call failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    renderChatMessages() {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        container.innerHTML = this.chatMessages.map(msg => `
            <div class="message ${msg.type}-message">
                <div class="message-avatar">${msg.type === 'ai' ? '🤖' : '👤'}</div>
                <div class="message-content">
                    <div class="message-text">${this.formatMessageContent(msg.content)}</div>
                    <span class="message-time">${msg.timestamp.toLocaleTimeString()}</span>
                </div>
            </div>
        `).join('');

        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    formatMessageContent(content) {
        // Convert markdown-style formatting to HTML
        let formatted = content
            // Convert **bold** to <strong>bold</strong>
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Convert *italic* to <em>italic</em>
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Convert line breaks to <br> tags
            .replace(/\n/g, '<br>')
            // Convert bullet points
            .replace(/^• /gm, '• ')
            // Convert numbered lists
            .replace(/^\d+\. /gm, '<br>$&')
            // Add spacing around headers
            .replace(/\*\*(.*?):\*\*/g, '<br><strong>$1:</strong><br>')
            // Clean up multiple line breaks
            .replace(/(<br>){3,}/g, '<br><br>')
            // Remove leading/trailing breaks
            .trim();

        return formatted;
    }

    showTypingIndicator() {
        const container = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Professional Booking
    nextBookingStep() {
        if (this.currentBookingStep === 1) {
            // Validate step 1
            const title = document.getElementById('issue-title').value;
            const description = document.getElementById('issue-description').value;
            const professionalType = document.getElementById('professional-type').value;

            if (!title || !description || !professionalType) {
                alert('Please fill in all required fields.');
                return;
            }

            this.currentBookingStep = 2;
            document.getElementById('step-1').classList.remove('active');
            document.getElementById('step-2').classList.add('active');
            this.generateCalendar();
        } else if (this.currentBookingStep === 2) {
            if (!this.selectedDate || !this.selectedTime) {
                alert('Please select a date and time.');
                return;
            }

            this.currentBookingStep = 3;
            document.getElementById('step-2').classList.remove('active');
            document.getElementById('step-3').classList.add('active');
        }
    }

    generateCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        document.getElementById('calendar-month').textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        
        let calendarHTML = '';
        
        // Day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            calendarHTML += `<div class="calendar-day-header">${day}</div>`;
        });
        
        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = new Date().toDateString() === new Date(this.currentYear, this.currentMonth, day).toDateString();
            const isPast = new Date(this.currentYear, this.currentMonth, day) < new Date();
            const isSelected = this.selectedDate === `${this.currentYear}-${this.currentMonth + 1}-${day}`;
            
            calendarHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''}" 
                     onclick="${!isPast ? `selectDate('${this.currentYear}-${this.currentMonth + 1}-${day}')` : ''}">
                    ${day}
                </div>
            `;
        }
        
        calendarGrid.innerHTML = calendarHTML;
        this.generateTimeSlots();
    }

    changeMonth(direction) {
        this.currentMonth += direction;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.generateCalendar();
    }

    selectDate(date) {
        this.selectedDate = date;
        this.generateCalendar();
        this.generateTimeSlots();
    }

    generateTimeSlots() {
        const timeSlotsContainer = document.getElementById('time-slots');
        if (!this.selectedDate) {
            timeSlotsContainer.innerHTML = '<p>Please select a date first.</p>';
            return;
        }

        const timeSlots = [
            '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
            '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
            '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
        ];

        timeSlotsContainer.innerHTML = `
            <h4>Available Times</h4>
            <div class="time-grid">
                ${timeSlots.map(time => `
                    <button class="time-slot ${this.selectedTime === time ? 'selected' : ''}" 
                            onclick="selectTime('${time}')">${time}</button>
                `).join('')}
            </div>
        `;
    }

    selectTime(time) {
        this.selectedTime = time;
        this.generateTimeSlots();
    }

    completeBooking() {
        const paymentMethod = document.querySelector('input[name="payment"]:checked');
        if (!paymentMethod) {
            alert('Please select a payment method.');
            return;
        }

        // Create assessment
        const assessment = {
            id: Date.now(),
            title: document.getElementById('issue-title').value,
            description: document.getElementById('issue-description').value,
            type: 'professional',
            status: 'scheduled',
            professionalType: document.getElementById('professional-type').value,
            scheduledDate: this.selectedDate,
            scheduledTime: this.selectedTime,
            paymentMethod: paymentMethod.value,
            date: new Date().toISOString()
        };

        this.assessments.push(assessment);
        this.saveToStorage();

        alert('Assessment booked successfully!');
        this.navigateTo('dashboard');
    }

    // Tab Management
    switchTab(tabName) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab
        document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;

        if (tabName === 'ai-triage') {
            this.initializeChat();
        }
    }

    switchNetworkTab(tabName) {
        // Remove active class from all tabs
        document.querySelectorAll('.network-tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentNetworkTab = tabName;
    }

    // Modal Management
    showModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // Form Handlers
    handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        this.login(email, password);
    }

    handleSignup(event) {
        event.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        this.signup(name, email, password);
    }

    handleAddFriend(event) {
        event.preventDefault();
        const email = document.getElementById('friend-email').value;
        
        const friend = {
            id: Date.now(),
            name: email.split('@')[0],
            email: email,
            date: new Date().toISOString()
        };

        this.friends.push(friend);
        this.saveToStorage();
        this.closeModal('add-friend-modal');
        this.displayFriends();
        
        // Clear form
        document.getElementById('add-friend-form').reset();
    }

    handleAddContractor(event) {
        event.preventDefault();
        const name = document.getElementById('contractor-name').value;
        const type = document.getElementById('contractor-type').value;
        const contact = document.getElementById('contractor-contact').value;
        const notes = document.getElementById('contractor-notes').value;

        const contractor = {
            id: Date.now(),
            name: name,
            type: type,
            contact: contact,
            notes: notes,
            date: new Date().toISOString()
        };

        this.contractors.push(contractor);
        this.saveToStorage();
        this.closeModal('add-contractor-modal');
        this.displayContractors();
        
        // Clear form
        document.getElementById('add-contractor-form').reset();
    }

    handleNewTopic(event) {
        event.preventDefault();
        const title = document.getElementById('topic-title').value;
        const category = document.getElementById('topic-category').value;
        const content = document.getElementById('topic-content').value;
        const privacy = document.getElementById('topic-privacy').value;

        const topic = {
            id: Date.now(),
            title: title,
            category: category,
            content: content,
            privacy: privacy,
            author: this.currentUser.name,
            replies: 0,
            views: 0,
            date: new Date().toISOString()
        };

        this.forumTopics.push(topic);
        this.saveToStorage();
        this.closeModal('new-topic-modal');
        this.displayForumTopics();
        
        // Clear form
        document.getElementById('new-topic-form').reset();
    }

    // Data Management
    loadFromStorage() {
        const data = localStorage.getItem('pillar-data');
        if (data) {
            const parsed = JSON.parse(data);
            this.isLoggedIn = parsed.isLoggedIn || false;
            this.currentUser = parsed.currentUser || null;
            this.assessments = parsed.assessments || [];
            this.friends = parsed.friends || [];
            this.contractors = parsed.contractors || [];
            this.forumTopics = parsed.forumTopics || [];
            this.posts = parsed.posts || [];
            this.points = parsed.points || 0;
            this.pointsHistory = parsed.pointsHistory || [];
        }
        
        // Always add sample data if posts array is empty
        if (this.posts.length === 0) {
            this.addSampleData();
        }
    }

    addSampleData() {
        console.log('Adding sample data...');
        this.assessments = [
            { 
                id: 1, 
                title: 'Kitchen Faucet Dripping', 
                description: 'My kitchen faucet has been dripping constantly for the past week. I\'ve tried tightening the packing nut but it\'s still dripping. Any suggestions? I\'m worried about water waste and the noise is driving me crazy!', 
                status: 'active', 
                type: 'DIY', 
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                aiComplete: true,
                communityActive: true,
                professionalBooked: false
            },
            { 
                id: 2, 
                title: 'Bathroom Renovation Planning', 
                description: 'Want to completely renovate the master bathroom with new fixtures, better lighting, and a more modern layout. Looking for guidance on where to start and what to consider.', 
                status: 'in-progress', 
                type: 'Professional', 
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                aiComplete: true,
                communityActive: false,
                professionalBooked: true
            },
            { 
                id: 3, 
                title: 'Home Office Setup', 
                description: 'Converting the spare bedroom into a functional home office. Need advice on electrical outlets, lighting, and built-in storage solutions.', 
                status: 'active', 
                type: 'DIY', 
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                aiComplete: false,
                communityActive: false,
                professionalBooked: false
            },
            { 
                id: 4, 
                title: 'Deck Extension Project', 
                description: 'Want to extend our existing deck to create more outdoor living space. Need guidance on structural requirements, permits, and material choices.', 
                status: 'completed', 
                type: 'Professional', 
                date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                aiComplete: true,
                communityActive: true,
                professionalBooked: false
            },
            { 
                id: 5, 
                title: 'Smart Home Integration', 
                description: 'Looking to add smart lighting, thermostats, and security features throughout the house. Need help understanding electrical requirements and compatibility.', 
                status: 'active', 
                type: 'DIY', 
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                aiComplete: true,
                communityActive: true,
                professionalBooked: false
            }
        ];

        this.friends = [
            { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', date: new Date().toISOString() },
            { id: 2, name: 'Mike Chen', email: 'mike@example.com', date: new Date().toISOString() }
        ];

        this.contractors = [
            { id: 1, name: 'ABC Plumbing', type: 'plumber', contact: '(555) 123-4567', notes: 'Great service, fair prices', date: new Date().toISOString() },
            { id: 2, name: 'City Electric', type: 'electrician', contact: 'cityelectric@email.com', notes: 'Professional but expensive', date: new Date().toISOString() }
        ];

        this.forumTopics = [
            { id: 1, title: 'Kitchen Faucet Dripping', category: 'plumbing', content: 'My kitchen faucet has been dripping for weeks...', author: 'Sarah Johnson', replies: 3, views: 15, date: new Date().toISOString() },
            { id: 2, title: 'Bathroom Renovation Planning', category: 'renovation', content: 'Planning a complete bathroom renovation and need advice on layout and materials...', author: 'Mike Chen', replies: 5, views: 22, date: new Date().toISOString() },
            { id: 3, title: 'Smart Home Setup', category: 'home-automation', content: 'Looking to add smart lighting and security features throughout the house...', author: 'Emma Wilson', replies: 2, views: 12, date: new Date().toISOString() }
        ];

        this.posts = [
            {
                id: 1,
                title: "Kitchen Faucet Won't Stop Dripping",
                content: "My kitchen faucet has been dripping constantly for the past week. I've tried tightening the packing nut but it's still dripping. Any suggestions? I'm worried about water waste and the noise is driving me crazy!",
                author: "Sarah Johnson",
                category: "plumbing",
                type: "question",
                date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                likes: 12,
                isLiked: false,
                isBookmarked: false,
                reactions: { "👍": 8, "❤️": 3, "😮": 1 },
                comments: [
                    {
                        id: 1,
                        author: "Mike Chen",
                        text: "Try replacing the O-ring inside the faucet. That's usually the culprit for persistent drips.",
                        date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        id: 2,
                        author: "Lisa Rodriguez",
                        text: "I had the same issue! The problem was the cartridge. You can get replacement parts at any hardware store.",
                        date: new Date(Date.now() - 30 * 60 * 1000).toISOString()
                    }
                ],
                images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"]
            },
            {
                id: 2,
                title: "Bathroom Renovation Progress - Before & After!",
                content: "Just finished the first phase of our master bathroom renovation! We gutted everything and started fresh. The new vanity and lighting make such a difference. Still need to finish the tile work and fixtures, but we're getting there!",
                author: "Mike Chen",
                category: "renovation",
                type: "progress",
                date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                likes: 24,
                isLiked: true,
                isBookmarked: false,
                reactions: { "👍": 15, "❤️": 8, "😮": 1 },
                comments: [
                    {
                        id: 3,
                        author: "Sarah Johnson",
                        text: "Wow, that looks amazing! What kind of vanity did you go with?",
                        date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        id: 4,
                        author: "Lisa Rodriguez",
                        text: "Love the lighting choice! Are you doing the tile work yourself?",
                        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                    }
                ],
                images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"]
            },
            {
                id: 2,
                title: "Fixed My Electrical Outlet - Here's How!",
                content: "After struggling with a dead outlet for days, I finally figured it out! The GFCI outlet in the bathroom had tripped and was controlling the kitchen outlets. Reset it and everything works perfectly now. Hope this helps someone else!",
                author: "Mike Chen",
                category: "electrical",
                type: "solution",
                date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                likes: 24,
                isLiked: true,
                isBookmarked: true,
                reactions: { "👍": 15, "❤️": 7, "🎉": 2 },
                comments: [
                    {
                        id: 3,
                        author: "David Kim",
                        text: "Great tip! This saved me from calling an electrician. Thanks for sharing!",
                        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                    }
                ],
                images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop"]
            },
            {
                id: 3,
                title: "Home Office Setup - Need Advice!",
                content: "Converting our spare bedroom into a home office. Need advice on electrical outlets, lighting, and built-in storage. Want to make it functional but also look professional for video calls. Any suggestions for layout and equipment?",
                author: "Emma Wilson",
                category: "home-improvement",
                type: "question",
                date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                likes: 8,
                isLiked: false,
                isBookmarked: false,
                reactions: { "👍": 5, "😟": 2, "💡": 1 },
                comments: [
                    {
                        id: 5,
                        author: "Sarah Johnson",
                        text: "I just finished my home office! Key things: good lighting (I used LED strips), multiple outlets, and a standing desk. Happy to share my setup!",
                        date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
                    }
                ],
                images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop"]
            },
            {
                id: 4,
                title: "DIY Roof Repair - Before and After",
                content: "Just finished repairing a small leak in my roof. The shingles were damaged from a recent storm. Here's what I did: 1) Removed damaged shingles, 2) Applied roofing cement, 3) Installed new shingles, 4) Sealed all edges. Total cost: $45 vs $300+ for a contractor!",
                author: "Alex Thompson",
                category: "roofing",
                type: "solution",
                date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                likes: 18,
                isLiked: false,
                isBookmarked: true,
                reactions: { "👍": 12, "❤️": 4, "🎉": 2 },
                comments: [
                    {
                        id: 4,
                        author: "Sarah Johnson",
                        text: "Amazing work! How long did it take you?",
                        date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        id: 5,
                        author: "Mike Chen",
                        text: "Great job! What type of shingles did you use?",
                        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
                    }
                ],
                images: [
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop"
                ]
            },
            {
                id: 5,
                title: "Quick Tip: Prevent Frozen Pipes",
                content: "With winter coming, here's a simple tip to prevent frozen pipes: let your faucets drip slightly during extremely cold nights. The moving water prevents freezing. Also, keep cabinet doors open to allow warm air to circulate around pipes. Stay warm!",
                author: "Lisa Rodriguez",
                category: "plumbing",
                type: "tip",
                date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                likes: 31,
                isLiked: true,
                isBookmarked: false,
                reactions: { "👍": 20, "❤️": 8, "💡": 3 },
                comments: [
                    {
                        id: 6,
                        author: "David Kim",
                        text: "This is so helpful! I always worry about frozen pipes in winter.",
                        date: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
                    }
                ]
            },
            {
                id: 6,
                title: "Bathroom Fan Not Working - Need Help!",
                content: "My bathroom exhaust fan stopped working yesterday. I checked the switch and it seems fine. The fan doesn't make any noise when I turn it on. Is this something I can fix myself or do I need to call an electrician?",
                author: "Jennifer Martinez",
                category: "electrical",
                type: "question",
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                likes: 6,
                isLiked: false,
                isBookmarked: false,
                reactions: { "👍": 4, "😟": 2 },
                comments: [
                    {
                        id: 7,
                        author: "Tom Wilson",
                        text: "Check if the fan is getting power. Could be a loose connection or the motor burned out.",
                        date: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
                    }
                ],
                images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop"]
            },
            {
                id: 7,
                title: "Water Heater Maintenance Tips",
                content: "Just did my annual water heater maintenance and thought I'd share some tips: 1) Drain 2-3 gallons to remove sediment, 2) Check the pressure relief valve, 3) Insulate pipes if needed, 4) Set temperature to 120°F for efficiency. My water heater is 5 years old and still running great!",
                author: "Robert Davis",
                category: "plumbing",
                type: "tip",
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                likes: 22,
                isLiked: true,
                isBookmarked: true,
                reactions: { "👍": 15, "❤️": 5, "💡": 2 },
                comments: [
                    {
                        id: 8,
                        author: "Maria Garcia",
                        text: "Thanks for the reminder! I need to do this soon.",
                        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ]
            },
            {
                id: 8,
                title: "Replaced My Thermostat - Easy DIY!",
                content: "Upgraded from an old manual thermostat to a smart one. The installation was easier than I expected! Just had to turn off power, label the wires, and connect the new unit. Now I can control the temperature from my phone. Total time: 30 minutes, cost: $89.",
                author: "Kevin Lee",
                category: "hvac",
                type: "solution",
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                likes: 16,
                isLiked: false,
                isBookmarked: false,
                reactions: { "👍": 10, "❤️": 4, "🎉": 2 },
                comments: [
                    {
                        id: 9,
                        author: "Amanda Smith",
                        text: "Which smart thermostat did you get? I'm looking to upgrade too.",
                        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ],
                images: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop"]
            },
            {
                id: 9,
                title: "Gutter Cleaning Season is Here",
                content: "Fall is here and it's time to clean those gutters! I use a leaf blower with an extension and a gutter scoop. Takes about 2 hours for my house. Pro tip: Check for loose brackets while you're up there. Clean gutters prevent water damage to your foundation.",
                author: "Patricia Brown",
                category: "roofing",
                type: "tip",
                date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                likes: 14,
                isLiked: true,
                isBookmarked: false,
                reactions: { "👍": 9, "❤️": 3, "💡": 2 },
                comments: [
                    {
                        id: 10,
                        author: "James Wilson",
                        text: "Don't forget to check the downspouts too! Mine were completely clogged.",
                        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ]
            },
            {
                id: 10,
                title: "Circuit Breaker Keeps Tripping",
                content: "My kitchen circuit breaker trips every time I use the microwave and toaster together. This started happening last week. I've unplugged other appliances but it still happens. Any ideas what could be causing this?",
                author: "Michael Johnson",
                category: "electrical",
                type: "question",
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                likes: 9,
                isLiked: false,
                isBookmarked: false,
                reactions: { "👍": 6, "😟": 3 },
                comments: [
                    {
                        id: 11,
                        author: "Steve Anderson",
                        text: "Sounds like an overloaded circuit. You might need to redistribute the load or add a new circuit.",
                        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        id: 12,
                        author: "Rachel Green",
                        text: "Check if any outlets are warm to the touch. Could indicate a wiring issue.",
                        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ]
            },
            {
                id: 11,
                title: "Installed Smart Doorbell - Game Changer!",
                content: "Just installed a video doorbell and it's amazing! I can see who's at the door from anywhere, get motion alerts, and even talk to delivery people. Installation was straightforward - just replaced the existing doorbell button. Highly recommend for home security!",
                author: "Daniel Kim",
                category: "general",
                type: "solution",
                date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                likes: 19,
                isLiked: true,
                isBookmarked: true,
                reactions: { "👍": 12, "❤️": 5, "🎉": 2 },
                comments: [
                    {
                        id: 13,
                        author: "Lisa Chen",
                        text: "Which brand did you go with? I'm shopping around for one.",
                        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ],
                images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"]
            },
            {
                id: 12,
                title: "Toilet Running Constantly - Fixed It!",
                content: "My toilet was running constantly and driving up my water bill. The issue was a worn flapper valve. Replaced it for $8 and now it's quiet again. Took 5 minutes to fix. Always check the simple things first!",
                author: "Susan Taylor",
                category: "plumbing",
                type: "solution",
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                likes: 13,
                isLiked: false,
                isBookmarked: false,
                reactions: { "👍": 8, "❤️": 3, "🎉": 2 },
                comments: [
                    {
                        id: 14,
                        author: "Mark Davis",
                        text: "Same issue here! The flapper was the culprit. Thanks for the tip!",
                        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ]
            },
            {
                id: 13,
                title: "Air Filter Replacement Reminder",
                content: "Don't forget to change your HVAC air filter! I set a reminder on my phone for every 3 months. Dirty filters make your system work harder and cost more to run. I buy them in bulk to save money. Your HVAC system will thank you!",
                author: "Nancy White",
                category: "hvac",
                type: "tip",
                date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                likes: 17,
                isLiked: true,
                isBookmarked: false,
                reactions: { "👍": 11, "❤️": 4, "💡": 2 },
                comments: [
                    {
                        id: 15,
                        author: "Chris Miller",
                        text: "Great reminder! I always forget this one.",
                        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ]
            },
            {
                id: 14,
                title: "Garage Door Opener Acting Up",
                content: "My garage door opener is making a grinding noise and sometimes doesn't respond to the remote. It's about 10 years old. Should I try to fix it or just replace it? The door itself seems fine, just the opener mechanism.",
                author: "Brian Wilson",
                category: "general",
                type: "question",
                date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
                likes: 7,
                isLiked: false,
                isBookmarked: false,
                reactions: { "👍": 5, "😟": 2 },
                comments: [
                    {
                        id: 16,
                        author: "Tony Rodriguez",
                        text: "Check the chain tension and lubricate the moving parts. Might just need maintenance.",
                        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ]
            },
            {
                id: 15,
                title: "Caulking Around Windows - Before Winter",
                content: "Just finished caulking around all my windows before winter. Used exterior-grade silicone caulk and it took about 4 hours for the whole house. This should help with drafts and energy efficiency. The old caulk was cracked and letting air in.",
                author: "Karen Thompson",
                category: "general",
                type: "solution",
                date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                likes: 11,
                isLiked: false,
                isBookmarked: true,
                reactions: { "👍": 7, "❤️": 3, "💡": 1 },
                comments: [
                    {
                        id: 17,
                        author: "Paul Anderson",
                        text: "Good timing! I need to do this too before it gets too cold.",
                        date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ],
                images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop"]
            }
        ];

        this.points = 5;
        this.pointsHistory = [
            { description: 'Provided helpful feedback', amount: 2, date: new Date().toISOString() },
            { description: 'Referred a friend', amount: 10, date: new Date().toISOString() },
            { description: 'Used points for assessment', amount: -10, date: new Date().toISOString() }
        ];
        
        console.log('Sample data added. Posts count:', this.posts.length);
        this.saveToStorage();
    }

    saveToStorage() {
        const data = {
            isLoggedIn: this.isLoggedIn,
            currentUser: this.currentUser,
            assessments: this.assessments,
            friends: this.friends,
            contractors: this.contractors,
            forumTopics: this.forumTopics,
            posts: this.posts,
            points: this.points,
            pointsHistory: this.pointsHistory
        };
        localStorage.setItem('pillar-data', JSON.stringify(data));
    }
}

// Global functions for HTML onclick handlers
function navigateTo(page, id = null) {
    if (window.pillarApp) {
        if (id) {
            window.pillarApp.currentAssessmentId = id;
        }
        window.pillarApp.navigateTo(page);
    }
}

function switchTab(tabName) {
    if (window.pillarApp) {
        window.pillarApp.switchTab(tabName);
    }
}

function switchNetworkTab(tabName) {
    if (window.pillarApp) {
        window.pillarApp.switchNetworkTab(tabName);
    }
}

function showModal(modalId) {
    if (window.pillarApp) {
        window.pillarApp.showModal(modalId);
    }
}

function closeModal(modalId) {
    if (window.pillarApp) {
        window.pillarApp.closeModal(modalId);
    }
}

function showLoginModal() {
    showModal('login-modal');
}

function showSignupModal() {
    showModal('signup-modal');
}

function showAddFriendModal() {
    showModal('add-friend-modal');
}

function showAddContractorModal() {
    showModal('add-contractor-modal');
}

function showNewTopicModal() {
    showModal('new-topic-modal');
}

function showEditProfileModal() {
    showModal('edit-profile-modal');
}

function showEditHomeModal() {
    showModal('edit-home-modal');
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function logout() {
    if (window.pillarApp) {
        window.pillarApp.logout();
    }
}

function handleLogin(event) {
    if (window.pillarApp) {
        window.pillarApp.handleLogin(event);
    }
}

function handleSignup(event) {
    if (window.pillarApp) {
        window.pillarApp.handleSignup(event);
    }
}

function handleAddFriend(event) {
    if (window.pillarApp) {
        window.pillarApp.handleAddFriend(event);
    }
}

function handleAddContractor(event) {
    if (window.pillarApp) {
        window.pillarApp.handleAddContractor(event);
    }
}

function handleNewTopic(event) {
    if (window.pillarApp) {
        window.pillarApp.handleNewTopic(event);
    }
}

function sendChatMessage() {
    if (window.pillarApp) {
        window.pillarApp.sendChatMessage();
    }
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function nextBookingStep() {
    if (window.pillarApp) {
        window.pillarApp.nextBookingStep();
    }
}

function changeMonth(direction) {
    if (window.pillarApp) {
        window.pillarApp.changeMonth(direction);
    }
}

function selectDate(date) {
    if (window.pillarApp) {
        window.pillarApp.selectDate(date);
    }
}

function selectTime(time) {
    if (window.pillarApp) {
        window.pillarApp.selectTime(time);
    }
}

function completeBooking() {
    if (window.pillarApp) {
        window.pillarApp.completeBooking();
    }
}

function removeFriend(id) {
    if (window.pillarApp) {
        window.pillarApp.friends = window.pillarApp.friends.filter(f => f.id !== id);
        window.pillarApp.saveToStorage();
        window.pillarApp.displayFriends();
    }
}

function removeContractor(id) {
    if (window.pillarApp) {
        window.pillarApp.contractors = window.pillarApp.contractors.filter(c => c.id !== id);
        window.pillarApp.saveToStorage();
        window.pillarApp.displayContractors();
    }
}

function copyReferralLink() {
    const linkInput = document.getElementById('referral-link');
    linkInput.select();
    document.execCommand('copy');
    alert('Referral link copied to clipboard!');
}

function shareViaEmail() {
    const link = document.getElementById('referral-link').value;
    window.location.href = `mailto:?subject=Join me on Pillar&body=Check out this home repair platform: ${link}`;
}

function shareViaSMS() {
    const link = document.getElementById('referral-link').value;
    window.location.href = `sms:?body=Check out this home repair platform: ${link}`;
}

function saveSettings() {
    if (window.pillarApp) {
        // Save settings logic here
        alert('Settings saved!');
    }
}

// Facebook-style feed interactions
function toggleLike(postId) {
    if (window.pillarApp) {
        const post = window.pillarApp.posts.find(p => p.id === postId);
        if (post) {
            post.isLiked = !post.isLiked;
            post.likes += post.isLiked ? 1 : -1;
            window.pillarApp.saveToStorage();
            window.pillarApp.displayPostsFeed();
        }
    }
}

function toggleBookmark(postId) {
    if (window.pillarApp) {
        const post = window.pillarApp.posts.find(p => p.id === postId);
        if (post) {
            post.isBookmarked = !post.isBookmarked;
            window.pillarApp.saveToStorage();
            window.pillarApp.displayPostsFeed();
        }
    }
}

function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    if (commentsSection) {
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
    }
}

function addComment(postId) {
    if (window.pillarApp) {
        const post = window.pillarApp.posts.find(p => p.id === postId);
        if (post) {
            const commentInput = document.querySelector(`#comments-${postId} input`);
            const commentText = commentInput.value.trim();
            
            if (commentText) {
                const newComment = {
                    id: Date.now(),
                    author: window.pillarApp.currentUser ? window.pillarApp.currentUser.name : 'Anonymous',
                    text: commentText,
                    date: new Date().toISOString()
                };
                
                if (!post.comments) post.comments = [];
                post.comments.push(newComment);
                commentInput.value = '';
                
                window.pillarApp.saveToStorage();
                window.pillarApp.displayPostsFeed();
            }
        }
    }
}

function handleCommentKeypress(event, postId) {
    if (event.key === 'Enter') {
        addComment(postId);
    }
}

function likeComment(commentId) {
    // Comment like functionality
    console.log('Liked comment:', commentId);
}

function replyToComment(commentId) {
    // Reply to comment functionality
    console.log('Reply to comment:', commentId);
}

function sharePost(postId) {
    if (window.pillarApp) {
        const post = window.pillarApp.posts.find(p => p.id === postId);
        if (post) {
            const shareText = `Check out this home repair post: "${post.title}"`;
            if (navigator.share) {
                navigator.share({
                    title: post.title,
                    text: shareText,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(shareText);
                alert('Post link copied to clipboard!');
            }
        }
    }
}

function filterByCategory(category) {
    if (window.pillarApp) {
        window.pillarApp.currentCategory = category;
        window.pillarApp.displayPostsFeed();
    }
}

function filterFeed(filter) {
    if (window.pillarApp) {
        window.pillarApp.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.filter-tab').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        window.pillarApp.displayPostsFeed();
    }
}

function searchPosts() {
    if (window.pillarApp) {
        const searchTerm = document.getElementById('feed-search').value.toLowerCase();
        const posts = document.querySelectorAll('.post-card');
        
        posts.forEach(post => {
            const title = post.querySelector('.post-title').textContent.toLowerCase();
            const content = post.querySelector('.post-description').textContent.toLowerCase();
            const author = post.querySelector('.post-author').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm) || author.includes(searchTerm)) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    }
}

function togglePostMenu(postId) {
    // Post menu functionality (edit, delete, report, etc.)
    console.log('Toggle post menu for:', postId);
}

function openImageModal(imageUrl) {
    // Open image in modal for full view
    console.log('Open image modal:', imageUrl);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pillarApp = new PillarApp();
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-dropdown')) {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }
});

// Issue Details Helper Functions
function toggleHelpful(responseId) {
    // Toggle helpful status for a response
    console.log('Toggle helpful for response:', responseId);
}

function startConsultation() {
    // Start expert consultation
    console.log('Starting expert consultation...');
    alert('Expert consultation feature coming soon!');
}

function askFriends() {
    // Ask friends for help
    console.log('Asking friends for help...');
    alert('Share with friends feature coming soon!');
}

function uploadMedia() {
    // Upload media
    console.log('Uploading media...');
    alert('Media upload feature coming soon!');
}

function openImageModal(imageUrl) {
    // Open image in modal
    console.log('Opening image modal for:', imageUrl);
    alert('Image modal feature coming soon!');
}

// Profile Management Functions
function showEditHomeModal() {
    if (window.pillarApp && window.pillarApp.currentUser) {
        const user = window.pillarApp.currentUser;
        document.getElementById('edit-home-type').value = user.homeType || 'single-family';
        document.getElementById('edit-home-age').value = user.homeAge || 'recent';
        document.getElementById('edit-home-size').value = user.squareFootage || '';
    }
    showModal('edit-home-modal');
}

function showEditHandinessModal() {
    if (window.pillarApp && window.pillarApp.currentUser) {
        const user = window.pillarApp.currentUser;
        document.getElementById('edit-handiness-level').value = user.handinessLevel || 'some-experience';
        document.getElementById('edit-handiness-preference').value = user.handinessPreference || 'mix';
        document.getElementById('edit-skills').value = user.skills || '';
    }
    showModal('edit-handiness-modal');
}

function saveHomeProfile() {
    if (window.pillarApp) {
        const homeType = document.getElementById('edit-home-type').value;
        const homeAge = document.getElementById('edit-home-age').value;
        const squareFootage = document.getElementById('edit-home-size').value;
        
        // Update user profile
        window.pillarApp.currentUser.homeType = homeType;
        window.pillarApp.currentUser.homeAge = homeAge;
        window.pillarApp.currentUser.squareFootage = squareFootage;
        
        // Update display
        document.getElementById('home-type').textContent = homeType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        document.getElementById('home-age').textContent = homeAge.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        document.getElementById('home-size').textContent = squareFootage ? `${squareFootage} sq ft` : 'Not specified';
        
        // Save to storage
        window.pillarApp.saveToStorage();
        
        closeModal('edit-home-modal');
    }
}

function saveHandinessProfile() {
    if (window.pillarApp) {
        const handinessLevel = document.getElementById('edit-handiness-level').value;
        const handinessPreference = document.getElementById('edit-handiness-preference').value;
        const skills = document.getElementById('edit-skills').value;
        
        // Update user profile
        window.pillarApp.currentUser.handinessLevel = handinessLevel;
        window.pillarApp.currentUser.handinessPreference = handinessPreference;
        window.pillarApp.currentUser.skills = skills;
        
        // Update display
        document.getElementById('handiness-level').textContent = handinessLevel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        document.getElementById('handiness-preference').textContent = handinessPreference.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        // Save to storage
        window.pillarApp.saveToStorage();
        
        closeModal('edit-handiness-modal');
    }
}

// Seamless Flow Functions
function requestCommunityHelp() {
    // Show the ask friends modal
    if (window.pillarApp) {
        window.pillarApp.showAskFriendsModal();
        
        // Navigate to community help flow
        navigateTo('share');
    }
}

// Modal functions
function closeAskFriendsModal() {
    if (window.pillarApp) {
        window.pillarApp.closeAskFriendsModal();
    }
}

function createCommunityPost() {
    if (window.pillarApp) {
        window.pillarApp.createCommunityPost();
    }
}

function requestExpertHelp() {
    // Create assessment and transition to expert consultation
    if (window.pillarApp) {
        const assessment = window.pillarApp.createAssessmentFromChat();
        window.pillarApp.assessments.push(assessment);
        window.pillarApp.saveToStorage();
        
        // Navigate to expert consultation flow
        navigateTo('pros');
    }
}

function saveAssessment() {
    // Save assessment and return to dashboard
    if (window.pillarApp) {
        const assessment = window.pillarApp.createAssessmentFromChat();
        window.pillarApp.assessments.push(assessment);
        window.pillarApp.saveToStorage();
        
        // Navigate to dashboard
        navigateTo('dashboard');
    }
}