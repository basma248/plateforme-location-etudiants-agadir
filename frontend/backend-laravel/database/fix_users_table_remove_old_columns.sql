-- Script SQL pour supprimer les colonnes par défaut de Laravel qui ne sont plus utilisées
-- Exécutez ce script directement dans MySQL

-- Supprimer la colonne 'name' si elle existe
ALTER TABLE `users` DROP COLUMN IF EXISTS `name`;

-- Supprimer la colonne 'password' si elle existe (remplacée par 'mot_de_passe')
ALTER TABLE `users` DROP COLUMN IF EXISTS `password`;

-- Si MySQL ne supporte pas IF EXISTS, utilisez cette version:
/*
ALTER TABLE `users` DROP COLUMN `name`;
ALTER TABLE `users` DROP COLUMN `password`;
*/

