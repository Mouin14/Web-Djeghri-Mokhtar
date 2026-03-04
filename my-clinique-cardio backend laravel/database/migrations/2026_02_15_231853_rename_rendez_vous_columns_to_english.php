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
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->renameColumn('malade_id', 'patient_id');
        });
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->renameColumn('medecin_id', 'doctor_id');
        });
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->renameColumn('date_rdv', 'appointment_date');
        });
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->renameColumn('heure_rdv', 'appointment_time');
        });
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->renameColumn('statut', 'status');
        });
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->renameColumn('motif', 'reason');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->renameColumn('patient_id', 'malade_id');
        });
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->renameColumn('doctor_id', 'medecin_id');
        });
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->renameColumn('appointment_date', 'date_rdv');
        });
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->renameColumn('appointment_time', 'heure_rdv');
        });
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->renameColumn('status', 'statut');
        });
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->renameColumn('reason', 'motif');
        });
    }
};
