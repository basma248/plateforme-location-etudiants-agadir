import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AproposPage.css';

function AproposPage() {
  return (
    <div className="apropos-wrapper">
      <Navbar />
      <main className="apropos-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <h1>À propos de nous</h1>
            <p className="hero-subtitle">
              La plateforme de référence pour trouver un logement étudiant à Agadir
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="content-section">
          <div className="container">
            <div className="section-content">
              <div className="content-text">
                <h2>Notre mission</h2>
                <p>
                  Agadir Étudiants a été créé pour faciliter la recherche de logement 
                  pour les étudiants à Agadir. Nous comprenons les défis auxquels font 
                  face les étudiants lorsqu'ils arrivent dans une nouvelle ville pour 
                  poursuivre leurs études.
                </p>
                <p>
                  Notre objectif est de créer une plateforme sécurisée, facile à utiliser 
                  et entièrement gratuite qui connecte les étudiants avec des propriétaires 
                  de confiance et des colocataires compatibles.
                </p>
              </div>
              <div className="content-image">
                <div className="image-placeholder">
                  <span className="emoji">🎓</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Valeurs */}
        <section className="content-section section-alt">
          <div className="container">
            <h2 className="section-title">Nos valeurs</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🔒</div>
                <h3>Sécurité</h3>
                <p>
                  Nous vérifions les annonces et modérons le contenu pour garantir 
                  une expérience sécurisée pour tous.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">🆓</div>
                <h3>Gratuité</h3>
                <p>
                  Notre service est entièrement gratuit pour les étudiants. 
                  Pas de frais cachés, pas d'abonnement.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3>Communauté</h3>
                <p>
                  Nous favorisons une communauté étudiante solidaire où chacun 
                  peut trouver sa place.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">⚡</div>
                <h3>Efficacité</h3>
                <p>
                  Des outils de recherche avancés et des filtres intelligents 
                  pour trouver rapidement le logement idéal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistiques */}
        <section className="stats-section">
          <div className="container">
            <h2 className="section-title">En chiffres</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Annonces actives</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">2000+</div>
                <div className="stat-label">Étudiants inscrits</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">150+</div>
                <div className="stat-label">Logements trouvés</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="content-section">
          <div className="container">
            <h2 className="section-title">Comment ça marche ?</h2>
            <div className="steps-grid">
              <div className="step-item">
                <div className="step-number">1</div>
                <h3>Créez un compte</h3>
                <p>
                  Inscrivez-vous gratuitement en quelques clics. 
                  C'est simple, rapide et sécurisé.
                </p>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <h3>Recherchez</h3>
                <p>
                  Utilisez nos filtres avancés pour trouver le logement 
                  qui correspond à vos critères et votre budget.
                </p>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <h3>Contactez</h3>
                <p>
                  Contactez directement les propriétaires via notre 
                  messagerie privée ou leurs coordonnées.
                </p>
              </div>
              <div className="step-item">
                <div className="step-number">4</div>
                <h3>Visitez</h3>
                <p>
                  Organisez une visite et trouvez votre nouveau chez-vous 
                  en toute simplicité.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Équipe */}
        <section className="content-section section-alt">
          <div className="container">
            <h2 className="section-title">Notre équipe</h2>
            <p className="section-description">
              Une équipe passionnée dédiée à améliorer l'expérience des étudiants à Agadir.
            </p>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-avatar">👨‍💼</div>
                <h3>Ahmed Benali</h3>
                <p className="member-role">Fondateur & CEO</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">👩‍💻</div>
                <h3>Fatima Alami</h3>
                <p className="member-role">Développeuse</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">👨‍🎓</div>
                <h3>Youssef Idrissi</h3>
                <p className="member-role">Support Étudiants</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <h2>Prêt à commencer ?</h2>
            <p>Rejoignez notre communauté et trouvez votre logement idéal</p>
            <div className="cta-buttons">
              <Link to="/home" className="btn-primary">
                Voir les annonces
              </Link>
              <Link to="/ajouter-annonce" className="btn-secondary">
                Publier une annonce
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AproposPage;
