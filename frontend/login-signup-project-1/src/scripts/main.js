document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');
    const forgotPasswordButton = document.getElementById('forgot-password-button');

    if (loginButton) {
        loginButton.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }

    if (signupButton) {
        signupButton.addEventListener('click', function() {
            window.location.href = 'signup.html';
        });
    }

    if (forgotPasswordButton) {
        forgotPasswordButton.addEventListener('click', function() {
            window.location.href = 'forgot-password.html';
        });
    }
});