<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Annonce extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'titre',
        'type',
        'colocation_type',
        'nb_colocataires_recherches',
        'nb_colocataires_trouves',
        'conditions_colocation',
        'genre_recherche',
        'type_chambre_recherchee',
        'nb_personnes_souhaitees',
        'cherche_seul',
        'zone',
        'adresse',
        'prix',
        'surface',
        'nb_chambres',
        'description',
        'description_longue',
        'meuble',
        'disponibilite',
        'statut',
        'rating',
        'nb_avis',
        'vues',
        'contacts',
    ];

    protected $casts = [
        'prix' => 'decimal:2',
        'surface' => 'decimal:2',
        'meuble' => 'boolean',
        'rating' => 'decimal:2',
        'nb_avis' => 'integer',
        'vues' => 'integer',
        'contacts' => 'integer',
        'nb_chambres' => 'integer',
        'nb_colocataires_recherches' => 'integer',
        'nb_colocataires_trouves' => 'integer',
        'nb_personnes_souhaitees' => 'integer',
        'cherche_seul' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    const TYPES = ['chambre', 'studio', 'appartement', 'colocation'];
    const STATUTS = ['en_attente', 'approuve', 'rejete', 'signale'];

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(AnnonceImage::class);
    }

    public function equipements(): HasMany
    {
        return $this->hasMany(AnnonceEquipement::class);
    }

    public function regles(): HasMany
    {
        return $this->hasMany(AnnonceRegle::class);
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(AnnonceReport::class);
    }

    // Commenté car le modèle AnnonceAvis n'existe pas encore
    // public function avis(): HasMany
    // {
    //     return $this->hasMany(AnnonceAvis::class);
    // }

    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_favorites');
    }

    // Scopes
    public function scopeApprouvees($query)
    {
        return $query->where('statut', 'approuve');
    }

    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en_attente');
    }

    public function scopeSignalees($query)
    {
        return $query->where('statut', 'signale');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByZone($query, $zone)
    {
        return $query->where('zone', $zone);
    }

    public function scopePrixEntre($query, $min, $max)
    {
        return $query->whereBetween('prix', [$min, $max]);
    }

    public function scopeMeubles($query, $meuble = true)
    {
        return $query->where('meuble', $meuble);
    }

    public function scopeWithFilters($query, array $filters)
    {
        if (isset($filters['type']) && $filters['type']) {
            $query->where('type', $filters['type']);
        }

        // Exclure un type spécifique (ex: exclure les colocations de la page logements)
        if (isset($filters['exclude_type']) && $filters['exclude_type']) {
            $query->where('type', '!=', $filters['exclude_type']);
        }

        if (isset($filters['zone']) && $filters['zone']) {
            $query->where('zone', $filters['zone']);
        }

        if (isset($filters['prix_min']) && $filters['prix_min']) {
            $query->where('prix', '>=', $filters['prix_min']);
        }

        if (isset($filters['prix_max']) && $filters['prix_max']) {
            $query->where('prix', '<=', $filters['prix_max']);
        }

        if (isset($filters['meuble']) && $filters['meuble'] !== '') {
            $query->where('meuble', (bool) $filters['meuble']);
        }

        if (isset($filters['surface_min']) && $filters['surface_min']) {
            $query->where('surface', '>=', $filters['surface_min']);
        }

        if (isset($filters['surface_max']) && $filters['surface_max']) {
            $query->where('surface', '<=', $filters['surface_max']);
        }

        if (isset($filters['nb_chambres']) && $filters['nb_chambres']) {
            $query->where('nb_chambres', '>=', $filters['nb_chambres']);
        }

        if (isset($filters['search']) && $filters['search']) {
            $query->where(function ($q) use ($filters) {
                $q->where('titre', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('zone', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (isset($filters['user_id']) && $filters['user_id']) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['colocation_type']) && $filters['colocation_type']) {
            $query->where('colocation_type', $filters['colocation_type']);
        }

        // Tri
        if (isset($filters['sort_by'])) {
            $direction = $filters['sort_direction'] ?? 'asc';
            switch ($filters['sort_by']) {
                case 'prix':
                    $query->orderBy('prix', $direction);
                    break;
                case 'date':
                    $query->orderBy('created_at', $direction);
                    break;
                case 'rating':
                    $query->orderBy('rating', $direction);
                    break;
                case 'vues':
                    $query->orderBy('vues', $direction);
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query;
    }

    // Accessors
    public function getMainImageAttribute()
    {
        $firstImage = $this->images()->orderBy('image_order')->first();
        
        if (!$firstImage || !$firstImage->image_url) {
            return 'https://via.placeholder.com/800x600?text=No+Image';
        }
        
        $url = $firstImage->image_url;
        
        // Convertir les chemins relatifs en URLs absolues
        if (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
            if (str_starts_with($url, '/storage/')) {
                return asset($url);
            } elseif (str_starts_with($url, 'storage/')) {
                return asset('/storage/' . str_replace('storage/', '', $url));
            } elseif (str_starts_with($url, '/')) {
                return asset($url);
            } else {
                return asset('/storage/' . $url);
            }
        }
        
        return $url;
    }

    public function getAllImagesAttribute()
    {
        $urls = $this->images()->orderBy('image_order')->pluck('image_url')->toArray();
        
        // Convertir les URLs relatives en URLs absolues
        $convertedUrls = array_map(function($url) {
            if (empty($url) || !is_string($url)) {
                return null;
            }
            
            // Si c'est déjà une URL absolue, la retourner telle quelle
            if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
                return $url;
            }
            
            // Si c'est un chemin relatif, le convertir en URL absolue
            if (str_starts_with($url, '/storage/')) {
                return asset($url);
            } elseif (str_starts_with($url, 'storage/')) {
                return asset('/storage/' . str_replace('storage/', '', $url));
            } elseif (str_starts_with($url, '/')) {
                return asset($url);
            } else {
                return asset('/storage/' . $url);
            }
        }, array_filter($urls, function($url) {
            return !empty($url) && is_string($url);
        }));
        
        // Filtrer les valeurs null et réindexer
        return array_values(array_filter($convertedUrls, function($url) {
            return !empty($url) && is_string($url);
        }));
    }

    public function getEquipementsListAttribute()
    {
        return $this->equipements->pluck('equipement')->toArray();
    }

    public function getReglesListAttribute()
    {
        return $this->regles->pluck('regle')->toArray();
    }

    public function getProprietaireAttribute()
    {
        return $this->user;
    }

    public function getNbImagesAttribute()
    {
        return $this->images()->count();
    }

    public function getRatingFormattedAttribute()
    {
        return number_format($this->rating, 1);
    }

    public function getPrixFormattedAttribute()
    {
        return number_format($this->prix, 0, ',', ' ') . ' MAD';
    }

    // Methods
    public function incrementViews()
    {
        $this->increment('vues');
    }

    public function incrementContacts()
    {
        $this->increment('contacts');
    }

    public function approuver()
    {
        $this->update(['statut' => 'approuve']);
    }

    public function rejeter()
    {
        $this->update(['statut' => 'rejete']);
    }

    public function signaler()
    {
        $this->update(['statut' => 'signale']);
    }

    public function mettreEnAttente()
    {
        $this->update(['statut' => 'en_attente']);
    }

    public function addImages(array $images)
    {
        if (empty($images)) {
            \Log::warning('Tentative d\'ajout d\'un tableau d\'images vide');
            return;
        }

        \Log::info('Ajout de ' . count($images) . ' images à l\'annonce ID: ' . $this->id);
        
        foreach ($images as $index => $imageUrl) {
            if (empty($imageUrl)) {
                \Log::warning('Image vide à l\'index ' . $index . ', ignorée');
                continue;
            }
            
            try {
                $this->images()->create([
                    'image_url' => $imageUrl,
                    'image_order' => $index,
                ]);
                \Log::info('Image ajoutée: ' . $imageUrl . ' (ordre: ' . $index . ')');
            } catch (\Exception $e) {
                \Log::error('Erreur lors de l\'ajout de l\'image ' . $imageUrl . ': ' . $e->getMessage());
                throw $e;
            }
        }
        
        \Log::info('Total d\'images après ajout: ' . $this->images()->count());
    }

    public function updateEquipements(array $equipements)
    {
        $this->equipements()->delete(); // Supprimer les anciens
        foreach ($equipements as $equipement) {
            $this->equipements()->create(['equipement' => $equipement]);
        }
    }

    public function updateRegles(array $regles)
    {
        $this->regles()->delete(); // Supprimer les anciennes
        foreach ($regles as $regle) {
            $this->regles()->create(['regle' => $regle]);
        }
    }

    public function updateRating()
    {
        // Commenté car le modèle AnnonceAvis n'existe pas encore
        // $averageRating = $this->avis()->avg('rating') ?? 0;
        // $nbAvis = $this->avis()->count();
        // 
        // $this->update([
        //     'rating' => round($averageRating, 2),
        //     'nb_avis' => $nbAvis,
        // ]);
    }

    public function canBeEditedBy(User $user)
    {
        return $this->user_id === $user->id || $user->isAdmin();
    }

    public function canBeDeletedBy(User $user)
    {
        return $this->user_id === $user->id || $user->isAdmin();
    }
}