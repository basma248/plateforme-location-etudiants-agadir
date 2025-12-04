<?php

/**
 * Script de diagnostic pour le problème d'avatar
 * Exécuter: php test-avatar-debug.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

echo "=== DIAGNOSTIC AVATAR ===\n\n";

// 1. Vérifier la structure de la table users
echo "1. Vérification de la structure de la table users:\n";
$columns = DB::select("SHOW COLUMNS FROM users LIKE 'avatar'");
if (empty($columns)) {
    echo "❌ La colonne 'avatar' n'existe pas dans la table users!\n";
    echo "   Solution: Exécuter la migration ou créer la colonne manuellement.\n\n";
} else {
    echo "✅ La colonne 'avatar' existe.\n";
    print_r($columns);
    echo "\n";
}

// 2. Vérifier les utilisateurs et leurs avatars
echo "2. Vérification des avatars dans la base de données:\n";
$users = DB::table('users')->select('id', 'email', 'avatar')->get();
foreach ($users as $user) {
    echo "User ID: {$user->id}, Email: {$user->email}\n";
    echo "  Avatar dans BD: " . ($user->avatar ?? 'NULL') . "\n";
    
    if ($user->avatar) {
        // Vérifier si le fichier existe
        $fileExists = Storage::disk('public')->exists($user->avatar);
        echo "  Fichier existe sur disque: " . ($fileExists ? 'OUI' : 'NON') . "\n";
        
        if ($fileExists) {
            $fullPath = Storage::disk('public')->path($user->avatar);
            echo "  Chemin complet: {$fullPath}\n";
            echo "  Taille: " . filesize($fullPath) . " bytes\n";
        } else {
            echo "  ⚠️ Le fichier n'existe pas sur le disque!\n";
        }
    }
    echo "\n";
}

// 3. Vérifier le dossier avatars
echo "3. Vérification du dossier storage/app/public/avatars:\n";
$avatarsPath = storage_path('app/public/avatars');
if (!is_dir($avatarsPath)) {
    echo "❌ Le dossier avatars n'existe pas!\n";
    echo "   Création du dossier...\n";
    mkdir($avatarsPath, 0755, true);
    echo "   ✅ Dossier créé.\n";
} else {
    echo "✅ Le dossier avatars existe.\n";
    echo "   Chemin: {$avatarsPath}\n";
    echo "   Permissions: " . substr(sprintf('%o', fileperms($avatarsPath)), -4) . "\n";
    
    // Lister les fichiers
    $files = Storage::disk('public')->files('avatars');
    echo "   Fichiers trouvés: " . count($files) . "\n";
    foreach ($files as $file) {
        echo "     - {$file}\n";
    }
}

// 4. Vérifier le lien symbolique
echo "\n4. Vérification du lien symbolique storage:\n";
$publicStorage = public_path('storage');
if (is_link($publicStorage)) {
    echo "✅ Le lien symbolique existe.\n";
    echo "   Pointe vers: " . readlink($publicStorage) . "\n";
} else {
    echo "❌ Le lien symbolique n'existe pas!\n";
    echo "   Solution: Exécuter 'php artisan storage:link'\n";
}

// 5. Test d'écriture
echo "\n5. Test d'écriture dans storage/app/public/avatars:\n";
$testFile = 'avatars/test_' . time() . '.txt';
try {
    Storage::disk('public')->put($testFile, 'test');
    echo "✅ Écriture réussie.\n";
    Storage::disk('public')->delete($testFile);
    echo "✅ Suppression du fichier de test réussie.\n";
} catch (\Exception $e) {
    echo "❌ Erreur d'écriture: " . $e->getMessage() . "\n";
}

echo "\n=== FIN DU DIAGNOSTIC ===\n";



