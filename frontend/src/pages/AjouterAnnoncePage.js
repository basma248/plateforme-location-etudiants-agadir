import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createAnnonce } from '../services/annonceService';
import { getToken } from '../services/authService';
import './AjouterAnnoncePage.css';

// Icônes SVG React
const IconHome = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconType = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="3" x2="9" y2="21"></line>
    <line x1="3" y1="9" x2="21" y2="9"></line>
  </svg>
);

const IconLocation = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconPrice = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const IconRuler = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21.3 8.7l-5.6-5.6c-.4-.4-1-.4-1.4 0L2.7 15.3c-.4.4-.4 1 0 1.4l5.6 5.6c.4.4 1 .4 1.4 0L21.3 10c.4-.3.4-1 0-1.3z"></path>
    <line x1="14.5" y1="9.5" x2="19.5" y2="14.5"></line>
  </svg>
);

const IconBed = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 4v16"></path>
    <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
    <path d="M2 12h18"></path>
    <path d="M6 8V4"></path>
    <path d="M6 12v4"></path>
  </svg>
);

const IconFileText = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const IconImage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
  </svg>
);

const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconUpload = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

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

  // Initialiser la progression des sections au chargement
  useEffect(() => {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
      const inputs = section.querySelectorAll('input:not([type="checkbox"]):not([type="file"]), select, textarea');
      if (inputs.length > 0) {
        const firstInput = inputs[0];
        updateSectionProgress(firstInput);
      }
    });
  }, []);

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

  // Fonction pour mettre à jour la progression de la ligne décorative
  const updateSectionProgress = (inputElement) => {
    if (!inputElement) return;
    const section = inputElement.closest('.form-section');
    if (!section) return;

    const inputs = section.querySelectorAll('input:not([type="checkbox"]):not([type="file"]), select, textarea');
    const filledInputs = Array.from(inputs).filter(input => {
      if (input.tagName === 'SELECT') {
        return input.value && input.value !== '';
      }
      if (input.tagName === 'TEXTAREA') {
        return input.value.trim() !== '';
      }
      return input.value.trim() !== '' && !input.classList.contains('error');
    });

    const progress = inputs.length > 0 ? filledInputs.length / inputs.length : 0;
    
    // Retirer toutes les classes de progression
    section.classList.remove('section-progress-0', 'section-progress-25', 'section-progress-50', 'section-progress-75', 'section-progress-100');
    
    // Ajouter la classe appropriée
    if (progress === 0) {
      section.classList.add('section-progress-0');
    } else if (progress <= 0.25) {
      section.classList.add('section-progress-25');
    } else if (progress <= 0.5) {
      section.classList.add('section-progress-50');
    } else if (progress <= 0.75) {
      section.classList.add('section-progress-75');
    } else {
      section.classList.add('section-progress-100');
    }
  };

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

    // Mettre à jour la progression de la ligne après un court délai pour laisser le DOM se mettre à jour
    setTimeout(() => {
      updateSectionProgress(e.target);
    }, 10);
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
            <div className="header-icon">
              <IconHome />
            </div>
            <h1>Publier une annonce</h1>
            <p>Remplissez le formulaire ci-dessous pour publier votre logement</p>
          </div>

          <form onSubmit={handleSubmit} className="annonce-form">
            {/* Informations de base */}
            <section className="form-section">
              <div className="section-header">
                <div className="section-number">1</div>
                <div className="section-title-content">
                  <h2>
                    <IconHome />
                    Informations de base
                  </h2>
                  <p className="section-hint">Les informations essentielles de votre logement</p>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="titre">
                  <IconFileText />
                  Titre de l'annonce *
                </label>
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
                  <label htmlFor="type">
                    <IconType />
                    Type de logement *
                  </label>
                  <div className="input-wrapper">
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
                  </div>
                  {errors.type && <span className="error-message">{errors.type}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="zone">
                    <IconLocation />
                    Zone / Quartier *
                  </label>
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
                <label htmlFor="adresse">
                  <IconLocation />
                  Adresse complète
                </label>
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
              <div className="section-header">
                <div className="section-number">2</div>
                <div className="section-title-content">
                  <h2>
                    <IconSettings />
                    Caractéristiques
                  </h2>
                  <p className="section-hint">Détails techniques et prix de votre logement</p>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prix">
                    <IconPrice />
                    Prix mensuel (MAD) *
                  </label>
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
                  <label htmlFor="surface">
                    <IconRuler />
                    Surface (m²) *
                  </label>
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
                  <label htmlFor="nbChambres">
                    <IconBed />
                    Nombre de chambres
                  </label>
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
                  <label className="checkbox-label-modern">
                    <input
                      type="checkbox"
                      name="meuble"
                      checked={formData.meuble}
                      onChange={handleInputChange}
                    />
                    <span className="checkbox-custom">
                      {formData.meuble && <IconCheck />}
                    </span>
                    <span className="checkbox-text">Logement meublé</span>
                  </label>
                </div>

                <div className="form-group">
                  <label htmlFor="disponibilite">Disponibilité</label>
                  <div className="input-wrapper">
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
              </div>
            </section>

            {/* Description */}
            <section className="form-section">
              <div className="section-header">
                <div className="section-number">3</div>
                <div className="section-title-content">
                  <h2>
                    <IconFileText />
                    Description
                  </h2>
                  <p className="section-hint">Décrivez votre logement de manière attractive</p>
                </div>
              </div>
              
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
              <div className="section-header">
                <div className="section-number">4</div>
                <div className="section-title-content">
                  <h2>
                    <IconImage />
                    Photos *
                  </h2>
                  <p className="section-hint">Ajoutez jusqu'à 10 photos depuis votre ordinateur (max 5MB chacune)</p>
                </div>
              </div>
              
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
                      <IconX />
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
                      <IconUpload />
                      <span>Ajouter des photos</span>
                      <small>{imagePreviews.length}/10</small>
                    </div>
                  </label>
                )}
              </div>
              {errors.images && <span className="error-message">{errors.images}</span>}
            </section>

            {/* Équipements */}
            <section className="form-section">
              <div className="section-header">
                <div className="section-number">5</div>
                <div className="section-title-content">
                  <h2>
                    <IconSettings />
                    Équipements
                  </h2>
                  <p className="section-hint">Sélectionnez les équipements disponibles</p>
                </div>
              </div>
              <div className="checkbox-grid">
                {equipementsList.map(equipement => (
                  <label key={equipement} className="checkbox-item-modern">
                    <input
                      type="checkbox"
                      checked={formData.equipements.includes(equipement)}
                      onChange={() => handleEquipementToggle(equipement)}
                    />
                    <span className="checkbox-custom">
                      {formData.equipements.includes(equipement) && <IconCheck />}
                    </span>
                    <span className="checkbox-text">{equipement}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Règles */}
            <section className="form-section">
              <div className="section-header">
                <div className="section-number">6</div>
                <div className="section-title-content">
                  <h2>
                    <IconShield />
                    Règles de la maison
                  </h2>
                  <p className="section-hint">Définissez les règles de votre logement</p>
                </div>
              </div>
              <div className="checkbox-grid">
                {reglesList.map(regle => (
                  <label key={regle} className="checkbox-item-modern">
                    <input
                      type="checkbox"
                      checked={formData.regles.includes(regle)}
                      onChange={() => handleRegleToggle(regle)}
                    />
                    <span className="checkbox-custom">
                      {formData.regles.includes(regle) && <IconCheck />}
                    </span>
                    <span className="checkbox-text">{regle}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section className="form-section">
              <div className="section-header">
                <div className="section-number">7</div>
                <div className="section-title-content">
                  <h2>
                    <IconUser />
                    Informations de contact
                  </h2>
                  <p className="section-hint">Comment vous contacter pour cette annonce</p>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="contact.nom">
                  <IconUser />
                  Nom complet *
                </label>
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
                  <label htmlFor="contact.telephone">
                    <IconPhone />
                    Téléphone *
                  </label>
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
                  <label htmlFor="contact.email">
                    <IconMail />
                    Email *
                  </label>
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
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Publication en cours...
                  </>
                ) : (
                  <>
                    <IconUpload />
                    Publier l'annonce
                  </>
                )}
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
