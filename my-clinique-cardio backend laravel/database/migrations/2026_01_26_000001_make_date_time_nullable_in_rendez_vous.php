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
        // Make date_rdv and heure_rdv nullable so patients can request appointments without dates
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE rendez_vous MODIFY COLUMN date_rdv DATE NULL");
            DB::statement("ALTER TABLE rendez_vous MODIFY COLUMN heure_rdv TIME NULL");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE rendez_vous MODIFY COLUMN date_rdv DATE NOT NULL");
            DB::statement("ALTER TABLE rendez_vous MODIFY COLUMN heure_rdv TIME NOT NULL");
        }
    }
};
