function initAnimeAnimations() {

            anime({
                targets: '.terminal-box',
                opacity: [0, 1],
                translateY: [30, 0],
                delay: anime.stagger(100),
                duration: 800,
                easing: 'easeOutQuad'
            });

            anime({
                targets: '.glitch',
                scale: [0.95, 1],
                opacity: [0, 1],
                duration: 1000,
                easing: 'easeOutElastic(1, .6)'
            });

            anime({
                targets: 'nav a',
                opacity: [0, 1],
                translateX: [-20, 0],
                delay: anime.stagger(80, {start: 500}),
                duration: 600,
                easing: 'easeOutQuad'
            });

            anime({
                targets: '.profile-img',
                scale: [0, 1],
                rotate: [180, 0],
                opacity: [0, 1],
                duration: 1200,
                delay: 300,
                easing: 'easeOutElastic(1, .8)'
            });

            anime({
                targets: '.link-item',
                opacity: [0, 1],
                translateX: [-15, 0],
                delay: anime.stagger(60, {start: 800}),
                duration: 500,
                easing: 'easeOutQuad'
            });

            anime({
                targets: '.status-dot',
                scale: [1, 1.2, 1],
                duration: 2000,
                loop: true,
                easing: 'easeInOutSine'
            });

            document.querySelectorAll('nav a').forEach(link => {
                link.addEventListener('mouseenter', function() {
                    anime({
                        targets: this,
                        scale: 1.05,
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                });
                
                link.addEventListener('mouseleave', function() {
                    anime({
                        targets: this,
                        scale: 1,
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                });
            });

            document.querySelectorAll('.link-item').forEach(item => {
                item.addEventListener('mouseenter', function() {
                    anime({
                        targets: this,
                        translateX: 5,
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                });
                
                item.addEventListener('mouseleave', function() {
                    anime({
                        targets: this,
                        translateX: 0,
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                });
            });
        }

        window.addEventListener('DOMContentLoaded', function() {
            initAnimeAnimations();
        });

        const DISCORD_USER_ID = '315590911776260096';
        
        let spotifyData = null;
        
        function formatTime(ms) {
            const minutes = Math.floor(ms / 60000);
            const seconds = Math.floor((ms % 60000) / 1000);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        function updateDiscordAvatar(data) {
            const avatarImg = document.getElementById('discordAvatar');
            
            if (data && data.discord_user) {
                const user = data.discord_user;
                let avatarUrl;
                
                if (user.avatar) {
                    const extension = user.avatar.startsWith('a_') ? 'gif' : 'png';
                    avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=256`;
                } else {
                    const defaultAvatarNum = parseInt(user.discriminator) % 5;
                    avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNum}.png`;
                }
                
                avatarImg.src = avatarUrl;
            }
        }
        
        function updateSpotifyDisplay(spotify) {
            const albumArt = document.getElementById('albumArt');
            const trackTitle = document.getElementById('trackTitle');
            const trackArtist = document.getElementById('trackArtist');
            const trackAlbum = document.getElementById('trackAlbum');
            const currentTime = document.getElementById('currentTime');
            const totalTime = document.getElementById('totalTime');
            const progressBar = document.getElementById('progressBar');
            
            if (spotify) {
                if (spotify.album_art_url) {
                    albumArt.innerHTML = `<img src="${spotify.album_art_url}" alt="Album Art">`;
                    albumArt.classList.add('playing');
                } else {
                    albumArt.innerHTML = '<span style="font-size: 3rem;">♪</span>';
                    albumArt.classList.remove('playing');
                }
                
                trackTitle.textContent = spotify.song || 'Unknown Track';
                trackArtist.textContent = spotify.artist || 'Unknown Artist';
                trackAlbum.textContent = `Album: ${spotify.album || 'Unknown Album'}`;
                
                if (spotify.timestamps && spotify.timestamps.start && spotify.timestamps.end) {
                    const elapsed = Date.now() - spotify.timestamps.start;
                    const duration = spotify.timestamps.end - spotify.timestamps.start;
                    const progress = (elapsed / duration) * 100;
                    
                    progressBar.style.width = Math.min(Math.max(progress, 0), 100) + '%';
                    currentTime.textContent = formatTime(Math.max(elapsed, 0));
                    totalTime.textContent = formatTime(duration);
                } else {
                    progressBar.style.width = '0%';
                    currentTime.textContent = '0:00';
                    totalTime.textContent = '0:00';
                }
                
                spotifyData = spotify;
                
                anime({
                    targets: '.music-player',
                    scale: [0.98, 1],
                    duration: 500,
                    easing: 'easeOutQuad'
                });
            } else {
                albumArt.innerHTML = '<span style="font-size: 3rem; opacity: 0.3;">♪</span>';
                albumArt.classList.remove('playing');
                trackTitle.textContent = 'Not Playing';
                trackArtist.textContent = 'No active Spotify session';
                trackAlbum.textContent = '';
                progressBar.style.width = '0%';
                currentTime.textContent = '0:00';
                totalTime.textContent = '0:00';
                spotifyData = null;
            }
        }
        
        function openSpotify() {
            if (spotifyData && spotifyData.track_id) {
                window.open(`https://open.spotify.com/track/${spotifyData.track_id}`, '_blank');
            } else {
                alert('No track currently playing on Spotify');
            }
        }
        
        async function checkDiscordStatus() {
            const statusIndicator = document.getElementById('discordStatus');
            const statusBadge = document.getElementById('discordBadge');
            
            try {
                const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
                const data = await response.json();
                
                if (data.success && data.data) {
                    const status = data.data.discord_status;
                    const spotify = data.data.spotify;
                    
                    updateDiscordAvatar(data.data);
                    
                    statusIndicator.className = `status-indicator ${status}`;
                    statusBadge.className = `discord-badge ${status}`;
                    
                    switch(status) {
                        case 'online':
                            statusBadge.textContent = 'ONLINE';
                            break;
                        case 'idle':
                            statusBadge.textContent = 'IDLE';
                            break;
                        case 'dnd':
                            statusBadge.textContent = 'DO NOT DISTURB';
                            break;
                        default:
                            statusBadge.textContent = 'OFFLINE';
                            statusIndicator.className = 'status-indicator offline';
                            statusBadge.className = 'discord-badge offline';
                    }
                    
                    anime({
                        targets: [statusIndicator, statusBadge],
                        scale: [1.1, 1],
                        duration: 400,
                        easing: 'easeOutElastic(1, .6)'
                    });
                    
                    updateSpotifyDisplay(spotify);
                } else {
                    throw new Error('Invalid API response');
                }
            } catch (error) {
                console.error('Error fetching Discord status:', error);
                statusBadge.textContent = 'UNAVAILABLE';
                statusBadge.className = 'discord-badge offline';
                statusIndicator.className = 'status-indicator offline';
                updateSpotifyDisplay(null);
            }
        }
        
        if (DISCORD_USER_ID !== '') {
            checkDiscordStatus();
            setInterval(checkDiscordStatus, 5000);
        }

        function showSection(sectionName) {
            const activeSections = document.querySelectorAll('.section-content.active');
            activeSections.forEach(section => {
                anime({
                    targets: section,
                    opacity: 0,
                    translateY: -20,
                    duration: 300,
                    easing: 'easeInQuad',
                    complete: function() {
                        section.classList.remove('active');
                    }
                });
            });
            
            setTimeout(() => {
                const targetSection = document.getElementById(sectionName + 'Section');
                if (targetSection) {
                    targetSection.classList.add('active');
                    
                    anime({
                        targets: targetSection,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 500,
                        easing: 'easeOutQuad'
                    });

                    const boxes = targetSection.querySelectorAll('.terminal-box');
                    anime({
                        targets: boxes,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        delay: anime.stagger(100, {start: 200}),
                        duration: 600,
                        easing: 'easeOutQuad'
                    });
                    
                    if (sectionName === 'projects' && !window.reposLoaded) {
                        loadGitHubRepos();
                    }
                }
            }, 350);
        }

        let reposLoaded = false;
        
        async function loadGitHubRepos() {
            const container = document.getElementById('reposContainer');
            
            try {
                const response = await fetch('https://api.github.com/users/amonodrama/repos?sort=updated&per_page=100');
                const repos = await response.json();
                
                if (!Array.isArray(repos)) {
                    throw new Error('Invalid response from GitHub API');
                }
                
                const ownRepos = repos
                    .filter(repo => !repo.fork)
                    .sort((a, b) => b.stargazers_count - a.stargazers_count);
                
                if (ownRepos.length === 0) {
                    container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-dim);">No repositories found</div>';
                    return;
                }
                
                container.innerHTML = ownRepos.map(repo => `
                    <div class="repo-card">
                        <div class="repo-header">
                            <div>
                                ${repo.language ? `<span class="language-badge">${repo.language}</span>` : ''}
                                <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                            </div>
                        </div>
                        <div class="repo-description">
                            ${repo.description || '<em style="color: var(--text-dim);">No description provided</em>'}
                        </div>
                        <div class="repo-stats">
                            <div class="repo-stat">
                                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                                </svg>
                                <span>${repo.stargazers_count}</span>
                            </div>
                            <div class="repo-stat">
                                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013 6.25v-.878a2.25 2.25 0 111.5 0zM5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6.75.75a.75.75 0 100-1.5.75.75 0 000 1.5zm-3 8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                                </svg>
                                <span>${repo.forks_count}</span>
                            </div>
                            ${repo.license ? `
                                <div class="repo-stat">
                                    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.75.75V2h.985c.304 0 .603.08.867.231l1.29.736c.038.022.08.033.124.033h2.234a.75.75 0 010 1.5h-.427l2.111 4.692a.75.75 0 01-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.016.015-.045.04a3.514 3.514 0 01-.686.45A4.492 4.492 0 0113 10c-.707 0-1.356-.244-1.87-.673a.75.75 0 01-.104-.105l-.002.003-1.036-1.036a4.492 4.492 0 01-3.976 0l-1.036 1.036-.002-.003a.75.75 0 01-.104.105 4.492 4.492 0 01-5.37-.327 3.514 3.514 0 01-.686-.45l-.045-.04-.016-.015-.006-.006-.002-.002v-.002l.53.531-.531-.531a.75.75 0 01-.154-.838L2.5 4.25h-.427a.75.75 0 010-1.5h2.234c.044 0 .086-.011.124-.033l1.29-.736A1.75 1.75 0 016.588 2h.985V.75a.75.75 0 011.5 0z"/>
                                    </svg>
                                    <span>${repo.license.spdx_id}</span>
                                </div>
                            ` : ''}
                            <div class="repo-stat">
                                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 0a8 8 0 110 16A8 8 0 018 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zm7-3.25v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5a.75.75 0 011.5 0z"/>
                                </svg>
                                <span>Updated ${formatDate(repo.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
                
                anime({
                    targets: '.repo-card',
                    opacity: [0, 1],
                    translateY: [30, 0],
                    delay: anime.stagger(80),
                    duration: 600,
                    easing: 'easeOutQuad'
                });
                
                window.reposLoaded = true;
            } catch (error) {
                console.error('Error fetching GitHub repos:', error);
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--accent-red);">
                        <div style="font-family: 'VT323', monospace; font-size: 1.2rem; margin-bottom: 1rem;">
                            ERROR: Failed to load repositories
                        </div>
                        <div style="color: var(--text-dim); font-size: 0.9rem;">
                            ${error.message}
                        </div>
                    </div>
                `;
            }
        }
        
        function formatDate(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 1) return 'today';
            if (diffDays === 1) return 'yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
            if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
            return `${Math.floor(diffDays / 365)} years ago`;
        }

        const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1469232991111745752/EMB7cUy91FJA8AMOLv7DpJ4qSLPxcDIHO2u42QsSPvfELpihrGDJZQ-cMVHQClSa0bEy'; // Replace with your webhook URL
        
        const messageTextarea = document.getElementById('guestMessage');
        const charCountSpan = document.getElementById('charCount');
        
        if (messageTextarea && charCountSpan) {
            messageTextarea.addEventListener('input', function() {
                charCountSpan.textContent = this.value.length;
            });
        }

        async function submitGuestbookEntry(event) {
            event.preventDefault();
            
            const name = document.getElementById('guestName').value.trim();
            const website = document.getElementById('guestWebsite').value.trim();
            const avatar = document.getElementById('guestAvatar').value.trim();
            const message = document.getElementById('guestMessage').value.trim();
            const submitBtn = document.getElementById('submitBtn');

            if (!name || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            submitBtn.disabled = true;
            submitBtn.textContent = 'SENDING...';

            try {
                const timestamp = Date.now();
                
                function escapeForJS(str) {
                    return str
                        .replace(/\\/g, '\\\\')
                        .replace(/"/g, '\\"')
                        .replace(/\n/g, '\\n')
                        .replace(/\r/g, '\\r');
                }
                
                const entryCode = `{
    name: "${escapeForJS(name)}",
    website: "${escapeForJS(website)}",
    avatar: "${escapeForJS(avatar)}",
    message: "${escapeForJS(message)}",
    timestamp: ${timestamp}
},`;
                
                const response = await fetch(DISCORD_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: "Guestbook Bot",
                        content: "```javascript\n" + entryCode + "\n```"
                    })
                });

                if (response.ok) {
                    document.getElementById('guestbookForm').reset();
                    charCountSpan.textContent = '0';
                    
                    showNotification('✓ Entry submitted! It will be reviewed and added manually.', 'success');
                } else {
                    throw new Error('Failed to send to Discord');
                }

            } catch (error) {
                console.error('Error submitting entry:', error);
                showNotification('✗ Failed to submit entry. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'SUBMIT >>';
            }
        }

        function showNotification(message, type) {
            const container = document.getElementById('guestbookEntries');
            const notification = document.createElement('div');
            
            const bgColor = type === 'success' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 0, 64, 0.2)';
            const borderColor = type === 'success' ? 'var(--secondary-green)' : 'var(--accent-red)';
            const textColor = type === 'success' ? 'var(--secondary-green)' : 'var(--accent-red)';
            
            notification.style.cssText = `
                background: ${bgColor}; 
                border: 1px solid ${borderColor}; 
                padding: 1rem; 
                margin-bottom: 1rem; 
                text-align: center; 
                color: ${textColor}; 
                font-family: VT323, monospace; 
                font-size: 1.1rem;
                opacity: 0;
            `;
            notification.textContent = message;
            
            const formSection = document.querySelector('#guestbookForm').parentElement;
            formSection.parentElement.insertBefore(notification, container);
            
            anime({
                targets: notification,
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 400,
                easing: 'easeOutQuad'
            });
            
            setTimeout(() => {
                anime({
                    targets: notification,
                    opacity: 0,
                    translateY: -20,
                    duration: 300,
                    easing: 'easeInQuad',
                    complete: () => notification.remove()
                });
            }, 4700);
        }

        function loadGuestbookEntries() {
            const container = document.getElementById('guestbookEntries');
            if (!container) return;

            const entries = [
                {
                    name: "Monodrama",
                    website: "",
                    avatar: "https://cdn.discordapp.com/avatars/315590911776260096/a_b6c7162398668920d7e33bde40246642.gif?size=256",
                    message: "Welcome to my guestbook, feel free to leave a message here or your cool website for people to explore.",
                    timestamp: 1770363607178
                },
                {
                    name: "Rose",
                    website: "https://rosely.me",
                    avatar: "https://rosely.me/lain.gif",
                    message: "Fucking beautiful website. Good job.",
                    timestamp: 1770425842574
               }
                        
            ];

            if (entries.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--text-dim); border: 1px dashed var(--border-color);">
                        <p style="font-family: 'VT323', monospace; font-size: 1.2rem;">No entries yet. Be the first to sign!</p>
                    </div>
                `;
                return;
            }

            entries.sort((a, b) => b.timestamp - a.timestamp);

            container.innerHTML = entries.map(entry => `
                <div class="guestbook-entry" style="background: rgba(0, 0, 0, 0.3); border: 1px solid var(--border-color); padding: 1rem; margin-bottom: 1rem; position: relative; opacity: 0;">
                    <div style="display: flex; gap: 1rem; align-items: start;">
                        <div style="flex-shrink: 0;">
                            <img src="${entry.avatar || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ff0080%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23000%22%3E${entry.name.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E'}" 
                                 alt="${entry.name}" 
                                 style="width: 60px; height: 60px; border-radius: 4px; border: 2px solid var(--primary-pink); object-fit: cover;"
                                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ff0080%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23000%22%3E${entry.name.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E'">
                        </div>
                        <div style="flex-grow: 1;">
                            <div style="margin-bottom: 0.5rem;">
                                <span style="color: var(--primary-pink); font-family: 'VT323', monospace; font-size: 1.2rem;">${escapeHtml(entry.name)}</span>
                                ${entry.website ? `
                                    <a href="${escapeHtml(entry.website)}" target="_blank" rel="noopener noreferrer" style="color: var(--tertiary-cyan); text-decoration: none; margin-left: 0.5rem; font-size: 0.9rem;" title="Visit website">
                                        [WEBSITE] →
                                    </a>
                                ` : ''}
                                <span style="color: var(--text-dim); font-size: 0.85rem; margin-left: 0.5rem;">
                                    ${formatGuestbookDate(entry.timestamp)}
                                </span>
                            </div>
                            <div style="color: var(--text-primary); font-family: 'Share Tech Mono', monospace; line-height: 1.6; word-wrap: break-word;">
                                ${escapeHtml(entry.message)}
                            </div>
                        </div>
                    </div>
                `).join('');
            
            anime({
                targets: '.guestbook-entry',
                opacity: [0, 1],
                translateX: [-20, 0],
                delay: anime.stagger(80),
                duration: 500,
                easing: 'easeOutQuad'
            });
        }

        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

function formatGuestbookDate(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffMinutes < 1) return 'just now';
            if (diffMinutes < 60) return `${diffMinutes}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        const originalShowSection = showSection;
        showSection = function(sectionName) {
            originalShowSection(sectionName);
            if (sectionName === 'guestbook') {
                loadGuestbookEntries();
            }
        };

        if (window.location.hash === '#guestbook') {
            loadGuestbookEntries();
        }

