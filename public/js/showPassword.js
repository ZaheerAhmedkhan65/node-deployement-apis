document.addEventListener("DOMContentLoaded", function () {
    let passwordInput = document.getElementById("password");
    let showPasswordCheckbox = document.getElementById("show-password-checkbox");

    showPasswordCheckbox.addEventListener("change", function () {
        if (showPasswordCheckbox.checked) {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    });
})