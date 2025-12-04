<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class PasswordResetToken extends Model
{
    use HasFactory;

    protected $table = 'password_reset_tokens';

    protected $fillable = [
        'user_id',
        'token',
        'expires_at',
        'used',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relation avec l'utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Vérifie si le token est valide (non utilisé et non expiré)
     */
    public function isValid(): bool
    {
        return !$this->used && $this->expires_at->isFuture();
    }

    /**
     * Marque le token comme utilisé
     */
    public function markAsUsed(): void
    {
        $this->used = true;
        $this->save();
    }

    /**
     * Scope pour récupérer uniquement les tokens valides
     */
    public function scopeValid($query)
    {
        return $query->where('used', false)
            ->where('expires_at', '>', now());
    }

    /**
     * Scope pour récupérer un token par sa valeur
     */
    public function scopeByToken($query, string $token)
    {
        return $query->where('token', $token);
    }
}


