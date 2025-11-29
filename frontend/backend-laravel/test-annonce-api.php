<?php
/**
 * Script de test pour vérifier l'API des annonces
 * Usage: php test-annonce-api.php [id]
 */

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

use App\Models\Annonce;

$id = $argv[1] ?? 1;

echo "=== Test de l'API Annonce ID: $id ===\n\n";

// Test 1: Vérifier que l'annonce existe
echo "1. Vérification de l'existence de l'annonce...\n";
$exists = Annonce::where('id', $id)->exists();
echo "   Existe: " . ($exists ? "OUI" : "NON") . "\n\n";

if (!$exists) {
    echo "❌ L'annonce n'existe pas dans la base de données.\n";
    echo "\nAnnonces disponibles:\n";
    $all = Annonce::select('id', 'titre', 'statut')->get();
    foreach ($all as $a) {
        echo "  - ID: {$a->id}, Titre: {$a->titre}, Statut: {$a->statut}\n";
    }
    exit(1);
}

// Test 2: Récupérer l'annonce
echo "2. Récupération de l'annonce...\n";
$annonce = Annonce::find($id);
if ($annonce) {
    echo "   ✓ Annonce trouvée\n";
    echo "   - ID: {$annonce->id}\n";
    echo "   - Titre: {$annonce->titre}\n";
    echo "   - Statut: {$annonce->statut}\n";
    echo "   - User ID: {$annonce->user_id}\n";
} else {
    echo "   ❌ Annonce non trouvée avec find()\n";
    exit(1);
}
echo "\n";

// Test 3: Vérifier les relations
echo "3. Vérification des relations...\n";
try {
    $annonce->load(['user', 'images', 'equipements', 'regles']);
    echo "   ✓ Relations chargées\n";
    echo "   - User: " . ($annonce->user ? "OUI (ID: {$annonce->user->id})" : "NON") . "\n";
    echo "   - Images: " . $annonce->images->count() . "\n";
    echo "   - Équipements: " . $annonce->equipements->count() . "\n";
    echo "   - Règles: " . $annonce->regles->count() . "\n";
} catch (\Exception $e) {
    echo "   ❌ Erreur lors du chargement des relations: " . $e->getMessage() . "\n";
}
echo "\n";

// Test 4: Simuler l'appel API
echo "4. Simulation de l'appel API...\n";
$request = Illuminate\Http\Request::create("/api/annonces/$id", 'GET');
$response = $app->handle($request);
$status = $response->getStatusCode();
$content = $response->getContent();

echo "   Statut HTTP: $status\n";
if ($status === 200) {
    $data = json_decode($content, true);
    if ($data && isset($data['success']) && $data['success']) {
        echo "   ✓ Réponse API valide\n";
        echo "   - ID: " . ($data['data']['id'] ?? 'N/A') . "\n";
        echo "   - Titre: " . ($data['data']['titre'] ?? 'N/A') . "\n";
        echo "   - Images: " . (isset($data['data']['all_images']) ? count($data['data']['all_images']) : 0) . "\n";
        echo "   - Propriétaire: " . (isset($data['data']['proprietaire']) ? "OUI" : "NON") . "\n";
    } else {
        echo "   ❌ Réponse API invalide\n";
        echo "   Contenu: " . substr($content, 0, 200) . "\n";
    }
} else {
    echo "   ❌ Erreur HTTP: $status\n";
    echo "   Contenu: " . substr($content, 0, 200) . "\n";
}

echo "\n=== Fin du test ===\n";

