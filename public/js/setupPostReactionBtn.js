const setupReactionButtons = () => {
    // Like functionality
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', async function () {
            const postId = this.dataset.postId;
            const postElement = document.getElementById(`post-${postId}`);

            try {
                const response = await fetch(`/posts/${postId}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                    },
                    body: JSON.stringify({ type: 'like' })
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();

                // Update UI
                postElement.querySelector('.like-count').textContent = data.reactions.likes;
                postElement.querySelector('.dislike-count').textContent = data.reactions.dislikes;

                // Update button states
                const likeBtn = postElement.querySelector('.like-btn');
                const dislikeBtn = postElement.querySelector('.dislike-btn');

                if (data.userReaction === 'like') {
                    likeBtn.classList.replace('btn-outline-success', 'btn-success');
                    dislikeBtn.classList.replace('btn-danger', 'btn-outline-danger');
                } else {
                    likeBtn.classList.replace('btn-success', 'btn-outline-success');
                }

            } catch (error) {
                console.error('Error:', error);
                alert('You need to login to like posts');
            }
        });
    });

    // Dislike functionality
    document.querySelectorAll('.dislike-btn').forEach(btn => {
        btn.addEventListener('click', async function () {
            const postId = this.dataset.postId;
            const postElement = document.getElementById(`post-${postId}`);

            try {
                const response = await fetch(`/posts/${postId}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                    },
                    body: JSON.stringify({ type: 'dislike' })
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();

                // Update UI
                postElement.querySelector('.like-count').textContent = data.reactions.likes;
                postElement.querySelector('.dislike-count').textContent = data.reactions.dislikes;

                // Update button states
                const likeBtn = postElement.querySelector('.like-btn');
                const dislikeBtn = postElement.querySelector('.dislike-btn');

                if (data.userReaction === 'dislike') {
                    dislikeBtn.classList.replace('btn-outline-danger', 'btn-danger');
                    likeBtn.classList.replace('btn-success', 'btn-outline-success');
                } else {
                    dislikeBtn.classList.replace('btn-danger', 'btn-outline-danger');
                }

            } catch (error) {
                console.error('Error:', error);
                alert('You need to login to dislike posts');
            }
        });
    });

   // Repost functionality
document.querySelectorAll('.repost-btn').forEach(btn => {
btn.addEventListener('click', async function() {
    const postId = this.dataset.postId;
    const repostBtn = this;
    const repostCountSpan = this.querySelector('.repost-count'); // Get the count span early

    try {
        // Show loading state
        const originalContent = repostBtn.innerHTML;
        repostBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span>';
        repostBtn.disabled = true;

        const response = await fetch(`/posts/${postId}/repost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data = await response.json();

        // Update the repost count immediately
        if (repostCountSpan) {
            repostCountSpan.textContent = data.repostCount;
        }

        // Toggle button state
        if (data.hasReposted) {
            repostBtn.classList.replace('btn-outline-primary', 'btn-primary');
        } else {
            repostBtn.classList.replace('btn-primary', 'btn-outline-primary');
        }

    } catch (error) {
        console.error('Repost error:', error);
        // Optionally show error notification
    } finally {
        // Ensure button is always reset properly
        repostBtn.disabled = false;
        repostBtn.innerHTML = `🔄 <span class="repost-count">${repostCountSpan.textContent}</span>`;
    }
});
});  
}