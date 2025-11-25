import React from "react";
import { Link, NavLink } from "react-router-dom";
import { isAdmin } from "../services/authService";

function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [isUserAdmin, setIsUserAdmin] = React.useState(false);

  React.useEffect(() => {
    setIsUserAdmin(isAdmin());
  }, []);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/home" className="navbar__brand" onClick={close}>
          <span className="navbar__logo" aria-hidden>🎓</span>
          <span className="navbar__title">Agadir Étudiants</span>
        </Link>

        <button className="navbar__toggle" aria-label="Menu" aria-expanded={open} onClick={toggle}>
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        <nav className={`navbar__nav ${open ? "is-open" : ""}`}>
          <ul className="navbar__list" onClick={close}>
            <li><NavLink to="/home" end className={({ isActive }) => isActive ? "active" : undefined}>Accueil</NavLink></li>
            <li><NavLink to="/logements" className={({ isActive }) => isActive ? "active" : undefined}>Logements</NavLink></li>
            <li><NavLink to="/colocation" className={({ isActive }) => isActive ? "active" : undefined}>Colocation</NavLink></li>
            <li><NavLink to="/a-propos" className={({ isActive }) => isActive ? "active" : undefined}>À propos</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : undefined}>Contact</NavLink></li>
          </ul>

          <div className="navbar__actions" onClick={close}>
            <NavLink to="/login" className="btn btn--light">Se connecter / S'inscrire</NavLink>
            <NavLink to="/messages" className="btn btn--light">💬 Messages</NavLink>
            <NavLink to="/ajouter-annonce" className="btn btn--primary">Publier</NavLink>
            <NavLink to="/profil" className="btn btn--light">Profil</NavLink>
            {isUserAdmin && (
              <NavLink to="/admin" className="btn btn--dark btn--ghost">Admin</NavLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
