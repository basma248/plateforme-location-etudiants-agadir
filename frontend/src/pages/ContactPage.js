import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Remplacer par un vrai appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({ nom: '', email: '', sujet: '', message: '' });
    } catch (error) {
      alert('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <Navbar />
      <main className="contact-page">
        <div className="container">
          <div className="contact-header">
            <h1>Contactez-nous</h1>
            <p>Nous sommes là pour vous aider. N'hésitez pas à nous contacter !</p>
          </div>

          <div className="contact-content">
            <div className="contact-info">
              <div className="info-card">
                <div className="info-icon">📧</div>
                <h3>Email</h3>
                <p>contact@agadir-etudiants.ma</p>
                <p>support@agadir-etudiants.ma</p>
              </div>

              <div className="info-card">
                <div className="info-icon">📞</div>
                <h3>Téléphone</h3>
                <p>+212 5 28 12 34 56</p>
                <p>Lun - Ven: 9h - 18h</p>
              </div>

              <div className="info-card">
                <div className="info-icon">📍</div>
                <h3>Adresse</h3>
                <p>123 Avenue Hassan II</p>
                <p>Agadir 80000, Maroc</p>
              </div>

              <div className="info-card">
                <div className="info-icon">⏰</div>
                <h3>Horaires</h3>
                <p>Lundi - Vendredi: 9h - 18h</p>
                <p>Samedi: 10h - 16h</p>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <h2>Envoyez-nous un message</h2>
              
              {submitted ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Message envoyé !</h3>
                  <p>Nous vous répondrons dans les plus brefs délais.</p>
                  <button
                    className="btn-secondary"
                    onClick={() => setSubmitted(false)}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="nom">Nom complet *</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      placeholder="Votre nom"
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

                  <div className="form-group">
                    <label htmlFor="sujet">Sujet *</label>
                    <select
                      id="sujet"
                      name="sujet"
                      value={formData.sujet}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Sélectionner un sujet</option>
                      <option value="question">Question générale</option>
                      <option value="probleme">Problème technique</option>
                      <option value="annonce">Question sur une annonce</option>
                      <option value="partenariat">Partenariat</option>
                      <option value="autre">Autre</option>
                    </select>
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
                      placeholder="Décrivez votre demande..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="faq-section">
            <h2>Questions fréquentes</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>Comment publier une annonce ?</h3>
                <p>Cliquez sur "Publier" dans le menu, remplissez le formulaire et validez. Votre annonce sera visible après modération.</p>
              </div>
              <div className="faq-item">
                <h3>Est-ce gratuit ?</h3>
                <p>Oui, la publication d'annonces de base est gratuite pour tous les étudiants.</p>
              </div>
              <div className="faq-item">
                <h3>Comment contacter un propriétaire ?</h3>
                <p>Sur chaque annonce, cliquez sur "Contacter" pour voir les coordonnées ou utiliser la messagerie privée.</p>
              </div>
              <div className="faq-item">
                <h3>Comment signaler une annonce ?</h3>
                <p>Utilisez le bouton "Signaler" sur l'annonce ou contactez-nous directement.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ContactPage;
