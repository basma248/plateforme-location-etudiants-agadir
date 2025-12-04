import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { isAdmin, isAuthenticated, getCurrentUser, logout } from "../services/authService";
import "./Navbar.css";

// Icônes SVG React
const IconHome = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconMessageCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const IconHeart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const IconEdit = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
  </svg>
);

const IconLogOut = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

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
      <div className="navbar__inner">
        <Link to="/home" className="navbar__brand" onClick={close}>
          <div className="navbar__logo-wrapper">
            <div className="navbar__logo">
              <IconHome />
            </div>
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
                  <IconMessageCircle />
                </NavLink>
                <NavLink to="/favoris" className="btn btn--icon" title="Favoris">
                  <IconHeart />
                </NavLink>
                <NavLink to="/ajouter-annonce" className="btn btn--primary">
                  <IconEdit />
                  <span>Publier</span>
                </NavLink>
                <NavLink to="/profil" className="btn btn--light" title={user?.prenom || 'Profil'}>
                  <IconUser />
                  <span>{user?.prenom ? (user.prenom.length > 8 ? user.prenom.substring(0, 8) + '...' : user.prenom) : 'Profil'}</span>
                </NavLink>
                {isUserAdmin && (
                  <NavLink to="/admin" className="btn btn--admin">
                    <IconSettings />
                    <span>Admin</span>
                  </NavLink>
                )}
                <button onClick={handleLogout} className="btn btn--outline">
                  <IconLogOut />
                  <span>Déconnexion</span>
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
