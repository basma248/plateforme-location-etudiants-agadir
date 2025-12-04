<?php
/**
 * Script de test direct pour l'upload d'avatar
 * Simule une requête POST avec un fichier
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TEST UPLOAD AVATAR DIRECT ===\n\n";

// Créer un fichier de test
$testFile = __DIR__ . '/storage/app/public/avatars/test_' . time() . '.jpg';
$testDir = dirname($testFile);
if (!is_dir($testDir)) {
    mkdir($testDir, 0777, true);
}
file_put_contents($testFile, 'test image content');

echo "1. Fichier de test créé: $testFile\n";

// Simuler une requête
$user = \App\Models\User::find(2);
if (!$user) {
    echo "❌ Utilisateur ID 2 non trouvé\n";
    exit(1);
}

echo "2. Utilisateur trouvé: ID {$user->id}, Email: {$user->email}\n";

// Tester formatAvatarUrl directement
$controller = new \App\Http\Controllers\UserController();

// Test avec différents types
$tests = [
    'string' => 'avatars/test.jpg',
    'array' => ['avatars/test.jpg'],
    'null' => null,
];

echo "\n3. Test formatAvatarUrl avec différents types:\n";
foreach ($tests as $type => $value) {
    echo "  Test avec $type: ";
    try {
        $reflection = new ReflectionClass($controller);
        $method = $reflection->getMethod('formatAvatarUrl');
        $method->setAccessible(true);
        $result = $method->invoke($controller, $value);
        echo "OK - Résultat: " . ($result ?? 'NULL') . "\n";
    } catch (Exception $e) {
        echo "ERREUR: " . $e->getMessage() . "\n";
        if (strpos($e->getMessage(), 'Array to string') !== false) {
            echo "    ⚠️ ERREUR 'Array to string conversion' détectée!\n";
        }
    } catch (Error $e) {
        echo "ERREUR FATALE: " . $e->getMessage() . "\n";
        if (strpos($e->getMessage(), 'Array to string') !== false) {
            echo "    ⚠️ ERREUR 'Array to string conversion' détectée!\n";
        }
    }
}

// Nettoyer
if (file_exists($testFile)) {
    unlink($testFile);
}

echo "\n=== FIN DU TEST ===\n";



