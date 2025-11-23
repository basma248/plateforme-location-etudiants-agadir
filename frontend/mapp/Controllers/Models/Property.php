<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'address',
        'city',
        'country',
        'type',
        'price_per_night',
        'price_per_week',
        'monthly_price',
        'bedrooms',
        'bathrooms',
        'guests',
        'total_rooms',
        'occupied_rooms',
        'images',
        'user_id',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'price_per_night' => 'decimal:2',
        'price_per_week' => 'decimal:2',
        'monthly_price' => 'decimal:2',
        'occupied_rooms' => 'integer',
        'total_rooms' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function isAvailable($checkIn, $checkOut)
    {
        return !$this->bookings()
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->whereBetween('check_in', [$checkIn, $checkOut])
                    ->orWhereBetween('check_out', [$checkIn, $checkOut])
                    ->orWhere(function ($q) use ($checkIn, $checkOut) {
                        $q->where('check_in', '<=', $checkIn)
                          ->where('check_out', '>=', $checkOut);
                    });
            })
            ->exists();
    }

    // Accessor pour convertir les URLs relatives en URLs absolues
    public function getImagesAttribute($value)
    {
        if (!$value) {
            return [];
        }

        $images = is_string($value) ? json_decode($value, true) : $value;
        
        if (!is_array($images)) {
            return [];
        }

        // Convertir les chemins relatifs en URLs complètes
        return array_map(function ($image) {
            if (filter_var($image, FILTER_VALIDATE_URL)) {
                // C'est déjà une URL complète
                return $image;
            }
            // C'est un chemin relatif, le convertir en URL
            return url('storage/' . ltrim($image, '/'));
        }, $images);
    }

    // Mutator pour s'assurer que les images sont stockées en JSON
    public function setImagesAttribute($value)
    {
        if (is_array($value)) {
            $this->attributes['images'] = json_encode($value);
        } else {
            $this->attributes['images'] = $value;
        }
    }
}

