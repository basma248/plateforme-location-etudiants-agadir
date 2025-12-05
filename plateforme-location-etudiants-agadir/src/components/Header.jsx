import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Assuming you have a CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Darna Agadir</h1>
      </div>
      <nav className="navigation">
        <ul>
          <li>
            <Link to="/login">Se connecter</Link>
          </li>
          <li>
            <Link to="/register">Créer un compte</Link>
          </li>
          <li>
            <Link to="/forgot-password">Mot de passe oublié</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;