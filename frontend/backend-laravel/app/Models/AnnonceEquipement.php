<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnnonceEquipement extends Model
{
    use HasFactory;

    protected $table = 'annonce_equipements';

    protected $fillable = [
        'annonce_id',
        'equipement',
    ];

    // Relations
    public function annonce(): BelongsTo
    {
        return $this->belongsTo(Annonce::class);
    }

    // Scopes
    public function scopeForAnnonce($query, $annonceId)
    {
        return $query->where('annonce_id', $annonceId);
    }

    public function scopeByEquipement($query, $equipement)
    {
        return $query->where('equipement', $equipement);
    }
}