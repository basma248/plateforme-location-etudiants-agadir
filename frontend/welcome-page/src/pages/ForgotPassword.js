import React from 'react';

const ForgotPassword = () => {
  return (
    <div className="forgot-password-container">
      <h2>Réinitialiser le mot de passe</h2>
      <p>Veuillez entrer votre adresse e-mail pour recevoir un lien de réinitialisation de mot de passe.</p>
      <form>
        <input
          type="email"
          placeholder="Votre adresse e-mail"
          required
        />
        <button type="submit">Envoyer le lien de réinitialisation</button>
      </form>
      <div className="back-to-login">
        <a href="/login">Retour à la connexion</a>
      </div>
    </div>
  );
};

export default ForgotPassword;