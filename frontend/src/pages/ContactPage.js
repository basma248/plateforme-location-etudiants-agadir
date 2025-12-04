import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ContactPage.css';

// Utilisez /api pour le proxy
const API_BASE_URL = '/api';

function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    type: '',
    sujet: '',
    message: '',
    telephone: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Vérifier le type de contenu de la réponse
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Réponse non-JSON reçue:', text);
        throw new Error(`Réponse invalide du serveur. Attendu JSON, reçu: ${contentType || 'texte'}. Vérifiez que le serveur Laravel est démarré sur http://localhost:8000`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSubmitted(true);
        setFormData({ nom: '', email: '', type: '', sujet: '', message: '', telephone: '' });
      } else {
        throw new Error(result.message || 'Une erreur est survenue lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      // Gestion spécifique des erreurs de réseau
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Impossible de se connecter au serveur. Vérifiez que le serveur backend est démarré sur http://localhost:8000');
      } else {
        setError(error.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <Navbar />
      <main className="contact-page">
        <div className="contact-hero">
          <div className="contact-container">
            <div className="contact-hero-content">
              <h1 className="contact-hero-title">Contactez-nous</h1>
              <p className="contact-hero-description">
                Nous sommes là pour vous aider. Envoyez-nous vos questions, réclamations ou suggestions.
              </p>
            </div>
          </div>
        </div>

        <div className="contact-container">
          <div className="contact-content">
            <div className="contact-info-section">
              <div className="info-section-header">
                <h2>Informations de contact</h2>
                <p>Plusieurs façons de nous joindre</p>
              </div>

              <div className="contact-info-grid">
                <div className="info-card">
                  <div className="info-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <h3>Email</h3>
                  <p>contact@agadir-etudiants.ma</p>
                  <p>support@agadir-etudiants.ma</p>
                </div>

                <div className="info-card">
                  <div className="info-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <h3>Téléphone</h3>
                  <p>+212 5 28 12 34 56</p>
                  <p>Lun - Ven: 9h - 18h</p>
                </div>

                <div className="info-card">
                  <div className="info-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <h3>Adresse</h3>
                  <p>123 Avenue Hassan II</p>
                  <p>Agadir 80000, Maroc</p>
                </div>

                <div className="info-card">
                  <div className="info-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <h3>Horaires</h3>
                  <p>Lundi - Vendredi: 9h - 18h</p>
                  <p>Samedi: 10h - 16h</p>
                </div>
              </div>
            </div>

            <div className="contact-form-section">
              <div className="form-header">
                <h2>Envoyez-nous un message</h2>
                <p>Remplissez le formulaire ci-dessous et nous vous répondrons rapidement</p>
              </div>

              {submitted ? (
                <div className="success-message">
                  <div className="success-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3>Message envoyé avec succès !</h3>
                  <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
                  <button
                    className="btn-secondary"
                    onClick={() => setSubmitted(false)}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  {error && (
                    <div className="error-message">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="nom">Nom complet *</label>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        required
                        placeholder="Votre nom complet"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="telephone">Téléphone</label>
                      <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        placeholder="+212 6 12 34 56 78"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="type">Type de demande *</label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Sélectionner un type</option>
                        <option value="question">Question générale</option>
                        <option value="reclamation">Réclamation</option>
                        <option value="contrainte">Contrainte / Problème</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="annonce">Question sur une annonce</option>
                        <option value="technique">Problème technique</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="sujet">Sujet *</label>
                    <input
                      type="text"
                      id="sujet"
                      name="sujet"
                      value={formData.sujet}
                      onChange={handleInputChange}
                      required
                      placeholder="Résumé de votre demande"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="6"
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <span>Envoyer le message</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M17.5 2.5L8.75 11.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17.5 2.5L12.5 17.5L8.75 11.25L2.5 7.5L17.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ContactPage;
