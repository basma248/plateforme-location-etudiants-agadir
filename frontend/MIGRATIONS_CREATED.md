# ✅ Migrations Créées avec Succès

## Tables Créées

### 1. `annonce_regles`
- **Migration**: `2025_11_28_140000_create_annonce_regles_table.php`
- **Colonnes**:
  - `id` (primary key)
  - `annonce_id` (foreign key vers annonces)
  - `regle` (string, 100)
  - `timestamps`
- **Indexes**: `annonce_id`, `regle`

### 2. `annonce_images`
- **Migration**: `2025_11_28_141000_create_annonce_images_table.php`
- **Colonnes**:
  - `id` (primary key)
  - `annonce_id` (foreign key vers annonces)
  - `image_url` (string, 500)
  - `image_order` (integer, default 0)
  - `timestamps`
- **Indexes**: `annonce_id`, `image_order`

## Modèles Mis à Jour

### AnnonceRegle
- ✅ `protected $table = 'annonce_regles';` ajouté

### AnnonceImage
- ✅ `protected $table = 'annonce_images';` ajouté

### AnnonceEquipement
- ✅ `protected $table = 'annonce_equipements';` ajouté

## Résultat

Les migrations ont été exécutées avec succès :
- ✅ `2025_11_28_140000_create_annonce_regles_table` - DONE
- ✅ `2025_11_28_141000_create_annonce_images_table` - DONE

La publication d'annonces devrait maintenant fonctionner correctement !

