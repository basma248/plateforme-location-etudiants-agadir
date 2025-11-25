-- ============================================
-- DONNÉES D'EXEMPLE - PLATEFORME LOCATION ÉTUDIANTS
-- ============================================
-- Ce fichier contient des données d'exemple pour tester l'application
-- À utiliser uniquement en développement!

USE plateforme_location_etudiants;

-- ============================================
-- UTILISATEURS D'EXEMPLE
-- ============================================

-- Note: Les mots de passe sont "password123" hashés avec bcrypt
-- En production, utilisez des mots de passe forts!

INSERT INTO users (nom, prenom, email, telephone, nom_utilisateur, mot_de_passe, type_utilisateur, cin, cne, role, email_verifie) VALUES
('Ahmed', 'Benali', 'ahmed.benali@example.com', '+212 6 12 34 56 78', 'ahmed123', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'loueur', 'AB123456', NULL, 'user', TRUE),
('Fatima', 'Alami', 'fatima.alami@example.com', '+212 6 23 45 67 89', 'fatima123', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'loueur', 'FA234567', NULL, 'user', TRUE),
('Youssef', 'Idrissi', 'youssef.idrissi@example.com', '+212 6 34 56 78 90', 'youssef123', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'etudiant', 'YI345678', 'CNE123456', 'user', TRUE),
('Aicha', 'Tazi', 'aicha.tazi@example.com', '+212 6 45 67 89 01', 'aicha123', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'etudiant', 'AT456789', 'CNE234567', 'user', TRUE),
('Mohamed', 'Amrani', 'mohamed.amrani@example.com', '+212 6 56 78 90 12', 'mohamed123', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'etudiant', 'MA567890', 'CNE345678', 'user', TRUE)
ON DUPLICATE KEY UPDATE email=email;

-- ============================================
-- ANNONCES D'EXEMPLE
-- ============================================

INSERT INTO annonces (user_id, titre, type, zone, adresse, prix, surface, nb_chambres, description, description_longue, meuble, disponibilite, statut, rating, nb_avis) VALUES
(1, 'Chambre moderne près de l\'université', 'chambre', 'Universiapolis', 'Rue Mohammed V, Universiapolis, Agadir', 1500.00, 15.00, 1, 'Chambre spacieuse et lumineuse dans un appartement partagé. Proche de toutes les commodités et des transports.', 'Cette magnifique chambre se trouve dans un appartement moderne et bien entretenu. Elle est parfaite pour un étudiant cherchant un logement confortable et bien situé.', TRUE, 'Immédiate', 'approuve', 4.8, 24),
(1, 'Studio indépendant Founty', 'studio', 'Founty', 'Avenue Hassan II, Founty, Agadir', 2500.00, 25.00, 1, 'Studio entièrement meublé avec cuisine équipée et salle de bain privée. Idéal pour étudiant.', 'Studio moderne et fonctionnel, parfait pour un étudiant. Cuisine équipée, salle de bain privée, internet inclus.', TRUE, 'Immédiate', 'approuve', 4.9, 18),
(2, 'Appartement 2 chambres Hay Salam', 'appartement', 'Hay Salam', 'Rue Ibn Battuta, Hay Salam, Agadir', 3500.00, 60.00, 2, 'Bel appartement au 2ème étage avec balcon. Parfait pour colocation.', 'Appartement spacieux avec deux chambres, salon, cuisine équipée, et balcon. Idéal pour deux étudiants en colocation.', FALSE, 'Dans 1 mois', 'approuve', 4.7, 15),
(1, 'Colocation étudiante centre-ville', 'colocation', 'Centre-ville', 'Boulevard Mohammed V, Centre-ville, Agadir', 1200.00, 20.00, 1, 'Chambre dans colocation sympa avec 2 autres étudiants. Ambiance conviviale garantie !', 'Colocation étudiante dans un appartement moderne. Chambre individuelle, espaces communs partagés, internet inclus.', TRUE, 'Immédiate', 'approuve', 4.6, 12),
(2, 'Studio moderne avec terrasse', 'studio', 'Anza', 'Rue de la Plage, Anza, Agadir', 2800.00, 30.00, 1, 'Studio récent avec terrasse privée. Vue sur la mer. Parking disponible.', 'Studio moderne avec terrasse privée offrant une vue magnifique sur la mer. Parking privé inclus.', TRUE, 'Immédiate', 'approuve', 5.0, 8),
(1, 'Chambre dans villa étudiante', 'chambre', 'Inezgane', 'Route de Casablanca, Inezgane, Agadir', 1800.00, 18.00, 1, 'Chambre dans une belle villa avec jardin. Accès internet haut débit inclus.', 'Chambre confortable dans une villa avec jardin. Espaces communs spacieux, calme et sécurité.', TRUE, 'Immédiate', 'en_attente', 0.0, 0)
ON DUPLICATE KEY UPDATE titre=titre;

-- ============================================
-- IMAGES D'EXEMPLE
-- ============================================

INSERT INTO annonce_images (annonce_id, image_url, image_order) VALUES
(1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 1),
(1, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', 2),
(2, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 1),
(3, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800', 1),
(4, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e8?w=800', 1),
(5, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 1),
(6, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', 1)
ON DUPLICATE KEY UPDATE image_url=image_url;

-- ============================================
-- ÉQUIPEMENTS D'EXEMPLE
-- ============================================

INSERT INTO annonce_equipements (annonce_id, equipement) VALUES
(1, 'Wi-Fi'),
(1, 'Chauffage'),
(1, 'Lave-linge'),
(1, 'Parking'),
(1, 'Ascenseur'),
(2, 'Wi-Fi'),
(2, 'Climatisation'),
(2, 'Lave-vaisselle'),
(2, 'Parking'),
(3, 'Wi-Fi'),
(3, 'Chauffage'),
(3, 'Lave-linge'),
(3, 'Balcon'),
(4, 'Wi-Fi'),
(4, 'Chauffage'),
(5, 'Wi-Fi'),
(5, 'Climatisation'),
(5, 'Parking'),
(5, 'Terrasse'),
(6, 'Wi-Fi'),
(6, 'Jardin')
ON DUPLICATE KEY UPDATE equipement=equipement;

-- ============================================
-- RÈGLES D'EXEMPLE
-- ============================================

INSERT INTO annonce_regles (annonce_id, regle) VALUES
(1, 'Non-fumeur'),
(1, 'Animaux non autorisés'),
(1, 'Pas de fêtes'),
(2, 'Non-fumeur'),
(2, 'Étudiants uniquement'),
(3, 'Non-fumeur'),
(3, 'Animaux autorisés'),
(4, 'Non-fumeur'),
(4, 'Étudiants uniquement'),
(5, 'Non-fumeur'),
(6, 'Non-fumeur'),
(6, 'Animaux non autorisés')
ON DUPLICATE KEY UPDATE regle=regle;

-- ============================================
-- CONVERSATIONS D'EXEMPLE
-- ============================================

INSERT INTO conversations (annonce_id, locataire_id, proprietaire_id, non_lu_locataire, non_lu_proprietaire) VALUES
(1, 3, 1, 0, 2),
(2, 4, 1, 1, 0),
(3, 5, 2, 0, 0)
ON DUPLICATE KEY UPDATE annonce_id=annonce_id;

-- ============================================
-- MESSAGES D'EXEMPLE
-- ============================================

INSERT INTO messages (conversation_id, sender_id, content, sujet, telephone, date_visite, lu) VALUES
(1, 3, 'Bonjour, je suis intéressé(e) par votre annonce. Quand serait-il possible de visiter ?', 'visite', '+212 6 34 56 78 90', '2024-02-15', TRUE),
(1, 1, 'Bonjour ! Merci pour votre intérêt. La chambre est toujours disponible. Souhaitez-vous organiser une visite ?', NULL, NULL, NULL, FALSE),
(1, 3, 'Oui, je serais disponible ce weekend. Est-ce que samedi après-midi vous conviendrait ?', NULL, NULL, NULL, FALSE),
(2, 4, 'Bonjour, je cherche un studio pour la rentrée. Votre annonce m\'intéresse beaucoup.', 'interesse', '+212 6 45 67 89 01', NULL, TRUE),
(2, 1, 'Merci pour votre message. Le studio est disponible immédiatement. Souhaitez-vous plus d\'informations ?', NULL, NULL, NULL, FALSE)
ON DUPLICATE KEY UPDATE content=content;

-- Mettre à jour les derniers messages dans les conversations
UPDATE conversations SET dernier_message_id = (SELECT MAX(id) FROM messages WHERE conversation_id = conversations.id);

-- ============================================
-- AVIS D'EXEMPLE
-- ============================================

INSERT INTO annonce_avis (annonce_id, user_id, rating, commentaire) VALUES
(1, 3, 5, 'Excellent logement, très bien situé et propriétaire très sympa !'),
(1, 4, 4, 'Très bon rapport qualité-prix. Je recommande !'),
(2, 5, 5, 'Studio parfait pour un étudiant, tout est fourni.'),
(3, 3, 4, 'Bel appartement, un peu cher mais ça vaut le coup.')
ON DUPLICATE KEY UPDATE rating=rating;

-- ============================================
-- FAVORIS D'EXEMPLE
-- ============================================

INSERT INTO user_favorites (user_id, annonce_id) VALUES
(3, 1),
(3, 2),
(4, 1),
(4, 5),
(5, 3)
ON DUPLICATE KEY UPDATE user_id=user_id;

-- ============================================
-- FIN DES DONNÉES D'EXEMPLE
-- ============================================


