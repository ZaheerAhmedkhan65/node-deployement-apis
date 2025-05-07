document.addEventListener("DOMContentLoaded", () => {
    const postsContainer = document.querySelector(".posts-container");
    const newPostModal = document.getElementById("newPostModal");
    document.querySelector("#create-post-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/posts/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = await response.json();
                const newPost = responseData.post;
                // Append the new post to the DOM or refresh the posts list
                const bootstrapModal = bootstrap.Modal.getInstance(newPostModal);
                bootstrapModal.hide();
                createNewPost(newPost.title, newPost.content, newPost.published_at, newPost.id);
                notification(responseData.message,"success");
            } else {
                console.error("Failed to create post");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });


    function createNewPost(title, content, published_at, post_id) {
        const li = document.createElement("li");
        li.classList.add("card", "my-1");
        li.setAttribute("id", `post-${post_id}`);
        li.innerHTML = `
                <div class="card-body">
                    <div class="d-flex align-items-center justify-content-between">
                        <div>
                            <strong class="text-decoration-none">${title}</strong> 
                            <span class="text-muted mx-2">${published_at}</span> 
                            <p class="text-muted">${content}</p>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <button id="edit-post-btn-${post_id}" class="btn btn-sm btn-info edit-post-btn" data-bs-toggle="modal"
                                data-bs-target="#editPostModal" data-id="${post_id}"
                                data-title="${title}" data-content="${content}"
                                data-published_at="${published_at}">
                                Edit
                            </button>
                            <button type="button" data-post-id="${post_id}" class="btn btn-sm btn-danger delete-post-btn">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        postsContainer.appendChild(li);
    }
});