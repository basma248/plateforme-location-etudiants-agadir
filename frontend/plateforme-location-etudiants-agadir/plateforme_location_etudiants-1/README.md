# Plateforme Location Étudiants

## Description
Ce projet est une plateforme de gestion de logement pour étudiants, développée avec le framework Laravel. Il permet aux utilisateurs de s'inscrire, de se connecter et de gérer leurs demandes de logement.

## Structure du Projet
Le projet est organisé selon la structure standard de Laravel, avec les répertoires suivants :

- **app/** : Contient la logique de l'application, y compris les contrôleurs, les modèles et les middleware.
- **bootstrap/** : Contient les fichiers de démarrage de l'application.
- **config/** : Contient les fichiers de configuration.
- **database/** : Contient les migrations, les seeders et les factories pour la base de données.
- **public/** : Contient le point d'entrée de l'application.
- **resources/** : Contient les fichiers de vue, les fichiers JavaScript et les fichiers de langue.
- **routes/** : Contient les fichiers de définition des routes pour l'API et l'interface web.
- **storage/** : Contient les fichiers générés par l'application, y compris les logs.
- **tests/** : Contient les tests unitaires et fonctionnels.

## Configuration

1. **Configuration de l'environnement** : Renommez `.env.example` en `.env` et mettez à jour avec vos informations d'identification de base de données :
   ```
   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=plateforme_location_etudiants
   DB_USERNAME=plateforme_user
   DB_PASSWORD=ton_mot_de_passe
   ```

2. **Générer la clé de l'application** : Exécutez la commande suivante pour générer la clé de l'application :
   ```
   php artisan key:generate
   ```

3. **Migrations** : Si vous avez des fichiers de migration, exécutez la commande suivante pour créer les tables de la base de données :
   ```
   php artisan migrate
   ```

4. **Seeders** : Si vous avez des seeders, vous pouvez peupler la base de données avec des données initiales en utilisant :
   ```
   php artisan db:seed
   ```

5. **Routes** : Définissez vos routes API et web dans `routes/api.php` et `routes/web.php` respectivement.

6. **Contrôleurs** : Créez des contrôleurs dans `app/Http/Controllers` pour gérer la logique de vos routes.

7. **Modèles** : Créez des modèles dans `app/Models` pour interagir avec vos tables de base de données.

8. **Tests** : Écrivez des tests dans le répertoire `tests` pour vous assurer que votre application fonctionne comme prévu.

## Conclusion
Après avoir complété ces étapes, votre backend Laravel devrait être configuré et prêt à fonctionner avec la base de données MySQL spécifiée.