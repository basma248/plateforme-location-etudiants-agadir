<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use App\Models\Annonce;
use Illuminate\Support\Facades\Log;

echo "=== Diagnostic détaillé de l'annonce ===\n\n";

$annonceId = $argv[1] ?? null;

if (!$annonceId) {
    echo "Veuillez fournir un ID d'annonce. Exemple: php check-annonce-detail.php 6\n";
    exit(1);
}

echo "Recherche de l'annonce ID: " . $annonceId . "\n\n";

// Vérifier si l'annonce existe
$annonce = Annonce::with(['user', 'images', 'equipements', 'regles'])->find($annonceId);

if ($annonce) {
    echo "✓ Annonce trouvée!\n";
    echo "  - ID: " . $annonce->id . "\n";
    echo "  - Titre: " . $annonce->titre . "\n";
    echo "  - Statut: " . $annonce->statut . "\n";
    echo "  - User ID: " . $annonce->user_id . "\n";
    echo "  - Prix: " . number_format($annonce->prix, 2) . " MAD\n";
    echo "  - Zone: " . $annonce->zone . "\n";
    echo "  - Type: " . $annonce->type . "\n";
    echo "  - Meublé: " . ($annonce->meuble ? 'Oui' : 'Non') . "\n";
    echo "  - Surface: " . ($annonce->surface ?? 'N/A') . " m²\n";
    echo "  - Chambres: " . ($annonce->nb_chambres ?? 'N/A') . "\n";
    echo "\n";
    
    // Vérifier les images
    echo "Images: " . $annonce->images->count() . "\n";
    if ($annonce->images->count() > 0) {
        foreach ($annonce->images as $index => $image) {
            echo "  " . ($index + 1) . ". " . $image->image_url . "\n";
        }
    } else {
        echo "  ⚠️ Aucune image trouvée\n";
    }
    echo "\n";
    
    // Vérifier les équipements
    echo "Équipements: " . $annonce->equipements->count() . "\n";
    if ($annonce->equipements->count() > 0) {
        foreach ($annonce->equipements as $index => $equipement) {
            echo "  " . ($index + 1) . ". " . $equipement->equipement . "\n";
        }
    }
    echo "\n";
    
    // Vérifier les règles
    echo "Règles: " . $annonce->regles->count() . "\n";
    if ($annonce->regles->count() > 0) {
        foreach ($annonce->regles as $index => $regle) {
            echo "  " . ($index + 1) . ". " . $regle->regle . "\n";
        }
    }
    echo "\n";
    
    // Vérifier le propriétaire
    if ($annonce->user) {
        echo "Propriétaire:\n";
        echo "  - ID: " . $annonce->user->id . "\n";
        echo "  - Nom: " . ($annonce->user->nom ?? 'N/A') . "\n";
        echo "  - Prénom: " . ($annonce->user->prenom ?? 'N/A') . "\n";
        echo "  - Email: " . $annonce->user->email . "\n";
        echo "  - Téléphone: " . ($annonce->user->telephone ?? 'N/A') . "\n";
        echo "  - Avatar: " . ($annonce->user->avatar ?? 'N/A') . "\n";
        echo "  - Email vérifié: " . ($annonce->user->email_verifie ? 'Oui' : 'Non') . "\n";
    } else {
        echo "⚠️ Aucun propriétaire associé (user_id=" . $annonce->user_id . ")\n";
    }
    echo "\n";
    
    // Vérifier le statut
    if ($annonce->statut !== 'approuve') {
        echo "⚠️ ATTENTION: Le statut de l'annonce n'est pas 'approuve'.\n";
        echo "   Statut actuel: " . $annonce->statut . "\n";
        echo "   Pour l'approuver, exécutez:\n";
        echo "   UPDATE annonces SET statut = 'approuve' WHERE id = " . $annonce->id . ";\n";
    } else {
        echo "✓ Statut: approuvé\n";
    }
    
    // Tester l'API
    echo "\n";
    echo "Pour tester l'API, utilisez:\n";
    echo "curl http://localhost:8000/api/annonces/" . $annonceId . "\n";
    
} else {
    echo "✗ Annonce introuvable avec l'ID: " . $annonceId . "\n\n";
    
    // Vérifier si une annonce existe avec cet ID mais un autre statut
    $exists = Annonce::where('id', $annonceId)->exists();
    if ($exists) {
        echo "⚠️ Une annonce existe avec cet ID mais n'est pas accessible.\n";
        echo "   Vérifiez le statut dans la base de données.\n";
    } else {
        echo "⚠️ Aucune annonce trouvée avec cet ID dans la base de données.\n";
        echo "   Vérifiez que l'ID est correct.\n";
    }
    
    // Lister les annonces disponibles
    echo "\n";
    echo "Annonces disponibles dans la base de données:\n";
    $allAnnonces = Annonce::select('id', 'titre', 'statut')->get();
    if ($allAnnonces->count() > 0) {
        foreach ($allAnnonces as $a) {
            echo "  - ID: " . $a->id . ", Titre: " . $a->titre . ", Statut: " . $a->statut . "\n";
        }
    } else {
        echo "  Aucune annonce trouvée dans la base de données.\n";
    }
}

$kernel->terminate($request, $app);

