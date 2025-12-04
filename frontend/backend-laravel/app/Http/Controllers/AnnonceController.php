<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use App\Models\AnnonceView;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

class AnnonceController extends Controller
{
    /**
     * Lister toutes les annonces (avec filtres)
     */
    public function index(Request $request)
    {
        $query = Annonce::approuvees()->with(['user', 'images', 'equipements', 'regles']);

        $filters = $request->only([
            'type', 'exclude_type', 'zone', 'prix_min', 'prix_max', 'meuble',
            'surface_min', 'nb_chambres', 'search', 'sort_by', 'sort_direction'
        ]);

        $query->withFilters($filters);

        $annonces = $query->paginate(12);

        // Ajouter des attributs calculés et mapper les champs pour le frontend
        // Vérifier si l'utilisateur est authentifié (route publique mais peut avoir un user)
        $user = null;
        try {
            $user = $request->user();
        } catch (\Exception $e) {
            // Pas d'utilisateur authentifié, c'est normal pour une route publique
        }
        
        $annonces->getCollection()->transform(function ($annonce) use ($user) {
            // Récupérer les images depuis la relation
            $imageUrls = [];
            if ($annonce->images && $annonce->images->count() > 0) {
                foreach ($annonce->images as $image) {
                    if ($image->image_url) {
                        // S'assurer que l'URL est complète (ajouter le domaine si nécessaire)
                        $url = $image->image_url;
                        
                        // Si c'est un chemin relatif (storage/...), le convertir en URL absolue
                        if (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
                            // Si c'est un chemin storage, utiliser asset() pour générer l'URL complète
                            if (str_starts_with($url, '/storage/')) {
                                $url = asset($url);
                            } elseif (str_starts_with($url, 'storage/')) {
                                $url = asset('/storage/' . str_replace('storage/', '', $url));
                            } elseif (str_starts_with($url, '/')) {
                                $url = asset($url);
                            } else {
                                // Chemin relatif sans slash, ajouter /storage/
                                $url = asset('/storage/' . $url);
                            }
                        }
                        
                        // S'assurer que l'URL est valide
                        if (!empty($url) && is_string($url)) {
                            $imageUrls[] = $url;
                        }
                    }
                }
            }
            
            // Si pas d'images depuis la relation, utiliser l'accessor
            if (empty($imageUrls)) {
                $allImages = $annonce->all_images;
                if (is_array($allImages) && !empty($allImages)) {
                    $imageUrls = array_map(function($img) {
                        if (empty($img) || !is_string($img)) {
                            return null;
                        }
                        // Convertir les chemins relatifs en URLs absolues
                        if (!str_starts_with($img, 'http://') && !str_starts_with($img, 'https://')) {
                            if (str_starts_with($img, '/storage/')) {
                                return asset($img);
                            } elseif (str_starts_with($img, 'storage/')) {
                                return asset('/storage/' . str_replace('storage/', '', $img));
                            } elseif (str_starts_with($img, '/')) {
                                return asset($img);
                            } else {
                                return asset('/storage/' . $img);
                            }
                        }
                        return $img;
                    }, $allImages);
                    // Filtrer les valeurs null
                    $imageUrls = array_filter($imageUrls, function($img) {
                        return !empty($img) && is_string($img);
                    });
                }
            }
            
            // Réindexer le tableau pour éviter les trous
            $imageUrls = array_values($imageUrls);
            
            // S'assurer que les images sont un tableau
            if (!is_array($imageUrls)) {
                $imageUrls = [];
            }
            
            // S'assurer que les équipements sont un tableau
            $equipementsList = $annonce->equipements_list;
            if (!is_array($equipementsList)) {
                $equipementsList = [];
            }
            
            // S'assurer que les règles sont un tableau
            $reglesList = $annonce->regles_list;
            if (!is_array($reglesList)) {
                $reglesList = [];
            }
            
            // Générer l'URL de l'image principale
            $mainImage = !empty($imageUrls) ? $imageUrls[0] : null;
            if (!$mainImage && $annonce->main_image) {
                $mainImage = $annonce->main_image;
                // Convertir en URL absolue si nécessaire
                if (!str_starts_with($mainImage, 'http://') && !str_starts_with($mainImage, 'https://')) {
                    if (str_starts_with($mainImage, '/storage/')) {
                        $mainImage = asset($mainImage);
                    } elseif (str_starts_with($mainImage, 'storage/')) {
                        $mainImage = asset('/storage/' . str_replace('storage/', '', $mainImage));
                    } else {
                        $mainImage = asset('/storage/' . $mainImage);
                    }
                }
            }
            
            $annonce->main_image = $mainImage;
            $annonce->all_images = $imageUrls;
            $annonce->images = $imageUrls; // Pour compatibilité frontend
            
            // Log détaillé pour débogage
            \Log::info('Annonce ID ' . $annonce->id . ' - Images formatées:', [
                'count' => count($imageUrls),
                'urls' => $imageUrls,
                'main_image' => $mainImage
            ]);
            $annonce->equipements_list = $equipementsList;
            $annonce->regles_list = $reglesList;
            $annonce->prix_formatted = $annonce->prix_formatted;
            
            // Formater le propriétaire avec l'avatar correctement formaté
            if ($annonce->user) {
                // Récupérer l'avatar directement depuis la BD pour plus de fiabilité
                $avatarRaw = $annonce->user->avatar ?? null;
                if (!$avatarRaw) {
                    $avatarRaw = DB::table('users')->where('id', $annonce->user->id)->value('avatar');
                }
                
                // Formater l'avatar en URL absolue si nécessaire
                $avatar = null;
                if ($avatarRaw) {
                    if (str_starts_with($avatarRaw, 'http://') || str_starts_with($avatarRaw, 'https://')) {
                        $avatar = $avatarRaw;
                    } else {
                        // Utiliser Storage::url() pour générer l'URL complète
                        $url = Storage::disk('public')->url($avatarRaw);
                        if ($url && !str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
                            $baseUrl = request()->getSchemeAndHttpHost();
                            if (!str_starts_with($url, '/storage/')) {
                                $url = sprintf('/storage/%s', ltrim($url, '/'));
                            }
                            $url = sprintf('%s%s', $baseUrl, $url);
                        }
                        $avatar = $url ?: null;
                    }
                }
                
                $annonce->proprietaire = [
                    'id' => $annonce->user->id,
                    'nom' => $annonce->user->nom ?? '',
                    'prenom' => $annonce->user->prenom ?? '',
                    'nomComplet' => trim(($annonce->user->prenom ?? '') . ' ' . ($annonce->user->nom ?? '')) ?: ($annonce->user->email ?? 'Propriétaire'),
                    'email' => $annonce->user->email ?? '',
                    'telephone' => $annonce->user->telephone ?? '',
                    'avatar' => $avatar,
                    'verifie' => $annonce->user->email_verifie ?? false,
                ];
            } else {
                $annonce->proprietaire = null;
            }
            
            // Mapper les champs snake_case vers camelCase pour le frontend
            $annonce->nbChambres = $annonce->nb_chambres;
            $annonce->descriptionLongue = $annonce->description_longue;
            // S'assurer que rating est un nombre ou null
            $annonce->rating = $annonce->rating ? (float) $annonce->rating : null;
            
            // Log pour débogage
            \Log::info('Annonce ID ' . $annonce->id . ' - Images: ' . count($imageUrls));
            
            // S'assurer que l'ID est présent
            if (!$annonce->id) {
                \Log::warning('Annonce sans ID trouvée:', $annonce->toArray());
            }
            
            // Ajouter l'information si l'annonce est dans les favoris de l'utilisateur
            if ($user) {
                try {
                    $annonce->is_favorite = $user->isFavorited($annonce);
                } catch (\Exception $e) {
                    \Log::warning('Erreur lors de la vérification des favoris: ' . $e->getMessage());
                    $annonce->is_favorite = false;
                }
            } else {
                $annonce->is_favorite = false;
            }
            
            return $annonce;
        });

        return response()->json([
            'success' => true,
            'data' => $annonces
        ]);
    }

    /**
     * Créer une nouvelle annonce
     */
    public function store(Request $request)
    {
        // Préparer les règles de validation
        // Règles de base
        $rules = [
            'titre' => 'required|string|max:255',
            'type' => 'required|in:' . implode(',', Annonce::TYPES),
            'colocation_type' => 'nullable|in:logement_trouve,logement_recherche',
            'description' => 'required|string|max:2000',
            'description_longue' => 'nullable|string|max:5000',
            'zone' => 'required|string|max:100',
            'prix' => 'required|numeric|min:0',
            'regles' => 'nullable|array|max:20',
            'regles.*' => 'string|max:100',
        ];

        // Règles conditionnelles selon le type de colocation
        $colocationType = $request->colocation_type;
        
        if ($colocationType === 'logement_trouve') {
            // Pour "J'ai trouvé un logement" - tous les champs du logement sont requis/optionnels
            $rules['nb_colocataires_recherches'] = 'required|integer|min:1';
            $rules['nb_colocataires_trouves'] = 'nullable|integer|min:0';
            $rules['conditions_colocation'] = 'nullable|string|max:1000';
            $rules['genre_recherche'] = 'required|in:homme,femme'; // Genre recherché pour les colocataires (obligatoire, seulement homme ou femme)
            $rules['adresse'] = 'nullable|string|max:500';
            $rules['surface'] = 'nullable|numeric|min:0';
            $rules['nb_chambres'] = 'nullable|integer|min:1';
            $rules['disponibilite'] = 'nullable|string|max:50';
            $rules['images'] = 'nullable|array|max:10';
            $rules['images.*'] = 'nullable|string|max:2000';
            $rules['equipements'] = 'nullable|array|max:20';
            $rules['equipements.*'] = 'string|max:100';
        } elseif ($colocationType === 'logement_recherche') {
            // Pour "Je cherche un logement" - pas de champs du logement
            $rules['genre_recherche'] = 'required|in:homme,femme,mixte';
            $rules['type_chambre_recherchee'] = 'required|in:chambre_seule,chambre_partagee,indifferent';
            $rules['nb_personnes_souhaitees'] = 'nullable|integer|min:1';
            $rules['cherche_seul'] = 'nullable|boolean';
            // Zone et prix ne sont plus obligatoires pour "je cherche un logement"
            $rules['zone'] = 'nullable|string|max:100';
            $rules['prix'] = 'nullable|numeric|min:0';
            // Pas d'images, adresse, surface, nb_chambres, meuble, disponibilite, equipements pour ce type
        } else {
            // Si pas de type de colocation spécifié, règles par défaut
            $rules['adresse'] = 'nullable|string|max:500';
            $rules['surface'] = 'nullable|numeric|min:0';
            $rules['nb_chambres'] = 'nullable|integer|min:1';
            $rules['disponibilite'] = 'nullable|string|max:50';
            $rules['images'] = 'nullable|array|max:10';
            $rules['images.*'] = 'nullable|string|max:2000';
            $rules['equipements'] = 'nullable|array|max:20';
            $rules['equipements.*'] = 'string|max:100';
        }
        
        // Validation pour meuble (accepter booléen, string "1"/"0", etc.)
        $rules['meuble'] = ['nullable', function ($attribute, $value, $fail) {
            if ($value !== null && $value !== '' && !in_array($value, [true, false, '1', '0', 'true', 'false', 1, 0], true)) {
                $fail('Le champ ' . $attribute . ' doit être vrai ou faux.');
            }
        }];
        
        // Validation pour les fichiers images
        // Toujours ajouter la règle, mais rendre nullable pour éviter les erreurs si aucun fichier
        $rules['image_files'] = 'nullable|array|max:10';
        $rules['image_files.*'] = 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120'; // 5MB max
        
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Traiter le champ meuble (peut être "1", "0", "true", "false", true, false)
            $meubleValue = false;
            $meubleInput = $request->input('meuble');
            if ($meubleInput !== null && $meubleInput !== '') {
                if (in_array($meubleInput, [true, 'true', '1', 1], true)) {
                    $meubleValue = true;
                } elseif (in_array($meubleInput, [false, 'false', '0', 0], true)) {
                    $meubleValue = false;
                } else {
                    $meubleValue = filter_var($meubleInput, FILTER_VALIDATE_BOOLEAN);
                }
            }
            
            // Préparer les données selon le type de colocation
            // S'assurer que zone et prix ne sont jamais null
            $zone = $request->zone;
            if (empty($zone) || $zone === null || $zone === '') {
                $zone = 'Non spécifiée'; // Valeur par défaut si zone est vide
            }
            
            $prix = $request->prix;
            if (empty($prix) || $prix === null || $prix === '') {
                $prix = 0; // Valeur par défaut si prix est vide
            }
            
            $annonceData = [
                'user_id' => $request->user()->id,
                'titre' => $request->titre,
                'type' => $request->type,
                'colocation_type' => $request->colocation_type ?? null,
                'zone' => $zone,
                'prix' => (float) $prix,
                'description' => $request->description,
                'description_longue' => $request->description_longue ?? null,
                'statut' => 'approuve',
            ];

            // Champs spécifiques pour "J'ai trouvé un logement"
            if ($request->colocation_type === 'logement_trouve') {
                $annonceData['nb_colocataires_recherches'] = $request->nb_colocataires_recherches ?? null;
                $annonceData['nb_colocataires_trouves'] = $request->nb_colocataires_trouves ?? 0;
                $annonceData['conditions_colocation'] = $request->conditions_colocation ?? null;
                $annonceData['genre_recherche'] = $request->genre_recherche ?? null; // Genre recherché pour les colocataires
                $annonceData['adresse'] = $request->adresse ?? null;
                $annonceData['surface'] = $request->surface ?? null;
                $nbChambres = $request->nb_chambres;
                $annonceData['nb_chambres'] = (!empty($nbChambres) && $nbChambres !== null && $nbChambres !== '') ? (int) $nbChambres : 1;
                $annonceData['meuble'] = $meubleValue;
                $annonceData['disponibilite'] = $request->disponibilite ?? null;
            }
            
            // Champs spécifiques pour "Je cherche un logement"
            if ($request->colocation_type === 'logement_recherche') {
                $annonceData['genre_recherche'] = $request->genre_recherche ?? null;
                $annonceData['type_chambre_recherchee'] = $request->type_chambre_recherchee ?? null;
                $annonceData['nb_personnes_souhaitees'] = $request->nb_personnes_souhaitees ?? null;
                $annonceData['cherche_seul'] = $request->cherche_seul ?? false;
                // Pas de champs du logement pour ce type - utiliser des valeurs par défaut pour les champs obligatoires
                $annonceData['adresse'] = null;
                $annonceData['surface'] = null;
                // Toujours définir nb_chambres à 1 pour "logement_recherche" car la colonne ne peut pas être null
                $annonceData['nb_chambres'] = 1;
                $annonceData['meuble'] = false;
                $annonceData['disponibilite'] = null;
            }
            
            // S'assurer que nb_chambres est toujours défini (fallback pour tous les cas)
            if (!isset($annonceData['nb_chambres']) || $annonceData['nb_chambres'] === null || $annonceData['nb_chambres'] === '') {
                $annonceData['nb_chambres'] = 1;
            } else {
                $annonceData['nb_chambres'] = (int) $annonceData['nb_chambres'];
            }

            $annonce = Annonce::create($annonceData);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la création de l\'annonce: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'annonce: ' . $e->getMessage(),
                'errors' => ['database' => $e->getMessage()]
            ], 500);
        }

        // Traiter les images uploadées (fichiers) - pour tous les types d'annonces sauf "Je cherche un logement"
        $uploadedImageUrls = [];
        
        // Vérifier si des fichiers sont présents (hasFile() peut échouer avec FormData)
        // Ne pas traiter les images seulement si c'est "Je cherche un logement"
        $shouldProcessImages = $request->colocation_type !== 'logement_recherche';
        
        if ($shouldProcessImages && ($request->hasFile('image_files') || $request->has('image_files'))) {
            \Log::info('Traitement des fichiers images uploadés pour l\'annonce ID: ' . $annonce->id);
            
            try {
                $files = $request->file('image_files');
                
                // Si c'est un tableau associatif, itérer dessus
                if (is_array($files) && !empty($files)) {
                    \Log::info('Fichiers reçus: ' . count($files) . ' fichiers');
                    \Log::info('Clés des fichiers: ' . json_encode(array_keys($files)));
                    
                    foreach ($files as $index => $file) {
                        // Vérifier que le fichier existe et est valide
                        if ($file && $file->isValid()) {
                            try {
                                // Vérifier que c'est bien une image
                                $mimeType = $file->getMimeType();
                                if (!str_starts_with($mimeType, 'image/')) {
                                    \Log::warning('Fichier rejeté (pas une image): ' . $file->getClientOriginalName() . ' (type: ' . $mimeType . ')');
                                    continue;
                                }
                                
                                // Générer un nom de fichier unique
                                $extension = $file->getClientOriginalExtension() ?: $file->guessExtension() ?: 'jpg';
                                $filename = 'annonce_' . $annonce->id . '_' . time() . '_' . $index . '.' . $extension;
                                
                                // Stocker le fichier dans storage/app/public/images/annonces
                                $path = $file->storeAs('images/annonces', $filename, 'public');
                                
                                // Générer l'URL publique de l'image
                                $url = Storage::disk('public')->url($path);
                                
                                $uploadedImageUrls[] = $url;
                                \Log::info('Image uploadée avec succès: ' . $filename . ' -> ' . $url);
                            } catch (\Exception $e) {
                                \Log::error('Erreur lors de l\'upload de l\'image ' . $index . ': ' . $e->getMessage());
                                \Log::error('Stack trace: ' . $e->getTraceAsString());
                            }
                        } else {
                            \Log::warning('Fichier invalide ou manquant à l\'index ' . $index);
                            if ($file) {
                                \Log::warning('Détails du fichier: ' . json_encode([
                                    'name' => $file->getClientOriginalName(),
                                    'size' => $file->getSize(),
                                    'mime' => $file->getMimeType(),
                                    'valid' => $file->isValid(),
                                    'error' => $file->getError()
                                ]));
                            }
                        }
                    }
                } else {
                    \Log::info('Aucun fichier valide dans image_files (tableau vide ou null)');
                }
            } catch (\Exception $e) {
                \Log::error('Erreur lors de la récupération des fichiers: ' . $e->getMessage());
            }
        } else {
            if (!$shouldProcessImages) {
                \Log::info('Images non traitées (type: logement_recherche)');
            } else {
                \Log::info('Aucun fichier image reçu dans image_files (hasFile et has retournent false)');
            }
        }
        
        \Log::info('Total d\'images uploadées: ' . count($uploadedImageUrls));
        
        // Traiter les images par URL - pour tous les types sauf "Je cherche un logement"
        if ($shouldProcessImages) {
            $urlImages = [];
            if ($request->has('images') && is_array($request->images) && !empty($request->images)) {
                \Log::info('Traitement des URLs d\'images pour l\'annonce ID: ' . $annonce->id);
                
                // Filtrer seulement les URLs HTTP/HTTPS
                $urlImages = array_filter($request->images, function($img) {
                    if (empty($img) || !is_string($img)) {
                        return false;
                    }
                    return str_starts_with($img, 'http://') || str_starts_with($img, 'https://');
                });
                
                \Log::info('URLs d\'images valides: ' . count($urlImages));
            }
            
            // Combiner toutes les images (uploadées + URLs)
            $allImages = array_merge($uploadedImageUrls, array_values($urlImages));
            
            if (!empty($allImages)) {
                try {
                    $annonce->addImages($allImages);
                    \Log::info('Total d\'images ajoutées: ' . count($allImages) . ' (uploadées: ' . count($uploadedImageUrls) . ', URLs: ' . count($urlImages) . ')');
                    \Log::info('Total d\'images après ajout: ' . $annonce->images()->count());
                } catch (\Exception $e) {
                    \Log::error('Erreur lors de l\'ajout des images: ' . $e->getMessage());
                    \Log::error('Stack trace: ' . $e->getTraceAsString());
                }
            } else {
                \Log::warning('Aucune image valide à ajouter');
            }

            // Ajouter les équipements - seulement pour "J'ai trouvé un logement"
            if ($request->has('equipements') && is_array($request->equipements) && !empty($request->equipements)) {
                try {
                    $annonce->updateEquipements($request->equipements);
                } catch (\Exception $e) {
                    \Log::error('Erreur lors de l\'ajout des équipements: ' . $e->getMessage());
                }
            }
        }

        // Ajouter les règles
        if ($request->has('regles') && is_array($request->regles) && !empty($request->regles)) {
            try {
                $annonce->updateRegles($request->regles);
            } catch (\Exception $e) {
                \Log::error('Erreur lors de l\'ajout des règles: ' . $e->getMessage());
            }
        }

        $annonce->load(['user', 'images', 'equipements', 'regles']);

        // Ajouter les attributs calculés pour le frontend
        $annonce->main_image = $annonce->main_image;
        $annonce->all_images = $annonce->all_images;
        $annonce->images = $annonce->all_images; // Pour compatibilité frontend
        $annonce->equipements_list = $annonce->equipements_list;
        $annonce->regles_list = $annonce->regles_list;
        $annonce->prix_formatted = $annonce->prix_formatted;
        $annonce->nbChambres = $annonce->nb_chambres;
        $annonce->descriptionLongue = $annonce->description_longue;

        return response()->json([
            'success' => true,
            'message' => 'Annonce créée avec succès',
            'data' => $annonce
        ], 201);
    }

    /**
     * Afficher une annonce spécifique
     */
    public function show(Request $request, $id)
    {
        \Log::info('🔵 AnnonceController::show() appelé pour ID: ' . $id);
        \Log::info('🔵 URL: ' . $request->fullUrl());
        \Log::info('🔵 Method: ' . $request->method());
        \Log::info('🔵 Headers Authorization: ' . ($request->header('Authorization') ? 'présent' : 'absent'));
        try {
            // Log de la requête entrante
            \Log::info('=== Requête show() pour annonce ID: ' . $id . ' ===');
            \Log::info('URL complète: ' . $request->fullUrl());
            \Log::info('Méthode: ' . $request->method());
            \Log::info('Route: ' . $request->route()->getName() ?? 'N/A');
            
            // Vérifier que l'ID est valide
            if (!is_numeric($id)) {
                \Log::warning('ID d\'annonce invalide reçu: ' . $id . ' (type: ' . gettype($id) . ')');
                return response()->json([
                    'success' => false,
                    'message' => 'ID d\'annonce invalide',
                    'received_id' => $id,
                    'id_type' => gettype($id)
                ], 400);
            }

            // Convertir l'ID en entier pour être sûr
            $id = (int) $id;
            \Log::info('ID converti en entier: ' . $id);

            // D'abord, vérifier si l'annonce existe avec une requête simple
            $exists = Annonce::where('id', $id)->exists();
            \Log::info('Vérification existence annonce ID ' . $id . ': ' . ($exists ? 'existe' : 'n\'existe pas'));
            
            if (!$exists) {
                // Lister quelques annonces pour débogage
                $sampleAnnonces = Annonce::select('id', 'titre', 'statut')->limit(5)->get();
                \Log::info('Exemples d\'annonces dans la BD:', $sampleAnnonces->toArray());
                
                return response()->json([
                    'success' => false,
                    'message' => 'Annonce introuvable',
                    'id' => $id,
                    'exists_in_db' => false
                ], 404);
            }

            // Chercher l'annonce avec toutes les relations
            // Essayer d'abord sans relations pour voir si le problème vient des relations
            try {
                $annonce = Annonce::find($id);
                
                if (!$annonce) {
                    \Log::error('Annonce::find(' . $id . ') retourne null alors que exists() retourne true');
                    return response()->json([
                        'success' => false,
                        'message' => 'Erreur lors de la récupération de l\'annonce',
                        'id' => $id
                    ], 500);
                }
                
                \Log::info('Annonce trouvée (sans relations): ID=' . $annonce->id . ', Titre=' . $annonce->titre);
                
                // Charger les relations séparément pour éviter les erreurs silencieuses
                try {
                    $annonce->load(['user', 'images', 'equipements', 'regles']);
                    // Ne pas charger avis si le modèle n'existe pas
                    // if ($annonce->avis()->exists()) {
                    //     $annonce->load('avis.user');
                    // }
                } catch (\Exception $e) {
                    \Log::warning('Erreur lors du chargement des relations: ' . $e->getMessage());
                    // Continuer même si les relations échouent
                }
                
            } catch (\Exception $e) {
                \Log::error('Exception lors de la recherche de l\'annonce: ' . $e->getMessage());
                \Log::error('Stack trace: ' . $e->getTraceAsString());
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de la récupération de l\'annonce: ' . $e->getMessage(),
                    'id' => $id
                ], 500);
            }
            
            // Log pour débogage
            \Log::info('Requête annonce ID ' . $id . ' - Résultat: trouvée');
            \Log::info('Détails de l\'annonce trouvée:', [
                'id' => $annonce->id,
                'titre' => $annonce->titre,
                'statut' => $annonce->statut,
                'user_id' => $annonce->user_id,
                'user_exists' => $annonce->user ? 'oui' : 'non',
                'images_count' => $annonce->images ? $annonce->images->count() : 0,
            ]);

            \Log::info('Annonce trouvée: ID=' . $annonce->id . ', Titre=' . $annonce->titre . ', Statut=' . $annonce->statut);

            // Incrémenter les vues et enregistrer dans annonce_views (uniquement pour les utilisateurs non propriétaires)
            try {
                // Le middleware OptionalSanctumAuth devrait avoir authentifié l'utilisateur si un token est présent
                $token = $request->bearerToken();
                $currentUser = $request->user();
                
                // Si $request->user() retourne null mais qu'un token est présent, essayer de le récupérer manuellement
                if (!$currentUser && $token) {
                    try {
                        $accessToken = PersonalAccessToken::findToken($token);
                        if ($accessToken && $accessToken->tokenable) {
                            $currentUser = $accessToken->tokenable;
                            \Log::info('✅ User récupéré manuellement - ID: ' . $currentUser->id);
                        }
                    } catch (\Exception $e) {
                        \Log::warning('Erreur lors de la récupération manuelle: ' . $e->getMessage());
                    }
                }
                
                // Log pour déboguer
                \Log::info('=== Consultation annonce ID: ' . $annonce->id . ' ===');
                \Log::info('Token présent: ' . ($token ? 'oui' : 'non'));
                \Log::info('User authentifié: ' . ($currentUser ? '✅ oui (ID: ' . $currentUser->id . ')' : '❌ non'));
                \Log::info('Propriétaire de l\'annonce: User ID ' . $annonce->user_id);
                \Log::info('Vues actuelles dans la BD: ' . ($annonce->vues ?? 0));
                
                // Enregistrer la vue si l'utilisateur est authentifié (même s'il est propriétaire)
                if ($currentUser) {
                    // Enregistrer la vue dans annonce_views (si pas déjà enregistrée)
                    try {
                        \Log::info('Tentative d\'enregistrement - User ID: ' . $currentUser->id . ', Annonce ID: ' . $annonce->id);
                        
                        // Vérifier d'abord si l'enregistrement existe déjà
                        $existingView = AnnonceView::where('user_id', $currentUser->id)
                            ->where('annonce_id', $annonce->id)
                            ->first();
                        
                        if ($existingView) {
                            \Log::info('Vue déjà existante - ID: ' . $existingView->id);
                        } else {
                            // Créer un nouvel enregistrement
                            $view = new AnnonceView();
                            $view->user_id = $currentUser->id;
                            $view->annonce_id = $annonce->id;
                            $view->save();
                            
                            \Log::info('✅ Vue créée avec succès - ID: ' . $view->id);
                            
                            // Vérifier que l'enregistrement est bien dans la base
                            $verify = AnnonceView::find($view->id);
                            if ($verify) {
                                \Log::info('✅ Vérification OK - Enregistrement confirmé dans la base');
                            } else {
                                \Log::error('❌ ERREUR - L\'enregistrement n\'a pas été sauvegardé !');
                            }
                        }
                    } catch (\Exception $viewError) {
                        \Log::error('❌ ERREUR lors de l\'enregistrement dans annonce_views: ' . $viewError->getMessage());
                        \Log::error('Stack trace: ' . $viewError->getTraceAsString());
                        \Log::error('User ID: ' . $currentUser->id . ', Annonce ID: ' . $annonce->id);
                    }
                    
                    // Incrémenter les vues si l'utilisateur n'est PAS le propriétaire (pour éviter l'auto-inflation)
                    $vuesAvant = (int) ($annonce->vues ?? 0);
                    \Log::info('Vues avant incrémentation: ' . $vuesAvant . ' pour l\'annonce ID: ' . $annonce->id);
                    \Log::info('Comparaison: User ID ' . $currentUser->id . ' !== Annonce User ID ' . $annonce->user_id . ' = ' . ($currentUser->id !== $annonce->user_id ? 'true' : 'false'));
                    
                    if ($currentUser->id !== $annonce->user_id) {
                        // Recharger l'annonce depuis la base pour avoir la valeur la plus récente
                        $annonce->refresh();
                        $vuesAvantRefresh = (int) ($annonce->vues ?? 0);
                        \Log::info('Vues après refresh: ' . $vuesAvantRefresh);
                        
                        // Incrémenter directement dans la base de données pour être sûr
                        $updated = DB::table('annonces')
                            ->where('id', $annonce->id)
                            ->increment('vues');
                        
                        \Log::info('Résultat increment DB: ' . ($updated ? 'true' : 'false'));
                        
                        // Recharger pour avoir la nouvelle valeur
                        $annonce->refresh();
                        $vuesApres = (int) ($annonce->vues ?? 0);
                        \Log::info('✅ Vues incrémentées pour l\'annonce ID: ' . $annonce->id . ' (avant: ' . $vuesAvantRefresh . ', après: ' . $vuesApres . ')');
                        
                        // Vérifier directement dans la base
                        $vuesDirect = DB::table('annonces')->where('id', $annonce->id)->value('vues');
                        \Log::info('Vues vérifiées directement dans la BD: ' . ($vuesDirect ?? 'NULL'));
                        
                        if ($vuesApres === $vuesAvantRefresh) {
                            \Log::warning('⚠️ ATTENTION: Les vues n\'ont pas changé après l\'incrémentation !');
                        }
                    } else {
                        \Log::info('⚠️ Vues non incrémentées (utilisateur propriétaire) pour l\'annonce ID: ' . $annonce->id . ' (vues actuelles: ' . $vuesAvant . ')');
                    }
                } elseif (!$currentUser) {
                    // Même pour les utilisateurs non connectés, on peut incrémenter les vues
                    $vuesAvantNonConnecte = (int) ($annonce->vues ?? 0);
                    \Log::info('Vues avant incrémentation (non connecté): ' . $vuesAvantNonConnecte);
                    
                    // Incrémenter directement dans la base de données
                    $updated = DB::table('annonces')
                        ->where('id', $annonce->id)
                        ->increment('vues');
                    
                    \Log::info('Résultat increment DB (non connecté): ' . ($updated ? 'true' : 'false'));
                    
                    $annonce->refresh();
                    $vuesApresNonConnecte = (int) ($annonce->vues ?? 0);
                    \Log::info('Vues incrémentées (utilisateur non connecté) pour l\'annonce ID: ' . $annonce->id . ' (avant: ' . $vuesAvantNonConnecte . ', après: ' . $vuesApresNonConnecte . ')');
                }
            } catch (\Exception $e) {
                \Log::warning('Erreur lors de l\'incrémentation des vues: ' . $e->getMessage());
                \Log::warning('Stack trace: ' . $e->getTraceAsString());
            }

            // Recharger l'annonce pour avoir les valeurs les plus récentes (notamment vues) après l'incrémentation
            $annonce->refresh();
            
            // Vérifier la valeur des vues directement depuis la base de données
            $vuesFromDB = (int) DB::table('annonces')->where('id', $annonce->id)->value('vues');
            \Log::info('Vues depuis la BD directement: ' . $vuesFromDB . ' pour l\'annonce ID: ' . $annonce->id);
            \Log::info('Vues depuis le modèle: ' . ($annonce->vues ?? 0) . ' pour l\'annonce ID: ' . $annonce->id);
            
            // Calculer les attributs
            $allImages = $annonce->all_images; // Récupère les images depuis le modèle
            $equipementsList = $annonce->equipements_list;
            $reglesList = $annonce->regles_list;
            
            // S'assurer que les images sont un tableau
            if (!is_array($allImages)) {
                $allImages = [];
            }
            
            // S'assurer que les équipements sont un tableau
            if (!is_array($equipementsList)) {
                $equipementsList = [];
            }
            
            // S'assurer que les règles sont un tableau
            if (!is_array($reglesList)) {
                $reglesList = [];
            }
            
            // Ajouter les attributs calculés
            $annonce->main_image = $annonce->main_image;
            $annonce->all_images = $allImages;
            $annonce->images = $allImages; // Pour compatibilité frontend
            $annonce->equipements_list = $equipementsList;
            $annonce->regles_list = $reglesList;
            $annonce->prix_formatted = $annonce->prix_formatted;
            
            // Mapper les champs snake_case vers camelCase pour le frontend
            $annonce->nbChambres = $annonce->nb_chambres;
            $annonce->descriptionLongue = $annonce->description_longue;
            
            // S'assurer que rating est un nombre ou null
            $annonce->rating = $annonce->rating !== null && $annonce->rating !== '' ? (float) $annonce->rating : null;

            // Ajouter l'information si l'annonce est dans les favoris de l'utilisateur
            try {
                $currentUser = $request->user();
                if ($currentUser) {
                    $annonce->is_favorite = $currentUser->isFavorited($annonce);
                } else {
                    $annonce->is_favorite = false;
                }
            } catch (\Exception $e) {
                \Log::warning('Erreur lors de la vérification des favoris dans show(): ' . $e->getMessage());
                $annonce->is_favorite = false;
            }

            // Ajouter les informations du propriétaire (s'assurer que user existe)
            if ($annonce->user) {
                // Récupérer l'avatar directement depuis la BD pour plus de fiabilité
                $avatarRaw = $annonce->user->avatar ?? null;
                if (!$avatarRaw) {
                    $avatarRaw = DB::table('users')->where('id', $annonce->user->id)->value('avatar');
                }
                
                // Formater l'avatar en URL absolue si nécessaire
                $avatar = null;
                if ($avatarRaw) {
                    if (str_starts_with($avatarRaw, 'http://') || str_starts_with($avatarRaw, 'https://')) {
                        $avatar = $avatarRaw;
                    } else {
                        // Utiliser Storage::url() pour générer l'URL complète
                        $url = Storage::disk('public')->url($avatarRaw);
                        if ($url && !str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
                            $baseUrl = request()->getSchemeAndHttpHost();
                            if (!str_starts_with($url, '/storage/')) {
                                $url = sprintf('/storage/%s', ltrim($url, '/'));
                            }
                            $url = sprintf('%s%s', $baseUrl, $url);
                        }
                        $avatar = $url ?: null;
                    }
                }
                
                $annonce->proprietaire = [
                    'id' => $annonce->user->id,
                    'nom' => $annonce->user->nom ?? '',
                    'prenom' => $annonce->user->prenom ?? '',
                    'nomComplet' => trim(($annonce->user->prenom ?? '') . ' ' . ($annonce->user->nom ?? '')) ?: ($annonce->user->email ?? 'Propriétaire'),
                    'email' => $annonce->user->email ?? '',
                    'telephone' => $annonce->user->telephone ?? '',
                    'avatar' => $avatar,
                    'verifie' => $annonce->user->email_verifie ?? false,
                ];
            } else {
                \Log::warning('Annonce ID ' . $annonce->id . ' n\'a pas de propriétaire associé (user_id=' . $annonce->user_id . ')');
                $annonce->proprietaire = null;
            }

            // Log détaillé pour le débogage
            \Log::info('Données de l\'annonce à retourner:', [
                'id' => $annonce->id,
                'titre' => $annonce->titre,
                'statut' => $annonce->statut,
                'images_count' => count($allImages),
                'equipements_count' => count($equipementsList),
                'regles_count' => count($reglesList),
                'proprietaire' => $annonce->proprietaire ? 'présent' : 'absent',
            ]);

            // Construire manuellement le tableau de réponse pour garantir la structure
            $responseData = [
                'id' => $annonce->id,
                'titre' => $annonce->titre,
                'type' => $annonce->type,
                'zone' => $annonce->zone,
                'adresse' => $annonce->adresse,
                'prix' => (float) $annonce->prix,
                'surface' => $annonce->surface ? (float) $annonce->surface : null,
                'nb_chambres' => (int) $annonce->nb_chambres,
                'nbChambres' => (int) $annonce->nb_chambres,
                'description' => $annonce->description,
                'description_longue' => $annonce->description_longue ?? $annonce->description,
                'descriptionLongue' => $annonce->description_longue ?? $annonce->description,
                'meuble' => (bool) $annonce->meuble,
                'disponibilite' => $annonce->disponibilite,
                'statut' => $annonce->statut,
                'rating' => $annonce->rating ? (float) $annonce->rating : null,
                'nb_avis' => $annonce->nb_avis ?? 0,
                'vues' => $vuesFromDB, // Utiliser la valeur directement depuis la BD pour être sûr
                'is_favorite' => $annonce->is_favorite ?? false,
                'created_at' => $annonce->created_at ? $annonce->created_at->toISOString() : null,
                'updated_at' => $annonce->updated_at ? $annonce->updated_at->toISOString() : null,
                // Images
                'main_image' => $annonce->main_image,
                'all_images' => $allImages,
                'images' => $allImages,
                // Équipements et règles
                'equipements_list' => $equipementsList,
                'equipements' => $equipementsList,
                'regles_list' => $reglesList,
                'regles' => $reglesList,
                // Formatage
                'prix_formatted' => $annonce->prix_formatted,
            ];
            
            // Ajouter le propriétaire
            if ($annonce->user) {
                // Récupérer l'avatar directement depuis la BD pour plus de fiabilité
                $avatarRaw = $annonce->user->avatar ?? null;
                if (!$avatarRaw) {
                    $avatarRaw = DB::table('users')->where('id', $annonce->user->id)->value('avatar');
                }
                
                // Formater l'avatar en URL absolue si nécessaire
                $avatar = null;
                if ($avatarRaw) {
                    if (str_starts_with($avatarRaw, 'http://') || str_starts_with($avatarRaw, 'https://')) {
                        $avatar = $avatarRaw;
                    } else {
                        // Utiliser Storage::url() pour générer l'URL complète
                        $url = Storage::disk('public')->url($avatarRaw);
                        if ($url && !str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
                            $baseUrl = request()->getSchemeAndHttpHost();
                            if (!str_starts_with($url, '/storage/')) {
                                $url = sprintf('/storage/%s', ltrim($url, '/'));
                            }
                            $url = sprintf('%s%s', $baseUrl, $url);
                        }
                        $avatar = $url ?: null;
                    }
                }
                
                $responseData['proprietaire'] = [
                    'id' => $annonce->user->id,
                    'nom' => $annonce->user->nom ?? '',
                    'prenom' => $annonce->user->prenom ?? '',
                    'nomComplet' => trim(($annonce->user->prenom ?? '') . ' ' . ($annonce->user->nom ?? '')) ?: ($annonce->user->email ?? 'Propriétaire'),
                    'email' => $annonce->user->email ?? '',
                    'telephone' => $annonce->user->telephone ?? '',
                    'avatar' => $avatar,
                    'verifie' => (bool) ($annonce->user->email_verifie ?? false),
                ];
                // Ajouter aussi user pour compatibilité
                $responseData['user'] = [
                    'id' => $annonce->user->id,
                    'nom' => $annonce->user->nom ?? '',
                    'prenom' => $annonce->user->prenom ?? '',
                    'email' => $annonce->user->email ?? '',
                    'telephone' => $annonce->user->telephone ?? '',
                    'avatar' => $avatar,
                    'email_verifie' => (bool) ($annonce->user->email_verifie ?? false),
                ];
            } else {
                $responseData['proprietaire'] = null;
                $responseData['user'] = null;
            }

            \Log::info('Réponse JSON préparée avec succès pour l\'annonce ID: ' . $annonce->id);
            \Log::info('Structure de la réponse:', [
                'has_id' => isset($responseData['id']),
                'has_titre' => isset($responseData['titre']),
                'has_images' => isset($responseData['images']),
                'images_count' => count($responseData['images']),
                'has_proprietaire' => isset($responseData['proprietaire']) && $responseData['proprietaire'] !== null,
                'vues_dans_reponse' => $responseData['vues'] ?? 'non défini',
                'vues_depuis_annonce' => $annonce->vues ?? 'non défini',
            ]);

            return response()->json([
                'success' => true,
                'data' => $responseData
            ], 200, [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            \Log::error('=== EXCEPTION dans show() ===');
            \Log::error('Message: ' . $e->getMessage());
            \Log::error('Fichier: ' . $e->getFile() . ':' . $e->getLine());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            \Log::error('ID recherché: ' . ($id ?? 'N/A'));
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de l\'annonce: ' . $e->getMessage(),
                'id' => $id ?? null,
                'error_type' => get_class($e)
            ], 500);
        }
    }

    /**
     * Modifier une annonce
     */
    public function update(Request $request, $id)
    {
        $annonce = Annonce::findOrFail($id);

        // Vérifier les permissions
        if (!$annonce->canBeEditedBy($request->user())) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas l\'autorisation de modifier cette annonce'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'titre' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|in:' . implode(',', Annonce::TYPES),
            'zone' => 'sometimes|required|string|max:100',
            'adresse' => 'nullable|string|max:500',
            'prix' => 'sometimes|required|numeric|min:0',
            'surface' => 'nullable|numeric|min:0',
            'nb_chambres' => 'nullable|integer|min:1',
            'description' => 'sometimes|required|string|max:2000',
            'description_longue' => 'nullable|string|max:5000',
            'meuble' => 'boolean',
            'disponibilite' => 'nullable|string|max:50',
            'images' => 'nullable|array|max:10',
            'images.*' => 'nullable|string|max:2000', // Accepter URLs et base64 (temporairement)
            'equipements' => 'nullable|array|max:20',
            'equipements.*' => 'string|max:100',
            'regles' => 'nullable|array|max:20',
            'regles.*' => 'string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $annonce->update($request->only([
            'titre', 'type', 'zone', 'adresse', 'prix', 'surface',
            'nb_chambres', 'description', 'description_longue', 'meuble', 'disponibilite'
        ]));

        // Mettre à jour les images si fournies
        if ($request->has('images')) {
            // Supprimer les anciennes images
            $annonce->images()->delete();
            if (is_array($request->images)) {
                $annonce->addImages($request->images);
            }
        }

        // Mettre à jour les équipements si fournis
        if ($request->has('equipements')) {
            $annonce->updateEquipements($request->equipements);
        }

        // Mettre à jour les règles si fournies
        if ($request->has('regles')) {
            $annonce->updateRegles($request->regles);
        }

        $annonce->load(['user', 'images', 'equipements', 'regles']);

        return response()->json([
            'success' => true,
            'message' => 'Annonce mise à jour avec succès',
            'data' => $annonce
        ]);
    }

    /**
     * Supprimer une annonce
     */
    public function destroy(Request $request, $id)
    {
        $annonce = Annonce::findOrFail($id);

        // Vérifier les permissions
        if (!$annonce->canBeDeletedBy($request->user())) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas l\'autorisation de supprimer cette annonce'
            ], 403);
        }

        $annonce->delete();

        return response()->json([
            'success' => true,
            'message' => 'Annonce supprimée avec succès'
        ]);
    }

    /**
     * Ajouter/Retirer des favoris
     */
    public function toggleFavorite(Request $request, $id)
    {
        try {
            $annonce = Annonce::findOrFail($id);
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous devez être connecté pour ajouter aux favoris'
                ], 401);
            }

            \Log::info('Toggle favorite - User ID: ' . $user->id . ', Annonce ID: ' . $id);

            $favorited = $user->toggleFavorite($annonce);

            \Log::info('Toggle favorite - Résultat: ' . ($favorited ? 'ajouté' : 'retiré'));

            return response()->json([
                'success' => true,
                'message' => $favorited ? 'Ajouté aux favoris' : 'Retiré des favoris',
                'favorited' => $favorited
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors du toggle favorite: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la modification des favoris: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime une annonce des favoris de l'utilisateur
     */
    public function removeFavorite(Request $request, $id)
    {
        try {
            $annonce = Annonce::findOrFail($id);
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $favorite = \App\Models\UserFavorite::where('user_id', $user->id)
                ->where('annonce_id', $id)
                ->first();

            if (!$favorite) {
                return response()->json([
                    'success' => false,
                    'message' => 'Favori non trouvé'
                ], 404);
            }

            $favorite->delete();

            return response()->json([
                'success' => true,
                'message' => 'Annonce retirée de vos favoris'
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la suppression du favori: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Liste des favoris de l'utilisateur
     */
    public function favorites(Request $request)
    {
        $user = $request->user();

        $annonces = Annonce::whereHas('favoritedBy', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->approuvees()
        ->with(['user', 'images', 'equipements', 'regles'])
        ->paginate(12);

        $user = $request->user();
        $annonces->getCollection()->transform(function ($annonce) use ($user) {
            $annonce->main_image = $annonce->main_image;
            $annonce->all_images = $annonce->all_images;
            $annonce->equipements_list = $annonce->equipements_list;
            $annonce->regles_list = $annonce->regles_list;
            $annonce->prix_formatted = $annonce->prix_formatted;
            
            // Ajouter l'information si l'annonce est dans les favoris
            if ($user) {
                try {
                    $annonce->is_favorite = $user->isFavorited($annonce);
                } catch (\Exception $e) {
                    \Log::warning('Erreur lors de la vérification des favoris: ' . $e->getMessage());
                    $annonce->is_favorite = false;
                }
            } else {
                $annonce->is_favorite = false;
            }
            
            return $annonce;
        });

        return response()->json([
            'success' => true,
            'data' => $annonces
        ]);
    }
}