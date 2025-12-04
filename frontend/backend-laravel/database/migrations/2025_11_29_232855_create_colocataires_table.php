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
        Schema::create('colocataires', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('titre');
            $table->text('description');
            $table->string('zone_preferee')->nullable();
            $table->decimal('budget_max', 10, 2)->nullable();
            $table->enum('type_logement', ['chambre', 'studio', 'appartement'])->nullable();
            $table->text('preferences')->nullable(); // JSON ou texte libre pour les préférences
            $table->enum('statut', ['actif', 'trouve', 'ferme'])->default('actif');
            $table->string('contact_email')->nullable();
            $table->string('contact_telephone')->nullable();
            $table->integer('vues')->default(0);
            $table->integer('contacts')->default(0);
            $table->timestamps();

            // Indexes
            $table->index('user_id');
            $table->index('statut');
            $table->index('zone_preferee');
            $table->index('type_logement');
            $table->index('created_at');
            $table->fullText(['titre', 'description', 'zone_preferee']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('colocataires');
    }
};
