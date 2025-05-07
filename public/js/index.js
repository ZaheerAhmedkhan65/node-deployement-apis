document.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.querySelector('.posts-container');
    const timeFilters = document.querySelectorAll('.time-filter');
    
    // Cache for already loaded posts
    const postsCache = new Map();
    
    // Pre-compiled template
    const postTemplate = (post) => `
        <div class="card mb-3 post-card" id="post-${post.id}">
            <div class="card-body">
                <div class="d-flex align-items-start justify-content-between">
                    <div class="d-flex align-items-center mb-2">
                        <a href="/users/${post.user.id}/profile" class="text-decoration-none">
                        <img src="${post.user.avatar || '/images/default-avatar.png'}" 
                             alt="${post.user.name}" 
                             class="rounded-circle me-2 border border-2 border-primary"
                             width="40" 
                             height="40"
                             loading="lazy">
                        </a>
                        <h5 class="mb-auto post-author-name">${post.user.name}</h5>
                    </div>
                    <div class="text-muted small mb-3">
                        ${post.created_at}
                        ${post.isFallbackResults ? ' <span class="badge bg-warning">Earlier</span>' : ''}
                    </div>
                </div>   
                <h5 class="card-title" style="margin: 0px 0px 0px 45px;">${post.title}</h5>
                <p class="card-text" style="margin: 0px 0px 0px 45px;">${post.content}</p>
                <div style="margin:15px 0px -15px 45px;" class="d-flex justify-content-between align-items-center">
                    <div class="btn-group reaction-buttons">
                        <button class="btn btn-sm ${post.userReaction === 'like' ? 'btn-success' : 'btn-outline-success'} like-btn" 
                                data-post-id="${post.id}">
                            <i class="bi bi-hand-thumbs-up"></i> <span class="like-count">${post.like_count || 0}</span>
                        </button>
                        <button class="btn btn-sm ${post.userReaction === 'dislike' ? 'btn-danger' : 'btn-outline-danger'} dislike-btn" 
                                data-post-id="${post.id}">
                            <i class="bi bi-hand-thumbs-down"></i> <span class="dislike-count">${post.dislike_count || 0}</span>
                        </button>
                        <button class="btn btn-sm ${post.hasReposted ? 'btn-primary' : 'btn-outline-primary'} repost-btn" 
                                data-post-id="${post.id}">
                            <i class="bi bi-arrow-repeat"></i> <span class="repost-count">${post.repost_count || 0}</span>
                        </button>
                    </div>
                    <span class="badge bg-secondary">
                        🔥 ${Math.round(post.engagement_score || 0)}
                    </span>
                </div>
            </div>
        </div>
    `;

    // Function to load posts
    const loadTrendingPosts = async (period = '1 HOUR') => {
        try {
            // Show cached content immediately if available
            if (postsCache.has(period)) {
                postsContainer.innerHTML = postsCache.get(period);
                setupReactionButtons();
                return;
            }
            
            // Show loading state
            postsContainer.innerHTML = `
                <div class="text-center my-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `;
            
            // Fetch data with cache-busting
            const response = await fetch(`/posts/trending?period=${encodeURIComponent(period)}&_=${Date.now()}`);
            
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const posts = await response.json();
            
            if (!posts || !Array.isArray(posts)) {
                throw new Error('Invalid posts data received');
            }

            // Render posts
            const postsHTML = posts.map(postTemplate).join('');
            postsContainer.innerHTML = postsHTML;
            
            // Cache the rendered HTML
            postsCache.set(period, postsHTML);
            
            // Initialize event listeners
            setupReactionButtons();

        } catch (error) {
            console.error('Error loading trending posts:', error);
            postsContainer.innerHTML = `
                <div class="alert alert-danger">
                    Failed to load trending posts. ${error.message}
                </div>
            `;
        }
    };

    // Time filter event listeners with debounce
    let debounceTimer;
    timeFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            clearTimeout(debounceTimer);
            timeFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Debounce to prevent rapid clicks
            debounceTimer = setTimeout(() => {
                loadTrendingPosts(this.dataset.period);
            }, 200);
        });
    });
    // Initial load
    loadTrendingPosts();
});