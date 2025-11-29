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
        // Vérifier si la table existe
        if (!Schema::hasTable('user_favorites')) {
            return;
        }

        Schema::table('user_favorites', function (Blueprint $table) {
            // Vérifier si les colonnes n'existent pas déjà
            if (!Schema::hasColumn('user_favorites', 'user_id')) {
                $table->foreignId('user_id')->constrained()->onDelete('cascade')->after('id');
            }
            if (!Schema::hasColumn('user_favorites', 'annonce_id')) {
                $table->foreignId('annonce_id')->constrained()->onDelete('cascade')->after('user_id');
            }
        });

        // Ajouter l'index unique séparément
        if (Schema::hasColumn('user_favorites', 'user_id') && Schema::hasColumn('user_favorites', 'annonce_id')) {
            Schema::table('user_favorites', function (Blueprint $table) {
                // Essayer d'ajouter l'index unique (peut échouer s'il existe déjà)
                try {
                    $table->unique(['user_id', 'annonce_id'], 'user_favorites_user_annonce_unique');
                } catch (\Exception $e) {
                    // L'index existe déjà, c'est OK
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_favorites', function (Blueprint $table) {
            // Supprimer l'index unique
            $table->dropUnique(['user_id', 'annonce_id']);
            
            // Supprimer les colonnes
            $table->dropForeign(['user_id']);
            $table->dropForeign(['annonce_id']);
            $table->dropColumn(['user_id', 'annonce_id']);
        });
    }
};
