<?php
/**
 * Script pour créer l'utilisateur administrateur
 * Usage: php create-admin.php
 */

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "=== Création de l'utilisateur administrateur ===\n\n";

$email = 'Basma@admin.com';
$password = '500261';

// Vérifier si l'utilisateur existe déjà
$existingUser = User::where('email', $email)->first();

if ($existingUser) {
    echo "L'utilisateur avec l'email $email existe déjà.\n";
    echo "Mise à jour du mot de passe et du rôle...\n";
    
    $existingUser->update([
        'mot_de_passe' => Hash::make($password),
        'role' => 'admin',
        'suspended' => false,
        'email_verifie' => true,
    ]);
    
    echo "✓ Utilisateur mis à jour avec succès!\n";
    echo "  - Email: $email\n";
    echo "  - Rôle: admin\n";
    echo "  - ID: {$existingUser->id}\n";
} else {
    // Créer un nouvel utilisateur admin
    $user = User::create([
        'nom' => 'Admin',
        'prenom' => 'Basma',
        'email' => $email,
        'nom_utilisateur' => 'admin_basma',
        'mot_de_passe' => Hash::make($password),
        'telephone' => null,
        'type_utilisateur' => 'loueur',
        'cin' => null,
        'cne' => null,
        'role' => 'admin',
        'suspended' => false,
        'email_verifie' => true,
    ]);
    
    echo "✓ Utilisateur administrateur créé avec succès!\n";
    echo "  - Email: $email\n";
    echo "  - Mot de passe: $password\n";
    echo "  - Rôle: admin\n";
    echo "  - ID: {$user->id}\n";
}

echo "\n=== Connexion ===\n";
echo "Vous pouvez maintenant vous connecter avec:\n";
echo "  Email: $email\n";
echo "  Mot de passe: $password\n";

