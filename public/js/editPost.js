document.addEventListener('DOMContentLoaded', () => {
    const editPostModal = document.getElementById('editPostModal');
    editPostModal.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        const postId = button.getAttribute('data-id');
        const postTitle = button.getAttribute('data-title');
        const postContent = button.getAttribute('data-content');
        const postPublishedAt = button.getAttribute('data-published_at');

        document.getElementById('edit-post-id').value = postId;
        document.getElementById('edit-title').value = postTitle;
        document.getElementById('edit-content').value = postContent;
        document.getElementById('edit-published_at').value = postPublishedAt;
    });

    // Handle form submission
    const editPostForm = document.getElementById('edit-post-form');
    editPostForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const postId = document.getElementById('edit-post-id').value;
        const updatedTitle = document.getElementById('edit-title').value;
        const updatedContent = document.getElementById('edit-content').value;
        const updatedPublishedAt = document.getElementById('edit-published_at').value;
console.log(updatedPublishedAt);
        try {
            const response = await fetch(`/posts/${postId}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: updatedTitle,
                    content: updatedContent,
                    published_at: updatedPublishedAt,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();  // Ensure we get the correct structure
                const updatedPost = responseData.updatedPost;  // Access updatedPost
                // Update the post in the DOM
                console.log(updatedPost.published_at);
                const postElement = document.getElementById(`post-${updatedPost.id}`);
                postElement.querySelector('.post-title').textContent = updatedPost.title;
                postElement.querySelector('.post-status').innerHTML = updatedPost.published_at  ?  `<span class="badge bg-success">Published</span>` : `<span class="badge bg-secondary">Draft</span>`;
                postElement.querySelector('.post-content').textContent = updatedPost.content;
                // Hide the modal
                const bootstrapModal = bootstrap.Modal.getInstance(editPostModal);
                bootstrapModal.hide();

                const editButton = postElement.querySelector(`#edit-post-btn-${updatedPost.id}`);
                editButton.setAttribute('data-title', updatedPost.title);
                editButton.setAttribute('data-content', updatedPost.content);
                editButton.setAttribute('data-published_at', updatedPost.published_at);
                notification(responseData.message,"success")
            } else {
                console.error('Failed to update post');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});


