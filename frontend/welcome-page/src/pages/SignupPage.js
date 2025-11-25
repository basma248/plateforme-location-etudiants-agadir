export default function SignupPage() {
  return (
    <div className="signup-page">
      <h2>Créer un compte</h2>
      <form>
        <div>
          <label htmlFor="username">Nom d'utilisateur:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Mot de passe:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}