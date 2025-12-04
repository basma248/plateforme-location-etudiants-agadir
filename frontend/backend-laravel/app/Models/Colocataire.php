<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Colocataire extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'titre',
        'description',
        'zone_preferee',
        'budget_max',
        'type_logement',
        'genre',
        'type_recherche',
        'nb_personnes_recherche',
        'preferences',
        'statut',
        'contact_email',
        'contact_telephone',
        'vues',
        'contacts',
    ];

    protected $casts = [
        'budget_max' => 'decimal:2',
        'vues' => 'integer',
        'contacts' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    const STATUTS = ['actif', 'trouve', 'ferme'];
    const TYPES_LOGEMENT = ['chambre', 'studio', 'appartement'];

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeActifs($query)
    {
        return $query->where('statut', 'actif');
    }

    public function scopeTrouves($query)
    {
        return $query->where('statut', 'trouve');
    }

    public function scopeFermes($query)
    {
        return $query->where('statut', 'ferme');
    }

    public function scopeByZone($query, $zone)
    {
        return $query->where('zone_preferee', $zone);
    }

    public function scopeByTypeLogement($query, $type)
    {
        return $query->where('type_logement', $type);
    }

    public function scopeBudgetMax($query, $budget)
    {
        return $query->where('budget_max', '<=', $budget);
    }

    public function scopeWithFilters($query, array $filters)
    {
        if (isset($filters['zone']) && $filters['zone']) {
            $query->where('zone_preferee', 'like', '%' . $filters['zone'] . '%');
        }

        if (isset($filters['type_logement']) && $filters['type_logement']) {
            $query->where('type_logement', $filters['type_logement']);
        }

        if (isset($filters['budget_max']) && $filters['budget_max']) {
            $query->where(function($q) use ($filters) {
                $q->whereNull('budget_max')
                  ->orWhere('budget_max', '<=', $filters['budget_max']);
            });
        }

        if (isset($filters['search']) && $filters['search']) {
            $query->where(function ($q) use ($filters) {
                $q->where('titre', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('zone_preferee', 'like', '%' . $filters['search'] . '%');
            });
        }

        // Tri
        if (isset($filters['sort_by'])) {
            $direction = $filters['sort_direction'] ?? 'desc';
            switch ($filters['sort_by']) {
                case 'date':
                    $query->orderBy('created_at', $direction);
                    break;
                case 'budget':
                    $query->orderBy('budget_max', $direction);
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
    public function getBudgetFormattedAttribute()
    {
        if (!$this->budget_max) {
            return 'Non spécifié';
        }
        return number_format($this->budget_max, 0, ',', ' ') . ' MAD';
    }

    public function getContactEmailAttribute($value)
    {
        return $value ?? $this->user->email ?? null;
    }

    public function getContactTelephoneAttribute($value)
    {
        return $value ?? $this->user->telephone ?? null;
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

    public function marquerCommeTrouve()
    {
        $this->update(['statut' => 'trouve']);
    }

    public function fermer()
    {
        $this->update(['statut' => 'ferme']);
    }

    public function reactiver()
    {
        $this->update(['statut' => 'actif']);
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
