<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnnonceImage extends Model
{
    use HasFactory;

    protected $table = 'annonce_images';

    protected $fillable = [
        'annonce_id',
        'image_url',
        'image_order',
    ];

    protected $casts = [
        'image_order' => 'integer',
        'created_at' => 'datetime',
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

    public function scopeOrdered($query)
    {
        return $query->orderBy('image_order');
    }
}