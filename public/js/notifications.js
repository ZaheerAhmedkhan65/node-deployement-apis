document.addEventListener("DOMContentLoaded", () => {
    const notificationsContainer = document.querySelector("#notifications-container");
    
    // Show loading state
    notificationsContainer.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading notifications...</p>
        </div>
    `;

    fetch(`/users/${userId}/notifications`, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        credentials: "include",
    })
    .then(handleResponse)
    .then(displayNotifications)
    .catch(handleError);

    function handleResponse(response) {
        if (!response.ok) {
            // Handle specific error codes
            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }
            throw new Error(`Server returned ${response.status}`);
        }
        return response.json();
    }

    function displayNotifications(notifications) {
        if (!notifications || !Array.isArray(notifications)) {
            throw new Error('Invalid notifications data received');
        }

        notificationsContainer.innerHTML = `
            <ul class="list-group">
                ${notifications.map(notification => `
                    <li class="list-group-item">
                        <div class="d-flex justify-content-between">
                        <div class="d-flex gap-2">
                        <a href="/users/${notification.actor_id}/profile" class="text-decoration-none d-flex align-items-center flex-grow-1">
                            <img src="${notification.actor_avatar}" alt="${notification.name}" class="rounded-circle me-2" width="40" height="40">
                        </a>
                            <h6 class="card-title m-0">${notification.actor_name}</h6>
                        </div>
                        <small class="text-muted">${notification.time_display}</small>
                        </div>

                        <p style="margin:0px 0px 0px 55px;"> ${notification.message} </p>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    function handleError(error) {
        console.error('Error getting notifications:', error);
        notificationsContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Error getting notifications: ${error.message}
            </div>
        `;
    }
});