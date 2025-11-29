import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createAnnonce } from '../services/annonceService';
import { getToken } from '../services/authService';
import './AjouterAnnoncePage.css';

function AjouterAnnoncePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titre: '',
    type: '',
    zone: '',
    adresse: '',
    prix: '',
    surface: '',
    nbChambres: '',
    description: '',
    descriptionLongue: '',
    meuble: false,
    disponibilite: '',
    equipements: [],
    regles: [],
    contact: {
      nom: '',
      telephone: '',
      email: ''
    }
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const equipementsList = [
    'Wi-Fi', 'Chauffage', 'Climatisation', 'Lave-linge', 'Lave-vaisselle',
    'Parking', 'Ascenseur', 'Balcon', 'Terrasse', 'Jardin', 'Piscine',
    'Salle de sport', 'Sécurité', 'Internet fibre'
  ];

  const reglesList = [
    'Non-fumeur', 'Animaux autorisés', 'Animaux non autorisés',
    'Pas de fêtes', 'Pas de visiteurs', 'Étudiants uniquement',
    'Filles uniquement', 'Garçons uniquement'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 10) {
      alert('Vous ne pouvez ajouter que 10 photos maximum');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`L'image ${file.name} est trop grande (max 5MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, file]);
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleEquipementToggle = (equipement) => {
    setFormData(prev => ({
      ...prev,
      equipements: prev.equipements.includes(equipement)
        ? prev.equipements.filter(e => e !== equipement)
        : [...prev.equipements, equipement]
    }));
  };

  const handleRegleToggle = (regle) => {
    setFormData(prev => ({
      ...prev,
      regles: prev.regles.includes(regle)
        ? prev.regles.filter(r => r !== regle)
        : [...prev.regles, regle]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titre.trim()) newErrors.titre = 'Le titre est requis';
    if (!formData.type) newErrors.type = 'Le type de logement est requis';
    if (!formData.zone.trim()) newErrors.zone = 'La zone est requise';
    if (!formData.prix || formData.prix <= 0) newErrors.prix = 'Le prix est requis';
    if (!formData.surface || formData.surface <= 0) newErrors.surface = 'La surface est requise';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (images.length === 0) newErrors.images = 'Au moins une photo est requise';
    if (!formData.contact.nom.trim()) newErrors['contact.nom'] = 'Le nom est requis';
    if (!formData.contact.telephone.trim()) newErrors['contact.telephone'] = 'Le téléphone est requis';
    if (!formData.contact.email.trim()) newErrors['contact.email'] = 'L\'email est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoading(true);

    try {
      const token = getToken();
      if (!token) {
        alert('Vous devez être connecté pour publier une annonce');
        navigate('/login');
        return;
      }

      // Préparer les données pour l'API
      // Récupérer les fichiers uploadés (pas les base64)
      const imageFilesToUpload = images.filter(img => img instanceof File);
      
      console.log('Images à envoyer:', {
        fichiers: imageFilesToUpload.length,
        totalPreviews: imagePreviews.length,
        totalFiles: images.length
      });

      // S'assurer que meuble est un booléen
      const meubleValue = formData.meuble === true || formData.meuble === 'true' || formData.meuble === 1 || formData.meuble === '1';
      
      const annonceData = {
        titre: formData.titre,
        type: formData.type,
        zone: formData.zone,
        adresse: formData.adresse || '',
        prix: parseFloat(formData.prix),
        surface: formData.surface ? parseFloat(formData.surface) : null,
        nbChambres: parseInt(formData.nbChambres) || 1,
        description: formData.description,
        descriptionLongue: formData.descriptionLongue || '',
        meuble: meubleValue, // Booléen
        disponibilite: formData.disponibilite || '',
        equipements: formData.equipements || [],
        regles: formData.regles || []
      };
      
      console.log('Données de l\'annonce:', {
        ...annonceData,
        meuble: annonceData.meuble,
        meubleType: typeof annonceData.meuble
      });

      // Envoyer avec les fichiers uploadés
      await createAnnonce(annonceData, token, imageFilesToUpload.length > 0 ? imageFilesToUpload : null);
      
      alert('Annonce publiée avec succès ! Elle sera visible après validation par l\'administrateur.');
      navigate('/home');
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      const errorMessage = error.message || 'Erreur inconnue';
      alert('Une erreur est survenue lors de la publication: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ajouter-annonce-wrapper">
      <Navbar />
      <main className="ajouter-annonce-page">
        <div className="container">
          <div className="page-header">
            <h1>Publier une annonce</h1>
            <p>Remplissez le formulaire ci-dessous pour publier votre logement</p>
          </div>

          <form onSubmit={handleSubmit} className="annonce-form">
            {/* Informations de base */}
            <section className="form-section">
              <h2>Informations de base</h2>
              
              <div className="form-group">
                <label htmlFor="titre">Titre de l'annonce *</label>
                <input
                  type="text"
                  id="titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange}
                  placeholder="Ex: Chambre moderne près de l'université"
                  className={errors.titre ? 'error' : ''}
                />
                {errors.titre && <span className="error-message">{errors.titre}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">Type de logement *</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={errors.type ? 'error' : ''}
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="chambre">Chambre</option>
                    <option value="studio">Studio</option>
                    <option value="appartement">Appartement</option>
                    <option value="colocation">Colocation</option>
                  </select>
                  {errors.type && <span className="error-message">{errors.type}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="zone">Zone / Quartier *</label>
                  <input
                    type="text"
                    id="zone"
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    placeholder="Ex: Universiapolis, Founty..."
                    className={errors.zone ? 'error' : ''}
                  />
                  {errors.zone && <span className="error-message">{errors.zone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="adresse">Adresse complète</label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  placeholder="Rue, numéro, quartier..."
                />
              </div>
            </section>

            {/* Caractéristiques */}
            <section className="form-section">
              <h2>Caractéristiques</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prix">Prix mensuel (MAD) *</label>
                  <input
                    type="number"
                    id="prix"
                    name="prix"
                    value={formData.prix}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="1500"
                    className={errors.prix ? 'error' : ''}
                  />
                  {errors.prix && <span className="error-message">{errors.prix}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="surface">Surface (m²) *</label>
                  <input
                    type="number"
                    id="surface"
                    name="surface"
                    value={formData.surface}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="15"
                    className={errors.surface ? 'error' : ''}
                  />
                  {errors.surface && <span className="error-message">{errors.surface}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="nbChambres">Nombre de chambres</label>
                  <input
                    type="number"
                    id="nbChambres"
                    name="nbChambres"
                    value={formData.nbChambres}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="meuble"
                      checked={formData.meuble}
                      onChange={handleInputChange}
                    />
                    <span>Logement meublé</span>
                  </label>
                </div>

                <div className="form-group">
                  <label htmlFor="disponibilite">Disponibilité</label>
                  <select
                    id="disponibilite"
                    name="disponibilite"
                    value={formData.disponibilite}
                    onChange={handleInputChange}
                  >
                    <option value="">Sélectionner</option>
                    <option value="immediate">Immédiate</option>
                    <option value="1mois">Dans 1 mois</option>
                    <option value="2mois">Dans 2 mois</option>
                    <option value="3mois">Dans 3 mois</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="form-section">
              <h2>Description</h2>
              
              <div className="form-group">
                <label htmlFor="description">Description courte *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Description brève qui apparaîtra dans la liste..."
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="descriptionLongue">Description détaillée</label>
                <textarea
                  id="descriptionLongue"
                  name="descriptionLongue"
                  value={formData.descriptionLongue}
                  onChange={handleInputChange}
                  rows="6"
                  placeholder="Décrivez en détail votre logement, ses avantages, l'environnement..."
                />
              </div>
            </section>

            {/* Photos */}
            <section className="form-section">
              <h2>Photos *</h2>
              <p className="section-hint">Ajoutez jusqu'à 10 photos depuis votre ordinateur (max 5MB chacune)</p>
              
              <div className="images-upload">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                      aria-label="Supprimer l'image"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {imagePreviews.length < 10 && (
                  <label className="upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <div className="upload-content">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>Ajouter des photos</span>
                    </div>
                  </label>
                )}
              </div>
              {errors.images && <span className="error-message">{errors.images}</span>}
            </section>

            {/* Équipements */}
            <section className="form-section">
              <h2>Équipements</h2>
              <div className="checkbox-grid">
                {equipementsList.map(equipement => (
                  <label key={equipement} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.equipements.includes(equipement)}
                      onChange={() => handleEquipementToggle(equipement)}
                    />
                    <span>{equipement}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Règles */}
            <section className="form-section">
              <h2>Règles de la maison</h2>
              <div className="checkbox-grid">
                {reglesList.map(regle => (
                  <label key={regle} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.regles.includes(regle)}
                      onChange={() => handleRegleToggle(regle)}
                    />
                    <span>{regle}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section className="form-section">
              <h2>Informations de contact</h2>
              
              <div className="form-group">
                <label htmlFor="contact.nom">Nom complet *</label>
                <input
                  type="text"
                  id="contact.nom"
                  name="contact.nom"
                  value={formData.contact.nom}
                  onChange={handleInputChange}
                  placeholder="Votre nom"
                  className={errors['contact.nom'] ? 'error' : ''}
                />
                {errors['contact.nom'] && <span className="error-message">{errors['contact.nom']}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact.telephone">Téléphone *</label>
                  <input
                    type="tel"
                    id="contact.telephone"
                    name="contact.telephone"
                    value={formData.contact.telephone}
                    onChange={handleInputChange}
                    placeholder="+212 6 12 34 56 78"
                    className={errors['contact.telephone'] ? 'error' : ''}
                  />
                  {errors['contact.telephone'] && <span className="error-message">{errors['contact.telephone']}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="contact.email">Email *</label>
                  <input
                    type="email"
                    id="contact.email"
                    name="contact.email"
                    value={formData.contact.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    className={errors['contact.email'] ? 'error' : ''}
                  />
                  {errors['contact.email'] && <span className="error-message">{errors['contact.email']}</span>}
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate('/home')}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Publication en cours...' : 'Publier l\'annonce'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AjouterAnnoncePage;
