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
        Schema::table('colocataires', function (Blueprint $table) {
            $table->enum('genre', ['homme', 'femme'])->nullable()->after('type_logement');
            $table->enum('type_recherche', ['chambre_seule', 'chambre_partagee', 'studio', 'appartement'])->nullable()->after('genre');
            $table->integer('nb_personnes_recherche')->nullable()->after('type_recherche');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('colocataires', function (Blueprint $table) {
            $table->dropColumn(['genre', 'type_recherche', 'nb_personnes_recherche']);
        });
    }
};
