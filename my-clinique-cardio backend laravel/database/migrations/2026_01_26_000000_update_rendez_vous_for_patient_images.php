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
        // Make medecin_id nullable so patients can create appointments without a doctor
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE rendez_vous MODIFY COLUMN medecin_id BIGINT UNSIGNED NULL");
            DB::statement("ALTER TABLE rendez_vous MODIFY COLUMN motif TEXT NOT NULL");
        }

        // Create table for appointment images
        Schema::create('rendez_vous_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rendez_vous_id')->constrained('rendez_vous')->cascadeOnDelete();
            $table->string('image_path');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rendez_vous_images');

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE rendez_vous MODIFY COLUMN medecin_id BIGINT UNSIGNED NOT NULL");
            DB::statement("ALTER TABLE rendez_vous MODIFY COLUMN motif TEXT NULL");
        }
    }
};
