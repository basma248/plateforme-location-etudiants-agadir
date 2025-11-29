-- Script SQL pour ajouter les colonnes manquantes à la table users
-- Exécutez ce script directement dans MySQL si la migration ne fonctionne pas

ALTER TABLE `users` 
ADD COLUMN IF NOT EXISTS `nom` VARCHAR(100) NULL AFTER `id`,
ADD COLUMN IF NOT EXISTS `prenom` VARCHAR(100) NULL AFTER `nom`,
ADD COLUMN IF NOT EXISTS `nom_utilisateur` VARCHAR(100) NULL UNIQUE AFTER `prenom`,
ADD COLUMN IF NOT EXISTS `telephone` VARCHAR(20) NULL AFTER `email`,
ADD COLUMN IF NOT EXISTS `mot_de_passe` VARCHAR(255) NULL AFTER `telephone`,
ADD COLUMN IF NOT EXISTS `type_utilisateur` ENUM('etudiant', 'loueur') NULL AFTER `mot_de_passe`,
ADD COLUMN IF NOT EXISTS `cin` VARCHAR(20) NULL AFTER `type_utilisateur`,
ADD COLUMN IF NOT EXISTS `cne` VARCHAR(20) NULL AFTER `cin`,
ADD COLUMN IF NOT EXISTS `role` ENUM('user', 'admin', 'administrator') DEFAULT 'user' AFTER `cne`,
ADD COLUMN IF NOT EXISTS `avatar` VARCHAR(255) NULL AFTER `role`,
ADD COLUMN IF NOT EXISTS `suspended` BOOLEAN DEFAULT FALSE AFTER `avatar`,
ADD COLUMN IF NOT EXISTS `email_verifie` BOOLEAN DEFAULT FALSE AFTER `suspended`;

-- Si MySQL ne supporte pas IF NOT EXISTS, utilisez cette version:
/*
ALTER TABLE `users` 
ADD COLUMN `nom` VARCHAR(100) NULL AFTER `id`,
ADD COLUMN `prenom` VARCHAR(100) NULL AFTER `nom`,
ADD COLUMN `nom_utilisateur` VARCHAR(100) NULL UNIQUE AFTER `prenom`,
ADD COLUMN `telephone` VARCHAR(20) NULL AFTER `email`,
ADD COLUMN `mot_de_passe` VARCHAR(255) NULL AFTER `telephone`,
ADD COLUMN `type_utilisateur` ENUM('etudiant', 'loueur') NULL AFTER `mot_de_passe`,
ADD COLUMN `cin` VARCHAR(20) NULL AFTER `type_utilisateur`,
ADD COLUMN `cne` VARCHAR(20) NULL AFTER `cin`,
ADD COLUMN `role` ENUM('user', 'admin', 'administrator') DEFAULT 'user' AFTER `cne`,
ADD COLUMN `avatar` VARCHAR(255) NULL AFTER `role`,
ADD COLUMN `suspended` BOOLEAN DEFAULT FALSE AFTER `avatar`,
ADD COLUMN `email_verifie` BOOLEAN DEFAULT FALSE AFTER `suspended`;
*/

