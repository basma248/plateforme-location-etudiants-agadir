<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Ajouter les colonnes personnalisées seulement si elles n'existent pas
            if (!Schema::hasColumn('users', 'nom')) {
                $table->string('nom', 100)->nullable()->after('id');
            }
            if (!Schema::hasColumn('users', 'prenom')) {
                $table->string('prenom', 100)->nullable()->after('nom');
            }
            if (!Schema::hasColumn('users', 'nom_utilisateur')) {
                $table->string('nom_utilisateur', 100)->unique()->nullable()->after('prenom');
            }
            if (!Schema::hasColumn('users', 'telephone')) {
                $table->string('telephone', 20)->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'mot_de_passe')) {
                // Si password existe, on le garde temporairement
                $table->string('mot_de_passe')->nullable()->after('telephone');
            }
            if (!Schema::hasColumn('users', 'type_utilisateur')) {
                $table->enum('type_utilisateur', ['etudiant', 'loueur'])->nullable()->after('mot_de_passe');
            }
            if (!Schema::hasColumn('users', 'cin')) {
                $table->string('cin', 20)->nullable()->after('type_utilisateur');
            }
            if (!Schema::hasColumn('users', 'cne')) {
                $table->string('cne', 20)->nullable()->after('cin');
            }
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['user', 'admin', 'administrator'])->default('user')->after('cne');
            }
            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable()->after('role');
            }
            if (!Schema::hasColumn('users', 'suspended')) {
                $table->boolean('suspended')->default(false)->after('avatar');
            }
            if (!Schema::hasColumn('users', 'email_verifie')) {
                $table->boolean('email_verifie')->default(false)->after('suspended');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Supprimer les colonnes personnalisées
            $table->dropColumn([
                'nom',
                'prenom',
                'nom_utilisateur',
                'telephone',
                'mot_de_passe',
                'type_utilisateur',
                'cin',
                'cne',
                'role',
                'avatar',
                'suspended',
                'email_verifie'
            ]);

            // Restaurer les colonnes par défaut
            $table->string('name')->after('id');
            $table->string('password')->after('email');
        });
    }
};
