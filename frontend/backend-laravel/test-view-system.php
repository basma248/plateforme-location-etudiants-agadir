<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\AnnonceView;
use App\Models\User;
use App\Models\Annonce;

echo "=== Test du système de vues ===\n\n";

// 1. Vérifier la table
echo "1. Vérification de la table annonce_views:\n";
$count = AnnonceView::count();
echo "   Total d'enregistrements: {$count}\n\n";

// 2. Récupérer un utilisateur et une annonce pour tester
$user = User::first();
$annonce = Annonce::where('statut', 'approuve')->first();

if (!$user) {
    echo "❌ Aucun utilisateur trouvé dans la base\n";
    exit(1);
}

if (!$annonce) {
    echo "❌ Aucune annonce approuvée trouvée dans la base\n";
    exit(1);
}

echo "2. Utilisateur de test: ID {$user->id} - {$user->email}\n";
echo "3. Annonce de test: ID {$annonce->id} - {$annonce->titre}\n\n";

// 3. Tester l'enregistrement
echo "4. Test d'enregistrement d'une vue:\n";
try {
    // Vérifier si existe déjà
    $existing = AnnonceView::where('user_id', $user->id)
        ->where('annonce_id', $annonce->id)
        ->first();
    
    if ($existing) {
        echo "   ⚠️ Vue déjà existante (ID: {$existing->id})\n";
        echo "   Suppression de l'ancienne vue pour retester...\n";
        $existing->delete();
    }
    
    // Créer une nouvelle vue
    $view = new AnnonceView();
    $view->user_id = $user->id;
    $view->annonce_id = $annonce->id;
    $view->save();
    
    echo "   ✅ Vue créée avec succès (ID: {$view->id})\n";
    
    // Vérifier
    $verify = AnnonceView::find($view->id);
    if ($verify) {
        echo "   ✅ Vérification OK - Enregistrement confirmé\n\n";
    } else {
        echo "   ❌ ERREUR - L'enregistrement n'a pas été sauvegardé !\n";
        exit(1);
    }
} catch (\Exception $e) {
    echo "   ❌ ERREUR: " . $e->getMessage() . "\n";
    echo "   Stack trace: " . $e->getTraceAsString() . "\n";
    exit(1);
}

// 4. Tester la récupération
echo "5. Test de récupération des vues pour l'utilisateur:\n";
$userViews = AnnonceView::where('user_id', $user->id)->get();
echo "   Nombre de vues: {$userViews->count()}\n";

$viewedAnnonceIds = $userViews->pluck('annonce_id')->toArray();
echo "   IDs des annonces vues: " . json_encode($viewedAnnonceIds) . "\n";

$viewedAnnonces = Annonce::whereIn('id', $viewedAnnonceIds)
    ->where('statut', 'approuve')
    ->get();

echo "   Nombre d'annonces récupérées: {$viewedAnnonces->count()}\n\n";

if ($viewedAnnonces->count() > 0) {
    echo "✅ Le système fonctionne correctement !\n";
} else {
    echo "⚠️ Les annonces ne sont pas récupérées correctement\n";
}



