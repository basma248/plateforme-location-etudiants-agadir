import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { isAdmin, isAuthenticated, getCurrentUser, logout } from "../services/authService";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsUserAdmin(isAdmin());
    setIsLoggedIn(isAuthenticated());
    setUser(getCurrentUser());

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUser(null);
    setIsUserAdmin(false);
    navigate('/home');
    close();
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/home" className="navbar__brand" onClick={close}>
          <div className="navbar__logo-wrapper">
            <span className="navbar__logo" aria-hidden>🏠</span>
            <div className="navbar__brand-text">
              <span className="navbar__title">Darna Agadir</span>
              <span className="navbar__subtitle">Logements Étudiants</span>
            </div>
          </div>
        </Link>

        <button 
          className={`navbar__toggle ${open ? 'is-active' : ''}`} 
          aria-label="Menu" 
          aria-expanded={open} 
          onClick={toggle}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        <nav className={`navbar__nav ${open ? "is-open" : ""}`}>
          <ul className="navbar__list" onClick={close}>
            <li>
              <NavLink to="/home" end className={({ isActive }) => isActive ? "active" : undefined}>
                Accueil
              </NavLink>
            </li>
            <li>
              <NavLink to="/logements" className={({ isActive }) => isActive ? "active" : undefined}>
                Logements
              </NavLink>
            </li>
            <li>
              <NavLink to="/colocation" className={({ isActive }) => isActive ? "active" : undefined}>
                Colocation
              </NavLink>
            </li>
            <li>
              <NavLink to="/a-propos" className={({ isActive }) => isActive ? "active" : undefined}>
                À propos
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : undefined}>
                Contact
              </NavLink>
            </li>
          </ul>

          <div className="navbar__actions" onClick={close}>
            {isLoggedIn ? (
              <>
                <NavLink to="/messages" className="btn btn--icon" title="Messages">
                  💬
                </NavLink>
                <NavLink to="/favoris" className="btn btn--icon" title="Favoris">
                  ❤️
                </NavLink>
                <NavLink to="/ajouter-annonce" className="btn btn--primary">
                  📝 Publier
                </NavLink>
                <NavLink to="/profil" className="btn btn--light">
                  👤 {user?.prenom || 'Profil'}
                </NavLink>
                {isUserAdmin && (
                  <NavLink to="/admin" className="btn btn--admin">
                    ⚙️ Admin
                  </NavLink>
                )}
                <button onClick={handleLogout} className="btn btn--outline">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn--light">
                  Se connecter
                </NavLink>
                <NavLink to="/register" className="btn btn--primary">
                  S'inscrire
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
