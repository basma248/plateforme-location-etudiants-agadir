<?php

/**
 * Test direct de sauvegarde d'avatar dans la BD
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== TEST DIRECT DE SAUVEGARDE AVATAR ===\n\n";

// 1. Trouver un utilisateur
$user = DB::table('users')->first();
if (!$user) {
    echo "❌ Aucun utilisateur trouvé dans la BD\n";
    exit(1);
}

echo "Utilisateur trouvé: ID {$user->id}, Email: {$user->email}\n";
echo "Avatar actuel: " . ($user->avatar ?? 'NULL') . "\n\n";

// 2. Tester la sauvegarde directe
$testPath = 'avatars/test_' . time() . '.jpg';
echo "Test de sauvegarde avec le chemin: {$testPath}\n";

$updated = DB::table('users')
    ->where('id', $user->id)
    ->update([
        'avatar' => $testPath,
        'updated_at' => now()
    ]);

echo "DB::table()->update() retourné: {$updated} ligne(s) modifiée(s)\n";

// 3. Vérifier immédiatement
$avatarAfter = DB::table('users')->where('id', $user->id)->value('avatar');
echo "Avatar après update (direct): " . ($avatarAfter ?? 'NULL') . "\n";

if ($avatarAfter === $testPath) {
    echo "✅ SUCCÈS: L'avatar a été sauvegardé!\n";
} else {
    echo "❌ ÉCHEC: L'avatar n'a pas été sauvegardé!\n";
    echo "   Attendu: {$testPath}\n";
    echo "   Obtenu: " . ($avatarAfter ?? 'NULL') . "\n";
}

// 4. Tester avec Eloquent
echo "\n--- Test avec Eloquent ---\n";
$userModel = \App\Models\User::find($user->id);
$userModel->avatar = 'avatars/test_eloquent_' . time() . '.jpg';
$saved = $userModel->save();
echo "Eloquent save() retourné: " . ($saved ? 'true' : 'false') . "\n";

$avatarAfterEloquent = DB::table('users')->where('id', $user->id)->value('avatar');
echo "Avatar après Eloquent save(): " . ($avatarAfterEloquent ?? 'NULL') . "\n";

// 5. Nettoyer
echo "\n--- Nettoyage ---\n";
DB::table('users')->where('id', $user->id)->update(['avatar' => null]);
echo "Avatar réinitialisé à NULL\n";

echo "\n=== FIN DU TEST ===\n";

