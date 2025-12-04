# RAPPORT DE PROJET
## Plateforme de Location de Logements pour Étudiants - Darna Agadir

---

## TABLE DES MATIÈRES

1. [Introduction](#1-introduction)
2. [Description du Projet](#2-description-du-projet)
3. [Objectifs](#3-objectifs)
4. [Architecture Technique](#4-architecture-technique)
5. [Technologies Utilisées](#5-technologies-utilisées)
6. [Structure du Projet](#6-structure-du-projet)
7. [Fonctionnalités](#7-fonctionnalités)
8. [Base de Données](#8-base-de-données)
9. [API REST](#9-api-rest)
10. [Interface Utilisateur](#10-interface-utilisateur)
11. [Sécurité](#11-sécurité)
12. [Installation et Déploiement](#12-installation-et-déploiement)
13. [Conclusion](#13-conclusion)

---

## 1. INTRODUCTION

Ce rapport présente le développement d'une plateforme web complète dédiée à la location de logements pour étudiants à Agadir, nommée **"Darna Agadir"**. Cette application permet de faciliter la recherche et la mise en location de logements étudiants, ainsi que la recherche de colocataires.

Le projet a été développé en utilisant une architecture moderne basée sur une séparation frontend/backend, permettant une meilleure maintenabilité et évolutivité.

---

## 2. DESCRIPTION DU PROJET

**Darna Agadir** est une plateforme web complète qui connecte les étudiants à la recherche de logements avec les propriétaires et les colocataires potentiels. L'application offre une interface intuitive et moderne pour :

- La recherche et la consultation d'annonces de logements
- La publication d'annonces de location
- La recherche de colocataires
- La communication entre utilisateurs via un système de messagerie
- La gestion de profil utilisateur
- L'administration de la plateforme

---

## 3. OBJECTIFS

### 3.1 Objectifs Principaux

- **Faciliter l'accès au logement** : Rendre la recherche de logement simple, rapide et efficace pour tous les étudiants d'Agadir
- **Construire une communauté** : Créer un réseau solidaire d'étudiants et de propriétaires
- **Garantir la sécurité** : Assurer un environnement sécurisé avec vérification des annonces et modération du contenu

### 3.2 Objectifs Techniques

- Développer une application web moderne et responsive
- Implémenter une API REST sécurisée
- Assurer une expérience utilisateur optimale
- Mettre en place un système d'authentification robuste
- Gérer efficacement les données et les fichiers multimédias

---

## 4. ARCHITECTURE TECHNIQUE

### 4.1 Architecture Générale

L'application suit une architecture **client-serveur** avec séparation claire des responsabilités :

```
┌─────────────────────────────────────────┐
│         FRONTEND (React)                │
│  - Interface utilisateur                │
│  - Gestion d'état                       │
│  - Routage                              │
└──────────────┬──────────────────────────┘
               │ HTTP/HTTPS
               │ API REST
┌──────────────▼──────────────────────────┐
│      BACKEND (Laravel)                  │
│  - API REST                             │
│  - Logique métier                       │
│  - Authentification                     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      BASE DE DONNÉES                    │
│  - SQLite (développement)               │
│  - MySQL/PostgreSQL (production)        │
└─────────────────────────────────────────┘
```

### 4.2 Stack Technique

**Frontend :**
- React 18.2.0
- React Router DOM 7.9.4
- CSS3 (styles personnalisés)

**Backend :**
- Laravel 12.0
- PHP 8.2+
- Laravel Sanctum (authentification)

**Base de données :**
- SQLite (développement)
- Support MySQL/PostgreSQL (production)

**Outils de développement :**
- Node.js
- npm
- Composer
- Git

---

## 5. TECHNOLOGIES UTILISÉES

### 5.1 Frontend

| Technologie | Version | Usage |
|------------|---------|-------|
| React | 18.2.0 | Framework UI |
| React Router DOM | 7.9.4 | Routage |
| React Scripts | 5.0.1 | Build tools |
| Express | 4.18.2 | Serveur de développement |
| http-proxy-middleware | 3.0.3 | Proxy API |

### 5.2 Backend

| Technologie | Version | Usage |
|------------|---------|-------|
| Laravel | 12.0 | Framework PHP |
| Laravel Sanctum | 4.2 | Authentification API |
| PHP | 8.2+ | Langage serveur |

---

## 6. STRUCTURE DU PROJET

### 6.1 Structure Frontend

```
frontend/
├── public/                 # Fichiers statiques
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── Navbar.js      # Barre de navigation
│   │   ├── Footer.js      # Pied de page
│   │   ├── CardAnnonce/   # Carte d'annonce
│   │   ├── AdvancedFilters/ # Filtres avancés
│   │   └── ProtectedRoute.js # Route protégée
│   ├── pages/             # Pages de l'application
│   │   ├── Welcome.js     # Page d'accueil
│   │   ├── Login.js       # Connexion
│   │   ├── Register.js    # Inscription
│   │   ├── HomePage.js    # Page principale
│   │   ├── LogementsPage.js # Liste des logements
│   │   ├── ColocationPage.js # Recherche colocataires
│   │   ├── AnnonceDetail.js # Détails annonce
│   │   ├── AjouterAnnoncePage.js # Publier annonce
│   │   ├── ProfilPage.js  # Profil utilisateur
│   │   ├── FavorisPage.js # Favoris
│   │   ├── MessagePage.js # Messagerie
│   │   ├── MessagesListPage.js # Liste messages
│   │   ├── ContactPage.js # Contact
│   │   ├── AproposPage.js # À propos
│   │   └── AdminPage.js   # Administration
│   ├── services/          # Services API
│   │   ├── authService.js # Authentification
│   │   ├── annonceService.js # Annonces
│   │   ├── messageService.js # Messages
│   │   ├── userService.js # Utilisateurs
│   │   ├── adminService.js # Administration
│   │   └── colocataireService.js # Colocataires
│   ├── App.js             # Composant principal
│   ├── index.js           # Point d'entrée
│   └── setupProxy.js      # Configuration proxy
├── package.json           # Dépendances npm
└── README.md             # Documentation
```

### 6.2 Structure Backend

```
backend-laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/   # Contrôleurs
│   │   │   ├── AuthController.php
│   │   │   ├── AnnonceController.php
│   │   │   ├── UserController.php
│   │   │   ├── MessageController.php
│   │   │   ├── AdminController.php
│   │   │   ├── ColocataireController.php
│   │   │   └── ContactController.php
│   │   └── Middleware/    # Middlewares
│   ├── Models/            # Modèles Eloquent
│   │   ├── User.php
│   │   ├── Annonce.php
│   │   ├── Message.php
│   │   ├── Conversation.php
│   │   ├── Colocataire.php
│   │   └── ...
│   └── Mail/              # Emails
├── database/
│   ├── migrations/        # Migrations
│   └── seeders/           # Seeders
├── routes/
│   └── api.php            # Routes API
├── storage/               # Stockage fichiers
├── config/                # Configuration
└── composer.json          # Dépendances PHP
```

---

## 7. FONCTIONNALITÉS

### 7.1 Authentification et Gestion des Utilisateurs

#### 7.1.1 Inscription
- Création de compte avec validation
- Types d'utilisateurs : Étudiant / Loueur
- Vérification des données (email, téléphone, CIN, CNE)

#### 7.1.2 Connexion
- Authentification par email/mot de passe
- Génération de tokens d'accès (Sanctum)
- Gestion de session

#### 7.1.3 Récupération de mot de passe
- Demande de réinitialisation par email
- Génération de token sécurisé
- Réinitialisation via formulaire dédié

#### 7.1.4 Gestion de profil
- Modification des informations personnelles
- Upload et gestion d'avatar
- Changement de mot de passe
- Consultation des statistiques (annonces, vues, favoris)

### 7.2 Gestion des Annonces

#### 7.2.1 Consultation
- Liste paginée des annonces
- Filtres avancés (type, prix, zone, surface, etc.)
- Recherche par mots-clés
- Affichage détaillé avec images multiples
- Système de favoris

#### 7.2.2 Publication
- Formulaire complet de création d'annonce
- Types de logements : Chambre, Studio, Appartement, Colocation
- Upload multiple d'images
- Gestion des équipements
- Définition des règles de vie
- Informations détaillées (prix, surface, adresse, etc.)

#### 7.2.3 Modification et Suppression
- Édition des annonces publiées
- Suppression avec confirmation
- Gestion des statuts (en attente, approuvé, rejeté)

### 7.3 Recherche de Colocataires

- Publication de demandes de colocataires
- Filtres par genre, type de chambre, nombre de personnes
- Contact direct avec les demandeurs
- Gestion des demandes (création, modification, suppression)

### 7.4 Système de Messagerie

- Conversations par annonce
- Envoi de messages avec sujet et téléphone
- Proposition de date de visite
- Liste des conversations
- Indicateur de messages non lus
- Historique des échanges

### 7.5 Favoris et Vues

- Ajout/retrait d'annonces en favoris
- Liste des favoris
- Historique des annonces consultées
- Statistiques de vues par annonce

### 7.6 Administration

#### 7.6.1 Tableau de bord
- Statistiques globales (utilisateurs, annonces, messages)
- Graphiques et indicateurs clés
- Vue d'ensemble de l'activité

#### 7.6.2 Gestion des annonces
- Liste complète des annonces
- Modération (approuver/rejeter)
- Suppression d'annonces
- Filtres par statut

#### 7.6.3 Gestion des utilisateurs
- Liste des utilisateurs
- Création de comptes
- Suspension/activation de comptes
- Suppression d'utilisateurs
- Filtres par type et statut

#### 7.6.4 Gestion des messages de contact
- Consultation des messages reçus
- Marquage comme lu/non lu
- Marquage comme traité
- Suppression de messages

### 7.7 Pages Informatives

- **Page d'accueil (Welcome)** : Présentation de la plateforme
- **À propos** : Histoire, mission, valeurs
- **Contact** : Formulaire de contact public

---

## 8. BASE DE DONNÉES

### 8.1 Modèle de Données

#### 8.1.1 Table `users`
Gère les utilisateurs de la plateforme.

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Identifiant unique |
| nom | string | Nom de famille |
| prenom | string | Prénom |
| email | string | Email (unique) |
| telephone | string | Téléphone |
| nom_utilisateur | string | Nom d'utilisateur |
| mot_de_passe | string | Mot de passe hashé |
| type_utilisateur | enum | 'etudiant' ou 'loueur' |
| cin | string | CIN |
| cne | string | CNE (étudiants) |
| role | enum | 'user', 'admin', 'administrator' |
| avatar | string | Chemin avatar |
| suspended | boolean | Statut suspension |
| email_verifie | boolean | Email vérifié |

#### 8.1.2 Table `annonces`
Stocke les annonces de logements.

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Identifiant unique |
| user_id | bigint | Propriétaire |
| titre | string | Titre annonce |
| type | enum | Type logement |
| zone | string | Zone géographique |
| adresse | string | Adresse complète |
| prix | decimal | Prix mensuel |
| surface | decimal | Surface en m² |
| nb_chambres | integer | Nombre de chambres |
| description | text | Description courte |
| description_longue | text | Description détaillée |
| meuble | boolean | Meublé ou non |
| disponibilite | date | Date disponibilité |
| statut | enum | Statut modération |
| vues | integer | Nombre de vues |
| contacts | integer | Nombre de contacts |

#### 8.1.3 Table `annonce_images`
Images associées aux annonces.

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Identifiant unique |
| annonce_id | bigint | Annonce associée |
| chemin | string | Chemin fichier |
| ordre | integer | Ordre d'affichage |

#### 8.1.4 Table `annonce_equipements`
Équipements disponibles dans le logement.

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Identifiant unique |
| annonce_id | bigint | Annonce associée |
| nom | string | Nom équipement |

#### 8.1.5 Table `annonce_regles`
Règles de vie du logement.

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Identifiant unique |
| annonce_id | bigint | Annonce associée |
| regle | string | Règle |

#### 8.1.6 Table `user_favorites`
Favoris des utilisateurs.

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Identifiant unique |
| user_id | bigint | Utilisateur |
| annonce_id | bigint | Annonce favorite |

#### 8.1.7 Table `conversations`
Conversations entre utilisateurs.

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Identifiant unique |
| annonce_id | bigint | Annonce concernée |
| locataire_id | bigint | Locataire |
| proprietaire_id | bigint | Propriétaire |

#### 8.1.8 Table `messages`
Messages dans les conversations.

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Identifiant unique |
| conversation_id | bigint | Conversation |
| sender_id | bigint | Expéditeur |
| content | text | Contenu message |
| sujet | string | Sujet |
| telephone | string | Téléphone |
| date_visite | date | Date visite proposée |
| lu | boolean | Message lu |

#### 8.1.9 Table `colocataires`
Demandes de colocataires.

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Identifiant unique |
| user_id | bigint | Demandeur |
| genre_recherche | enum | Genre recherché |
| type_chambre | enum | Type chambre |
| nb_personnes | integer | Nombre personnes |
| description | text | Description |
| zone_recherche | string | Zone recherchée |

#### 8.1.10 Table `annonce_views`
Historique des vues d'annonces.

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Identifiant unique |
| user_id | bigint | Utilisateur |
| annonce_id | bigint | Annonce vue |

#### 8.1.11 Table `contact_messages`
Messages de contact public.

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Identifiant unique |
| nom | string | Nom |
| email | string | Email |
| sujet | string | Sujet |
| message | text | Message |
| lu | boolean | Message lu |
| traite | boolean | Message traité |

#### 8.1.12 Table `password_reset_tokens`
Tokens de réinitialisation de mot de passe.

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Identifiant unique |
| email | string | Email |
| token | string | Token |
| created_at | timestamp | Date création |

### 8.2 Relations

- **User** → **Annonces** (1-N)
- **User** → **Favorites** (1-N)
- **User** → **Messages** (1-N)
- **Annonce** → **Images** (1-N)
- **Annonce** → **Equipements** (1-N)
- **Annonce** → **Regles** (1-N)
- **Annonce** → **Conversations** (1-N)
- **Conversation** → **Messages** (1-N)
- **User** → **Colocataires** (1-N)

---

## 9. API REST

### 9.1 Authentification

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/auth/register` | Inscription | Non |
| POST | `/api/auth/login` | Connexion | Non |
| POST | `/api/auth/logout` | Déconnexion | Oui |
| GET | `/api/auth/user` | Utilisateur connecté | Oui |
| POST | `/api/auth/forgot-password` | Demande réinitialisation | Non |
| POST | `/api/auth/reset-password` | Réinitialisation | Non |

### 9.2 Utilisateurs

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/users/me` | Profil utilisateur | Oui |
| PUT | `/api/users/me` | Modifier profil | Oui |
| POST | `/api/users/me/avatar` | Upload avatar | Oui |
| DELETE | `/api/users/me/avatar` | Supprimer avatar | Oui |
| PUT | `/api/users/me/password` | Changer mot de passe | Oui |
| GET | `/api/users/me/annonces` | Mes annonces | Oui |
| GET | `/api/users/me/views` | Annonces consultées | Oui |
| DELETE | `/api/users/me/views/{id}` | Supprimer vue | Oui |

### 9.3 Annonces

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/annonces` | Liste annonces | Non |
| GET | `/api/annonces/{id}` | Détails annonce | Optionnel |
| POST | `/api/annonces` | Créer annonce | Oui |
| PUT | `/api/annonces/{id}` | Modifier annonce | Oui |
| DELETE | `/api/annonces/{id}` | Supprimer annonce | Oui |
| POST | `/api/annonces/{id}/favorite` | Ajouter favori | Oui |
| DELETE | `/api/annonces/{id}/favorite` | Retirer favori | Oui |
| GET | `/api/annonces/favorites/list` | Liste favoris | Oui |

### 9.4 Messages

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/messages/conversations` | Liste conversations | Oui |
| GET | `/api/messages/annonce/{id}` | Messages par annonce | Oui |
| POST | `/api/messages` | Envoyer message | Oui |

### 9.5 Colocataires

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/colocataires` | Liste demandes | Non |
| GET | `/api/colocataires/{id}` | Détails demande | Optionnel |
| GET | `/api/colocataires/me/list` | Mes demandes | Oui |
| POST | `/api/colocataires` | Créer demande | Oui |
| PUT | `/api/colocataires/{id}` | Modifier demande | Oui |
| DELETE | `/api/colocataires/{id}` | Supprimer demande | Oui |
| POST | `/api/colocataires/{id}/contact` | Contacter | Oui |

### 9.6 Administration

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/admin/stats` | Statistiques | Admin |
| GET | `/api/admin/annonces` | Toutes annonces | Admin |
| POST | `/api/admin/annonces/{id}/moderate` | Modérer annonce | Admin |
| DELETE | `/api/admin/annonces/{id}` | Supprimer annonce | Admin |
| GET | `/api/admin/users` | Tous utilisateurs | Admin |
| POST | `/api/admin/users` | Créer utilisateur | Admin |
| DELETE | `/api/admin/users/{id}` | Supprimer utilisateur | Admin |
| PUT | `/api/admin/users/{id}/status` | Changer statut | Admin |
| GET | `/api/admin/contact-messages` | Messages contact | Admin |
| PUT | `/api/admin/contact-messages/{id}/read` | Marquer lu | Admin |
| PUT | `/api/admin/contact-messages/{id}/treated` | Marquer traité | Admin |
| DELETE | `/api/admin/contact-messages/{id}` | Supprimer message | Admin |

### 9.7 Contact

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/contact` | Envoyer message | Non |

---

## 10. INTERFACE UTILISATEUR

### 10.1 Design

L'interface utilise un design moderne et responsive avec :
- Palette de couleurs cohérente
- Typographie lisible
- Navigation intuitive
- Composants réutilisables
- Animations et transitions fluides

### 10.2 Pages Principales

#### 10.2.1 Page d'accueil (Welcome)
- Présentation de la plateforme
- Liens vers connexion/inscription
- Design attractif avec logo

#### 10.2.2 Page principale (Home)
- Carrousel d'annonces en vedette
- Recherche rapide
- Catégories de logements
- Statistiques de la plateforme
- Sections informatives

#### 10.2.3 Liste des logements
- Grille d'annonces avec cartes
- Filtres avancés (prix, type, zone, surface)
- Pagination
- Tri par pertinence/prix/date

#### 10.2.4 Détails d'annonce
- Galerie d'images
- Informations complètes
- Carte de localisation
- Liste des équipements
- Règles de vie
- Bouton contact/favoris

#### 10.2.5 Profil utilisateur
- Informations personnelles
- Avatar personnalisable
- Statistiques (annonces, vues, favoris)
- Liste des annonces publiées
- Historique des vues

#### 10.2.6 Messagerie
- Liste des conversations
- Interface de chat
- Historique des messages
- Indicateurs de lecture

#### 10.2.7 Administration
- Tableau de bord avec statistiques
- Gestion des annonces
- Gestion des utilisateurs
- Gestion des messages de contact

### 10.3 Responsive Design

L'application est entièrement responsive et s'adapte à :
- Ordinateurs de bureau
- Tablettes
- Smartphones

---

## 11. SÉCURITÉ

### 11.1 Authentification

- **Laravel Sanctum** : Authentification par tokens
- **Hashage des mots de passe** : Bcrypt
- **Tokens sécurisés** : Expiration automatique
- **Protection CSRF** : Middleware Laravel

### 11.2 Autorisation

- **Routes protégées** : Middleware `auth:sanctum`
- **Rôles utilisateurs** : User, Admin, Administrator
- **Permissions** : Vérification des droits d'accès
- **Protection des ressources** : Vérification de propriété

### 11.3 Validation des Données

- Validation côté serveur (Laravel)
- Validation côté client (React)
- Sanitisation des entrées
- Protection contre l'injection SQL (Eloquent ORM)

### 11.4 Gestion des Fichiers

- Validation des types de fichiers
- Limitation de taille
- Stockage sécurisé
- Génération de noms uniques

### 11.5 CORS

- Configuration CORS pour l'API
- Origines autorisées configurées
- Headers sécurisés

---

## 12. INSTALLATION ET DÉPLOIEMENT

### 12.1 Prérequis

- Node.js (v18 ou supérieur)
- PHP 8.2 ou supérieur
- Composer
- Base de données (SQLite/MySQL/PostgreSQL)

### 12.2 Installation Frontend

```bash
cd frontend
npm install
npm start
```

### 12.3 Installation Backend

```bash
cd backend-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### 12.4 Configuration

1. Configurer le fichier `.env` du backend
2. Configurer la base de données
3. Configurer le proxy dans `setupProxy.js` (frontend)
4. Configurer les URLs d'API

### 12.5 Déploiement

- **Frontend** : Build avec `npm run build`, déployer sur serveur web statique
- **Backend** : Déployer sur serveur PHP avec support Laravel
- **Base de données** : Migrer vers MySQL/PostgreSQL en production

---

## 13. CONCLUSION

### 13.1 Résultats

Le projet **Darna Agadir** a été développé avec succès et offre une solution complète pour la location de logements étudiants. L'application présente :

- ✅ Une interface moderne et intuitive
- ✅ Une architecture robuste et scalable
- ✅ Un système d'authentification sécurisé
- ✅ Des fonctionnalités complètes de gestion
- ✅ Une API REST bien structurée
- ✅ Un système d'administration complet

### 13.2 Points Forts

1. **Architecture modulaire** : Séparation claire frontend/backend
2. **Sécurité** : Authentification et autorisation robustes
3. **Expérience utilisateur** : Interface intuitive et responsive
4. **Fonctionnalités complètes** : Tous les besoins couverts
5. **Maintenabilité** : Code structuré et documenté

### 13.3 Améliorations Futures

- Système de notifications en temps réel
- Application mobile (React Native)
- Intégration de paiement en ligne
- Système de notation et avis
- Recherche géolocalisée avancée
- Chat en temps réel (WebSockets)
- Export PDF des annonces
- Système de réservation en ligne

### 13.4 Remerciements

Ce projet a été développé dans le cadre d'une formation et démontre l'application pratique des technologies web modernes pour résoudre un problème réel : faciliter l'accès au logement pour les étudiants à Agadir.

---

**Date du rapport** : 2024  
**Version** : 1.0  
**Auteur** : Équipe de développement Darna Agadir

---

*Ce rapport documente l'ensemble du projet de développement de la plateforme Darna Agadir. Pour toute question ou information complémentaire, veuillez consulter la documentation technique ou contacter l'équipe de développement.*


