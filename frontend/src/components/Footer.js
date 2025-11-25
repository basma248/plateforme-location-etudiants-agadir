import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="logo" aria-hidden>🎓</div>
          <div>
            <strong>Agadir Étudiants</strong>
            <p>Logements, colocations et annonces pour étudiants à Agadir.</p>
          </div>
        </div>

        <div className="footer__cols">
          <div>
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/home">Accueil</Link></li>
              <li><Link to="/logements">Logements</Link></li>
              <li><Link to="/colocation">Colocation</Link></li>
              <li><Link to="/ajouter-annonce">Publier</Link></li>
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/a-propos">À propos</Link></li>
              <li><a href="#" onClick={(e)=>e.preventDefault()}>Confidentialité</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer__bar">
        <div className="container footer__bar__inner">
          <small>© {new Date().getFullYear()} Agadir Étudiants. Tous droits réservés.</small>
          <div className="footer__socials">
            <a href="#" aria-label="Facebook" onClick={(e)=>e.preventDefault()}>📘</a>
            <a href="#" aria-label="Instagram" onClick={(e)=>e.preventDefault()}>📸</a>
            <a href="#" aria-label="Twitter" onClick={(e)=>e.preventDefault()}>🐦</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
