# Documentation des Endpoints API - Frontend

Ce document liste tous les endpoints API que le frontend attend du backend.

## Configuration

- **Base URL**: `process.env.REACT_APP_API_URL || 'http://localhost:5000/api'`
- **Format**: JSON
- **Authentification**: Bearer Token (sauf pour login/register)

---

## 🔐 Authentification (`/auth`)

### POST `/auth/login`
**Description**: Connexion d'un utilisateur

**Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "nom": "Ahmed Benali",
    "email": "ahmed@example.com",
    "telephone": "+212 6 12 34 56 78",
    "role": "user" // ou "admin"
  }
}
```

### POST `/auth/register`
**Description**: Inscription d'un nouvel utilisateur

**Body**:
```json
{
  "nom": "Ahmed",
  "prenom": "Benali",
  "email": "ahmed@example.com",
  "telephone": "+212 6 12 34 56 78",
  "nomUtilisateur": "ahmed123",
  "motDePasse": "password123",
  "typeUtilisateur": "etudiant", // ou "loueur"
  "cin": "AB123456",
  "cne": "CNE123456" // seulement si typeUtilisateur === "etudiant"
}
```

**Response**: Même format que login

### POST `/auth/forgot-password`
**Description**: Demande de réinitialisation de mot de passe

**Body**:
```json
{
  "email": "user@example.com"
}
```

---

## 🏠 Annonces (`/annonces`)

### GET `/annonces`
**Description**: Récupère toutes les annonces avec filtres optionnels

**Query Parameters** (optionnels):
- `type`: chambre | studio | appartement | colocation
- `zone`: string
- `prixMin`: number
- `prixMax`: number
- `surfaceMin`: number
- `nbChambres`: number
- `meuble`: boolean
- `disponibilite`: string

**Response**:
```json
[
  {
    "id": 1,
    "titre": "Chambre moderne près de l'université",
    "zone": "Universiapolis",
    "prix": 1500,
    "type": "chambre",
    "surface": 15,
    "nbChambres": 1,
    "meuble": true,
    "description": "Description courte...",
    "images": ["url1", "url2"],
    "rating": 4.8
  }
]
```

### GET `/annonces/:id`
**Description**: Récupère une annonce par son ID

**Response**:
```json
{
  "id": 1,
  "titre": "Chambre moderne près de l'université",
  "zone": "Universiapolis",
  "prix": 1500,
  "type": "chambre",
  "surface": 15,
  "nbChambres": 1,
  "meuble": true,
  "description": "Description courte...",
  "descriptionLongue": "Description détaillée...",
  "images": ["url1", "url2"],
  "rating": 4.8,
  "nbAvis": 24,
  "disponibilite": "Immédiate",
  "adresse": "Rue Mohammed V, Universiapolis, Agadir",
  "equipements": ["Wi-Fi", "Chauffage"],
  "regles": ["Non-fumeur"],
  "proprietaire": {
    "nom": "Ahmed Benali",
    "email": "ahmed@example.com",
    "telephone": "+212 6 12 34 56 78",
    "avatar": "url",
    "verifie": true
  }
}
```

### POST `/annonces`
**Description**: Crée une nouvelle annonce (authentifié)

**Headers**: `Authorization: Bearer <token>`

**Body** (FormData):
- `titre`: string
- `type`: string
- `zone`: string
- `adresse`: string
- `prix`: number
- `surface`: number
- `nbChambres`: number
- `description`: string
- `descriptionLongue`: string
- `meuble`: boolean
- `disponibilite`: string
- `equipements`: JSON string array
- `regles`: JSON string array
- `contact`: JSON object
- `images`: File[] (multipart/form-data)

**Response**: Annonce créée

### PUT `/annonces/:id`
**Description**: Met à jour une annonce (authentifié, propriétaire uniquement)

**Headers**: `Authorization: Bearer <token>`

**Body**: Même format que POST

### DELETE `/annonces/:id`
**Description**: Supprime une annonce (authentifié, propriétaire uniquement)

**Headers**: `Authorization: Bearer <token>`

---

## 💬 Messages (`/messages`)

### GET `/messages/conversations`
**Description**: Récupère toutes les conversations de l'utilisateur

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
[
  {
    "id": 1,
    "annonceId": 1,
    "annonce": {
      "titre": "Chambre moderne...",
      "zone": "Universiapolis",
      "prix": 1500,
      "image": "url"
    },
    "proprietaire": {
      "nom": "Ahmed Benali",
      "avatar": "url"
    },
    "dernierMessage": {
      "content": "Message...",
      "timestamp": "2024-01-15T10:30:00Z",
      "sender": "moi" // ou "proprietaire"
    },
    "nonLu": 2
  }
]
```

### GET `/messages/annonce/:annonceId`
**Description**: Récupère les messages d'une conversation

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
[
  {
    "id": 1,
    "sender": "proprietaire", // ou "moi"
    "content": "Message content...",
    "timestamp": "2024-01-15T10:30:00Z",
    "sujet": "interesse", // optionnel
    "telephone": "+212 6 12 34 56 78", // optionnel
    "dateVisite": "2024-01-20" // optionnel
  }
]
```

### POST `/messages`
**Description**: Envoie un message

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "annonceId": 1,
  "content": "Message content...",
  "sujet": "interesse", // optionnel
  "telephone": "+212 6 12 34 56 78", // optionnel
  "dateVisite": "2024-01-20" // optionnel
}
```

---

## 👤 Profil (`/users` ou `/profile`)

### GET `/users/me` ou `/profile`
**Description**: Récupère le profil de l'utilisateur connecté

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "id": 1,
  "nom": "Ahmed Benali",
  "email": "ahmed@example.com",
  "telephone": "+212 6 12 34 56 78",
  "avatar": "url",
  "dateInscription": "2024-01-15",
  "annoncesPubliees": 5,
  "annoncesFavorites": 12
}
```

### PUT `/users/me` ou `/profile`
**Description**: Met à jour le profil

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "nom": "Ahmed Benali",
  "email": "ahmed@example.com",
  "telephone": "+212 6 12 34 56 78"
}
```

### PUT `/users/me/password` ou `/profile/password`
**Description**: Change le mot de passe

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "ancienMotDePasse": "old123",
  "nouveauMotDePasse": "new123"
}
```

### GET `/users/me/annonces` ou `/profile/annonces`
**Description**: Récupère les annonces de l'utilisateur

**Headers**: `Authorization: Bearer <token>`

**Response**: Array d'annonces avec stats (vues, contacts)

---

## 🔐 Administration (`/admin`)

### GET `/admin/stats`
**Description**: Statistiques du dashboard admin

**Headers**: `Authorization: Bearer <token>` (admin uniquement)

**Response**:
```json
{
  "totalAnnonces": 45,
  "totalUsers": 128,
  "totalMessages": 234,
  "annoncesEnAttente": 3,
  "annoncesSignalees": 2,
  "usersSignales": 1,
  "recentAnnonces": 5,
  "recentUsers": 3
}
```

### GET `/admin/annonces`
**Description**: Récupère toutes les annonces (admin)

**Headers**: `Authorization: Bearer <token>` (admin uniquement)

**Query Parameters**: Même que `/annonces`

**Response**: Array d'annonces avec `statut` (approuve | en_attente | rejete | signale)

### POST `/admin/annonces/:id/moderate`
**Description**: Modère une annonce

**Headers**: `Authorization: Bearer <token>` (admin uniquement)

**Body**:
```json
{
  "action": "approuver", // ou "rejeter"
  "reason": "Raison optionnelle"
}
```

### DELETE `/admin/annonces/:id`
**Description**: Supprime une annonce (admin)

**Headers**: `Authorization: Bearer <token>` (admin uniquement)

### GET `/admin/users`
**Description**: Récupère tous les utilisateurs (admin)

**Headers**: `Authorization: Bearer <token>` (admin uniquement)

**Response**:
```json
[
  {
    "id": 1,
    "nom": "Ahmed Benali",
    "email": "ahmed@example.com",
    "telephone": "+212 6 12 34 56 78",
    "role": "user", // ou "admin"
    "suspended": false
  }
]
```

### POST `/admin/users`
**Description**: Crée un utilisateur (admin)

**Headers**: `Authorization: Bearer <token>` (admin uniquement)

**Body**:
```json
{
  "nom": "Ahmed Benali",
  "email": "ahmed@example.com",
  "password": "password123",
  "telephone": "+212 6 12 34 56 78",
  "role": "user" // ou "admin"
}
```

### DELETE `/admin/users/:id`
**Description**: Supprime un utilisateur (admin)

**Headers**: `Authorization: Bearer <token>` (admin uniquement)

### POST `/admin/users/:id/report`
**Description**: Signale un utilisateur

**Headers**: `Authorization: Bearer <token>` (admin uniquement)

**Body**:
```json
{
  "reason": "Raison du signalement"
}
```

### PUT `/admin/users/:id/status`
**Description**: Suspend ou réactive un utilisateur

**Headers**: `Authorization: Bearer <token>` (admin uniquement)

**Body**:
```json
{
  "suspended": true // ou false
}
```

---

## 📝 Notes importantes

1. **Gestion des erreurs**: Toutes les réponses d'erreur doivent suivre ce format:
   ```json
   {
     "message": "Message d'erreur",
     "error": "Error code"
   }
   ```

2. **Codes HTTP**:
   - `200`: Succès
   - `201`: Créé
   - `400`: Bad Request
   - `401`: Non autorisé
   - `403`: Interdit (pas admin)
   - `404`: Non trouvé
   - `500`: Erreur serveur

3. **Pagination**: Pour les listes longues, considérer l'ajout de pagination:
   - Query params: `page`, `limit`
   - Response: `{ data: [], total: 100, page: 1, limit: 20 }`

4. **Upload d'images**: Utiliser `multipart/form-data` pour les formulaires avec fichiers

5. **Validation**: Le backend doit valider tous les champs requis


