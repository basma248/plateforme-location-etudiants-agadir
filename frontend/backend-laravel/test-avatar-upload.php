<?php

/**
 * Script de diagnostic pour tester l'upload d'avatar
 * Usage: php test-avatar-upload.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

echo "=== DIAGNOSTIC AVATAR UPLOAD ===\n\n";

// 1. Vérifier que la colonne avatar existe
echo "1. Vérification de la colonne avatar...\n";
if (Schema::hasColumn('users', 'avatar')) {
    echo "   ✅ La colonne avatar existe\n";
    
    // Vérifier le type de la colonne
    $columns = DB::select("SHOW COLUMNS FROM users WHERE Field = 'avatar'");
    if (!empty($columns)) {
        $column = $columns[0];
        echo "   Type: " . $column->Type . "\n";
        echo "   Null: " . $column->Null . "\n";
    }
} else {
    echo "   ❌ La colonne avatar n'existe PAS!\n";
    echo "   Création de la colonne...\n";
    Schema::table('users', function ($table) {
        $table->string('avatar', 500)->nullable()->after('role');
    });
    echo "   ✅ Colonne créée\n";
}

// 2. Vérifier le dossier storage
echo "\n2. Vérification du dossier storage...\n";
$storagePath = storage_path('app/public/avatars');
echo "   Chemin: $storagePath\n";
if (!file_exists($storagePath)) {
    echo "   ⚠️  Le dossier n'existe pas, création...\n";
    mkdir($storagePath, 0755, true);
    echo "   ✅ Dossier créé\n";
} else {
    echo "   ✅ Le dossier existe\n";
    echo "   Permissions: " . substr(sprintf('%o', fileperms($storagePath)), -4) . "\n";
    echo "   Écriture: " . (is_writable($storagePath) ? 'OUI' : 'NON') . "\n";
}

// 3. Vérifier le lien symbolique
echo "\n3. Vérification du lien symbolique...\n";
$publicPath = public_path('storage');
$targetPath = storage_path('app/public');
echo "   Lien: $publicPath -> $targetPath\n";
if (is_link($publicPath)) {
    echo "   ✅ Le lien symbolique existe\n";
    $linkTarget = readlink($publicPath);
    echo "   Cible: $linkTarget\n";
    if ($linkTarget === $targetPath) {
        echo "   ✅ Le lien pointe vers le bon dossier\n";
    } else {
        echo "   ⚠️  Le lien ne pointe pas vers le bon dossier!\n";
    }
} else {
    echo "   ❌ Le lien symbolique n'existe PAS!\n";
    echo "   Exécutez: php artisan storage:link\n";
}

// 4. Vérifier les avatars existants
echo "\n4. Vérification des avatars dans la BD...\n";
$usersWithAvatar = DB::table('users')->whereNotNull('avatar')->count();
echo "   Utilisateurs avec avatar: $usersWithAvatar\n";

if ($usersWithAvatar > 0) {
    $sampleUser = DB::table('users')->whereNotNull('avatar')->first();
    echo "   Exemple - User ID: " . $sampleUser->id . "\n";
    echo "   Avatar: " . $sampleUser->avatar . "\n";
    
    // Vérifier si le fichier existe
    $fileExists = Storage::disk('public')->exists($sampleUser->avatar);
    echo "   Fichier existe: " . ($fileExists ? 'OUI' : 'NON') . "\n";
    
    if ($fileExists) {
        $fullPath = Storage::disk('public')->path($sampleUser->avatar);
        echo "   Chemin complet: $fullPath\n";
        echo "   Taille: " . filesize($fullPath) . " bytes\n";
    }
}

// 5. Test de permissions
echo "\n5. Test d'écriture...\n";
$testFile = 'avatars/test_' . time() . '.txt';
try {
    Storage::disk('public')->put($testFile, 'test');
    echo "   ✅ Écriture réussie\n";
    Storage::disk('public')->delete($testFile);
    echo "   ✅ Suppression réussie\n";
} catch (\Exception $e) {
    echo "   ❌ Erreur d'écriture: " . $e->getMessage() . "\n";
}

echo "\n=== FIN DU DIAGNOSTIC ===\n";

