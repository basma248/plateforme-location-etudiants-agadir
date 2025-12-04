<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\UserFavorite;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'nom_utilisateur',
        'mot_de_passe',
        'type_utilisateur',
        'cin',
        'cne',
        'role',
        'avatar',
        'suspended',
        'email_verifie',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'mot_de_passe' => 'hashed',
        'suspended' => 'boolean',
        'email_verifie' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the password for the user.
     */
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    const TYPES_UTILISATEUR = ['etudiant', 'loueur'];
    const ROLES = ['user', 'admin', 'administrator'];

    // Relations
    public function annonces(): HasMany
    {
        return $this->hasMany(Annonce::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(UserFavorite::class);
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function conversationsAsLocataire(): HasMany
    {
        return $this->hasMany(Conversation::class, 'locataire_id');
    }

    public function conversationsAsProprietaire(): HasMany
    {
        return $this->hasMany(Conversation::class, 'proprietaire_id');
    }

    public function adminActions(): HasMany
    {
        return $this->hasMany(AdminAction::class, 'admin_id');
    }

    public function reportedAnnonces(): HasMany
    {
        return $this->hasMany(AnnonceReport::class, 'user_id');
    }


    public function passwordResets(): HasMany
    {
        return $this->hasMany(PasswordResetToken::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('suspended', false);
    }

    public function scopeSuspended($query)
    {
        return $query->where('suspended', true);
    }

    public function scopeAdmins($query)
    {
        return $query->whereIn('role', ['admin', 'administrator']);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type_utilisateur', $type);
    }

    public function scopeVerified($query)
    {
        return $query->where('email_verifie', true);
    }

    // Accessors
    public function getFullNameAttribute()
    {
        return $this->prenom . ' ' . $this->nom;
    }

    public function getIsAdminAttribute()
    {
        return in_array($this->role, ['admin', 'administrator']);
    }

    public function getIsSuspendedAttribute()
    {
        return $this->suspended;
    }

    public function getProfileImageAttribute()
    {
        return $this->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($this->full_name) . '&color=7F9CF5&background=EBF4FF';
    }

    // Methods
    public function hasRole($role)
    {
        return $this->role === $role;
    }

    public function isAdmin()
    {
        return $this->hasRole('admin') || $this->hasRole('administrator');
    }

    public function isSuspended()
    {
        return $this->suspended;
    }

    public function suspend()
    {
        $this->update(['suspended' => true]);
    }

    public function unsuspend()
    {
        $this->update(['suspended' => false]);
    }

    public function favoriteAnnonces()
    {
        return $this->belongsToMany(Annonce::class, 'user_favorites');
    }

    public function isFavorited(Annonce $annonce)
    {
        return UserFavorite::where('user_id', $this->id)
            ->where('annonce_id', $annonce->id)
            ->exists();
    }

    public function toggleFavorite(Annonce $annonce)
    {
        $existing = UserFavorite::where('user_id', $this->id)
            ->where('annonce_id', $annonce->id)
            ->first();
        
        if ($existing) {
            $existing->delete();
            return false; // Retiré des favoris
        } else {
            UserFavorite::create([
                'user_id' => $this->id,
                'annonce_id' => $annonce->id
            ]);
            return true; // Ajouté aux favoris
        }
    }

    public function viewedAnnonces()
    {
        return $this->belongsToMany(Annonce::class, 'annonce_views')
            ->withTimestamps()
            ->orderBy('annonce_views.created_at', 'desc');
    }

    public function colocataires(): HasMany
    {
        return $this->hasMany(Colocataire::class);
    }
}
