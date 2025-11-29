<?php
/**
 * Script de diagnostic pour vérifier les annonces
 * Usage: php check-annonce.php [id]
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$id = $argv[1] ?? null;

echo "=== Diagnostic des annonces ===\n\n";

if ($id) {
    echo "Recherche de l'annonce ID: $id\n";
    $annonce = \App\Models\Annonce::find($id);
    
    if ($annonce) {
        echo "✓ Annonce trouvée!\n";
        echo "  - ID: {$annonce->id}\n";
        echo "  - Titre: {$annonce->titre}\n";
        echo "  - Statut: {$annonce->statut}\n";
        echo "  - User ID: {$annonce->user_id}\n";
        echo "  - Prix: {$annonce->prix}\n";
        echo "  - Zone: {$annonce->zone}\n";
        echo "  - Images: " . $annonce->images()->count() . "\n";
        echo "  - Équipements: " . $annonce->equipements()->count() . "\n";
        echo "  - Règles: " . $annonce->regles()->count() . "\n";
    } else {
        echo "✗ Annonce introuvable avec ID: $id\n";
    }
} else {
    echo "Toutes les annonces:\n";
    $annonces = \App\Models\Annonce::all();
    echo "Total: " . $annonces->count() . " annonces\n\n";
    
    foreach ($annonces as $annonce) {
        echo "ID: {$annonce->id} | Titre: {$annonce->titre} | Statut: {$annonce->statut}\n";
    }
    
    echo "\nAnnonces approuvées: " . \App\Models\Annonce::where('statut', 'approuve')->count() . "\n";
}

