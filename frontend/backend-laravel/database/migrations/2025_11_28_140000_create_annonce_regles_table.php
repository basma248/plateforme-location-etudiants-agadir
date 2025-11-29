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
        if (!Schema::hasTable('annonce_regles')) {
            Schema::create('annonce_regles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('annonce_id')->constrained('annonces')->onDelete('cascade');
                $table->string('regle', 100);
                $table->timestamps();

                $table->index('annonce_id');
                $table->index('regle');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('annonce_regles');
    }
};

