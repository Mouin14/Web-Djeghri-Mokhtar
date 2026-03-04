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
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->date('date_rdv')->nullable()->after('medecin_id');
        });
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->time('heure_rdv')->nullable()->after('date_rdv');
        });

        // Update statut enum to use values with spaces (replace old values)
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE rendez_vous MODIFY COLUMN statut ENUM('en attente', 'confirmé', 'annulé', 'complété') NOT NULL DEFAULT 'en attente'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->dropColumn('date_rdv');
        });
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->dropColumn('heure_rdv');
        });

        // Revert statut enum
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE rendez_vous MODIFY COLUMN statut ENUM('en_attente', 'confirme', 'annule', 'termine') NOT NULL DEFAULT 'en_attente'");
        }
    }
};
