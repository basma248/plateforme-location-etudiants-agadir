<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Vérifier si la table existe avec l'ancienne structure
        if (Schema::hasTable('password_reset_tokens')) {
            // Vérifier si elle a la colonne 'email' (ancienne structure Laravel)
            if (Schema::hasColumn('password_reset_tokens', 'email')) {
                // Supprimer l'ancienne table
                Schema::dropIfExists('password_reset_tokens');
            }
        }

        // Créer la nouvelle table avec notre structure personnalisée
        if (!Schema::hasTable('password_reset_tokens')) {
            Schema::create('password_reset_tokens', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->string('token', 255)->unique();
                $table->timestamp('expires_at');
                $table->boolean('used')->default(false);
                $table->timestamps();

                // Index pour améliorer les performances
                $table->index('token');
                $table->index('user_id');
                $table->index('expires_at');
            });
        } else {
            // Si la table existe déjà avec la bonne structure, vérifier les colonnes manquantes
            if (!Schema::hasColumn('password_reset_tokens', 'user_id')) {
                Schema::table('password_reset_tokens', function (Blueprint $table) {
                    $table->foreignId('user_id')->after('id')->constrained('users')->onDelete('cascade');
                });
            }
            if (!Schema::hasColumn('password_reset_tokens', 'expires_at')) {
                Schema::table('password_reset_tokens', function (Blueprint $table) {
                    $table->timestamp('expires_at')->after('token');
                });
            }
            if (!Schema::hasColumn('password_reset_tokens', 'used')) {
                Schema::table('password_reset_tokens', function (Blueprint $table) {
                    $table->boolean('used')->default(false)->after('expires_at');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Ne pas supprimer la table, juste laisser comme ça
        // Si vous voulez vraiment revenir en arrière, vous pouvez recréer l'ancienne structure
    }
};


