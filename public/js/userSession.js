// Refresh token every 15 minutes to keep user logged in
setInterval(() => {
    fetch('/auth/refresh-token', {
        method: 'POST',
        credentials: 'include'
    }).then(response => {
        if (!response.ok) {
            window.location.href = '/auth/login';
        }
    });
}, 15 * 60 * 1000); // 15 minutes