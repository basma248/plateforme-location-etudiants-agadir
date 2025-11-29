<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;

class Annonce extends Model
{
    protected $table = 'annonces';

    protected $fillable = [
        'user_id','titre','description','zone','type','prix','surface',
        'nb_chambres','meuble','images','disponibilite','adresse'
    ];

    protected $casts = [
        'images' => 'array',
        'meuble' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}