<?php
/**
 * Script de test pour identifier les erreurs "Array to string conversion"
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TEST ARRAY TO STRING CONVERSION ===\n\n";

// Test 1: Simuler formatAvatarUrl avec différents types
echo "1. Test formatAvatarUrl avec différents types:\n";

function safeString($value, $default = null) {
    if (is_null($value)) {
        return $default;
    }
    if (is_string($value)) {
        return trim($value) ?: $default;
    }
    if (is_array($value)) {
        return !empty($value) ? (string)reset($value) : $default;
    }
    if (is_object($value)) {
        return null;
    }
    $str = (string)$value;
    return ($str && $str !== 'Array') ? $str : $default;
}

function safeLog($message, $value = null) {
    if ($value === null) {
        echo "[LOG] $message\n";
        return;
    }
    $valueStr = is_string($value) ? $value : json_encode($value);
    echo "[LOG] $message: $valueStr\n";
}

// Test avec différents types
$tests = [
    'string' => 'avatars/test.jpg',
    'array' => ['avatars/test.jpg'],
    'null' => null,
    'empty_array' => [],
    'numeric' => 123,
];

foreach ($tests as $type => $value) {
    echo "  Test avec $type: ";
    try {
        $result = safeString($value);
        echo "OK - Résultat: " . ($result ?? 'NULL') . "\n";
    } catch (Exception $e) {
        echo "ERREUR: " . $e->getMessage() . "\n";
    }
}

// Test 2: Simuler des concaténations problématiques
echo "\n2. Test de concaténations:\n";

$testValues = [
    'string' => 'test',
    'array' => ['test'],
    'null' => null,
];

foreach ($testValues as $type => $value) {
    echo "  Test concaténation avec $type: ";
    try {
        // Simuler: 'Message: ' . $value
        if (is_string($value)) {
            $result = 'Message: ' . $value;
            echo "OK - $result\n";
        } else {
            $result = 'Message: ' . (is_string($value) ? $value : json_encode($value));
            echo "OK (sécurisé) - $result\n";
        }
    } catch (Exception $e) {
        echo "ERREUR: " . $e->getMessage() . "\n";
    } catch (TypeError $e) {
        echo "ERREUR TYPE: " . $e->getMessage() . "\n";
    }
}

// Test 3: Vérifier Storage::url()
echo "\n3. Test Storage::url():\n";
try {
    $storage = \Illuminate\Support\Facades\Storage::disk('public');
    $testPath = 'avatars/test.jpg';
    $url = $storage->url($testPath);
    echo "  Storage::url('$testPath'): " . gettype($url) . " - " . ($url ?? 'NULL') . "\n";
    
    // Test avec un tableau (ne devrait pas arriver mais testons)
    try {
        $urlArray = $storage->url(['avatars/test.jpg']);
        echo "  Storage::url(['avatars/test.jpg']): " . gettype($urlArray) . " - " . json_encode($urlArray) . "\n";
    } catch (Exception $e) {
        echo "  Storage::url() avec tableau: ERREUR (attendu) - " . $e->getMessage() . "\n";
    }
} catch (Exception $e) {
    echo "  ERREUR: " . $e->getMessage() . "\n";
}

// Test 4: Vérifier DB::table()->value()
echo "\n4. Test DB::table()->value():\n";
try {
    $user = \Illuminate\Support\Facades\DB::table('users')->where('id', 1)->value('avatar');
    echo "  Avatar de l'utilisateur ID 1: " . gettype($user) . " - " . ($user ?? 'NULL') . "\n";
    
    if (is_array($user)) {
        echo "  ⚠️ ATTENTION: L'avatar est un tableau!\n";
    }
} catch (Exception $e) {
    echo "  ERREUR: " . $e->getMessage() . "\n";
}

echo "\n=== FIN DU TEST ===\n";



