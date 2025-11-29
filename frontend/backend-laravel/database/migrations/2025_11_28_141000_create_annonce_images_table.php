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
        if (!Schema::hasTable('annonce_images')) {
            Schema::create('annonce_images', function (Blueprint $table) {
                $table->id();
                $table->foreignId('annonce_id')->constrained('annonces')->onDelete('cascade');
                $table->string('image_url', 500);
                $table->integer('image_order')->default(0);
                $table->timestamps();

                $table->index('annonce_id');
                $table->index('image_order');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('annonce_images');
    }
};

