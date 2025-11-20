document.addEventListener('DOMContentLoaded', function() {
    // Gestion du formulaire de connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // TODO: Connecter à l'API backend
            console.log('Tentative de connexion:', { username, password });
            alert('Fonctionnalité de connexion à implémenter avec le backend');
        });
    }

    // Gestion du formulaire d'inscription
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // TODO: Connecter à l'API backend
            console.log('Tentative d\'inscription:', { username, email, password });
            alert('Fonctionnalité d\'inscription à implémenter avec le backend');
        });
    }

    // Gestion du formulaire de récupération de mot de passe
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            
            // TODO: Connecter à l'API backend
            console.log('Récupération de mot de passe pour:', email);
            alert('Un email de récupération sera envoyé à ' + email + ' (à implémenter avec le backend)');
        });
    }
});