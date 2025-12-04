-- ============================================
-- SCHEMA BASE DE DONNÉES - PLATEFORME LOCATION ÉTUDIANTS AGADIR
-- ============================================

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS plateforme_location_etudiants CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE plateforme_location_etudiants;

-- ============================================
-- TABLE: users (Utilisateurs)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20),
    nom_utilisateur VARCHAR(50) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    type_utilisateur ENUM('etudiant', 'loueur') NOT NULL DEFAULT 'etudiant',
    cin VARCHAR(20),
    cne VARCHAR(20),
    role ENUM('user', 'admin', 'administrator') NOT NULL DEFAULT 'user',
    avatar VARCHAR(500),
    suspended BOOLEAN DEFAULT FALSE,
    email_verifie BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_nom_utilisateur (nom_utilisateur),
    INDEX idx_type_utilisateur (type_utilisateur),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: annonces (Annonces de logement)
-- ============================================
CREATE TABLE IF NOT EXISTS annonces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    type ENUM('chambre', 'studio', 'appartement', 'colocation') NOT NULL,
    zone VARCHAR(100) NOT NULL,
    adresse TEXT,
    prix DECIMAL(10, 2) NOT NULL,
    surface DECIMAL(6, 2),
    nb_chambres INT DEFAULT 1,
    description TEXT NOT NULL,
    description_longue TEXT,
    meuble BOOLEAN DEFAULT FALSE,
    disponibilite VARCHAR(50),
    statut ENUM('en_attente', 'approuve', 'rejete', 'signale') DEFAULT 'en_attente',
    rating DECIMAL(3, 2) DEFAULT 0.00,
    nb_avis INT DEFAULT 0,
    vues INT DEFAULT 0,
    contacts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_zone (zone),
    INDEX idx_prix (prix),
    INDEX idx_statut (statut),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_search (titre, description, zone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: annonce_images (Images des annonces)
-- ============================================
CREATE TABLE IF NOT EXISTS annonce_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    annonce_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (annonce_id) REFERENCES annonces(id) ON DELETE CASCADE,
    INDEX idx_annonce_id (annonce_id),
    INDEX idx_image_order (image_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: annonce_equipements (Équipements des annonces)
-- ============================================
CREATE TABLE IF NOT EXISTS annonce_equipements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    annonce_id INT NOT NULL,
    equipement VARCHAR(100) NOT NULL,
    FOREIGN KEY (annonce_id) REFERENCES annonces(id) ON DELETE CASCADE,
    INDEX idx_annonce_id (annonce_id),
    INDEX idx_equipement (equipement)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: annonce_regles (Règles des annonces)
-- ============================================
CREATE TABLE IF NOT EXISTS annonce_regles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    annonce_id INT NOT NULL,
    regle VARCHAR(100) NOT NULL,
    FOREIGN KEY (annonce_id) REFERENCES annonces(id) ON DELETE CASCADE,
    INDEX idx_annonce_id (annonce_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: conversations (Conversations entre utilisateurs)
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    annonce_id INT NOT NULL,
    locataire_id INT NOT NULL,
    proprietaire_id INT NOT NULL,
    dernier_message_id INT,
    non_lu_locataire INT DEFAULT 0,
    non_lu_proprietaire INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (annonce_id) REFERENCES annonces(id) ON DELETE CASCADE,
    FOREIGN KEY (locataire_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (proprietaire_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_conversation (annonce_id, locataire_id, proprietaire_id),
    INDEX idx_annonce_id (annonce_id),
    INDEX idx_locataire_id (locataire_id),
    INDEX idx_proprietaire_id (proprietaire_id),
    INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: messages (Messages dans les conversations)
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    sujet VARCHAR(100),
    telephone VARCHAR(20),
    date_visite DATE,
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_created_at (created_at),
    INDEX idx_lu (lu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mettre à jour la référence du dernier message dans conversations
ALTER TABLE conversations 
ADD FOREIGN KEY (dernier_message_id) REFERENCES messages(id) ON DELETE SET NULL;

-- ============================================
-- TABLE: user_favorites (Favoris des utilisateurs)
-- ============================================
CREATE TABLE IF NOT EXISTS user_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    annonce_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (annonce_id) REFERENCES annonces(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, annonce_id),
    INDEX idx_user_id (user_id),
    INDEX idx_annonce_id (annonce_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: annonce_reports (Signalements d'annonces)
-- ============================================
CREATE TABLE IF NOT EXISTS annonce_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    annonce_id INT NOT NULL,
    user_id INT NOT NULL,
    reason TEXT NOT NULL,
    statut ENUM('en_attente', 'traite', 'rejete') DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (annonce_id) REFERENCES annonces(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_annonce_id (annonce_id),
    INDEX idx_user_id (user_id),
    INDEX idx_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: contact_messages (Messages de contact pour l'admin)
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    type ENUM('question', 'reclamation', 'contrainte', 'suggestion', 'annonce', 'technique', 'autre') NOT NULL,
    sujet VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    traite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_lu (lu),
    INDEX idx_traite (traite),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: user_reports (Signalements d'utilisateurs)
-- ============================================
CREATE TABLE IF NOT EXISTS user_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reported_user_id INT NOT NULL,
    reporter_user_id INT NOT NULL,
    reason TEXT NOT NULL,
    statut ENUM('en_attente', 'traite', 'rejete') DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reported_user_id (reported_user_id),
    INDEX idx_reporter_user_id (reporter_user_id),
    INDEX idx_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: annonce_avis (Avis sur les annonces)
-- ============================================
CREATE TABLE IF NOT EXISTS annonce_avis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    annonce_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    commentaire TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (annonce_id) REFERENCES annonces(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_avis (annonce_id, user_id),
    INDEX idx_annonce_id (annonce_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: password_reset_tokens (Tokens de réinitialisation de mot de passe)
-- ============================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: admin_actions (Historique des actions admin)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_type ENUM('annonce', 'user', 'message') NOT NULL,
    target_id INT NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_action_type (action_type),
    INDEX idx_target (target_type, target_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DONNÉES INITIALES (Optionnel)
-- ============================================

-- Créer un utilisateur admin par défaut
-- Mot de passe: admin123 (à changer en production!)
INSERT INTO users (
    nom, prenom, email, telephone, nom_utilisateur, mot_de_passe, 
    type_utilisateur, role, email_verifie
) VALUES (
    'Admin', 'Système', 'admin@plateforme.ma', '+212 6 00 00 00 00', 
    'admin', '$2b$10$YourHashedPasswordHere', -- À hasher avec bcrypt
    'loueur', 'admin', TRUE
) ON DUPLICATE KEY UPDATE email=email;

-- ============================================
-- VUES UTILES (Optionnel)
-- ============================================

-- Vue pour les statistiques admin
CREATE OR REPLACE VIEW v_admin_stats AS
SELECT 
    (SELECT COUNT(*) FROM annonces) as total_annonces,
    (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
    (SELECT COUNT(*) FROM messages) as total_messages,
    (SELECT COUNT(*) FROM annonces WHERE statut = 'en_attente') as annonces_en_attente,
    (SELECT COUNT(*) FROM annonces WHERE statut = 'signale') as annonces_signalees,
    (SELECT COUNT(*) FROM user_reports WHERE statut = 'en_attente') as users_signales;

-- Vue pour les annonces avec toutes les infos
CREATE OR REPLACE VIEW v_annonces_complete AS
SELECT 
    a.*,
    u.nom as proprietaire_nom,
    u.email as proprietaire_email,
    u.telephone as proprietaire_telephone,
    u.avatar as proprietaire_avatar,
    (SELECT COUNT(*) FROM annonce_images WHERE annonce_id = a.id) as nb_images
FROM annonces a
LEFT JOIN users u ON a.user_id = u.id;

-- ============================================
-- TRIGGERS UTILES
-- ============================================

-- Mettre à jour le rating moyen quand un avis est ajouté
DELIMITER //
CREATE TRIGGER update_annonce_rating AFTER INSERT ON annonce_avis
FOR EACH ROW
BEGIN
    UPDATE annonces 
    SET rating = (
        SELECT AVG(rating) 
        FROM annonce_avis 
        WHERE annonce_id = NEW.annonce_id
    ),
    nb_avis = (
        SELECT COUNT(*) 
        FROM annonce_avis 
        WHERE annonce_id = NEW.annonce_id
    )
    WHERE id = NEW.annonce_id;
END//
DELIMITER ;

-- Mettre à jour le dernier message dans la conversation
DELIMITER //
CREATE TRIGGER update_conversation_last_message AFTER INSERT ON messages
FOR EACH ROW
BEGIN
    UPDATE conversations 
    SET dernier_message_id = NEW.id,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
END//
DELIMITER ;

-- ============================================
-- FIN DU SCHÉMA
-- ============================================


