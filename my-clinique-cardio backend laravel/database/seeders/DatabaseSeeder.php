<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Consultation;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Doctor
        $doctorUser = User::updateOrCreate(
            ['email' => 'doctor@clinic.ma'],
            [
                'prenom' => 'Ahmed',
                'nom' => 'Bennani',
                'mot_de_passe' => Hash::make('password'),
            ]
        );

        $medecin = Doctor::updateOrCreate(
            ['utilisateur_id' => $doctorUser->id],
            [
                'specialite' => 'Cardiologie',
                'telephone' => '0612345678',
                'numero_ordre' => '12345',
            ]
        );

        // Patient
        $patientUser = User::updateOrCreate(
            ['email' => 'patient@clinic.ma'],
            [
                'prenom' => 'Mohammed',
                'nom' => 'Alami',
                'mot_de_passe' => Hash::make('password'),
            ]
        );

        $malade = Patient::updateOrCreate(
            ['utilisateur_id' => $patientUser->id],
            [
                'date_naissance' => '1979-03-15',
                'sexe' => 'Homme',
                'telephone' => '0698765432',
                'adresse' => 'Casablanca',
            ]
        );

        // Appointment
        $appointment = Appointment::updateOrCreate(
            [
                'doctor_id' => $medecin->id,
                'patient_id' => $malade->id,
                'appointment_date' => now()->addDays(1)->toDateString(),
                'appointment_time' => '10:00:00',
            ],
            [
                'status' => 'confirmé',
                'type' => 'consultation',
                'reason' => 'Consultation de routine',
            ]
        );
        
        // Past Consultation
        Consultation::updateOrCreate(
            [
                'rendez_vous_id' => $appointment->id,
                'medecin_id' => $medecin->id,
                'malade_id' => $malade->id,
            ],
            [
                'date_consult' => now()->subDays(2),
                'motif' => 'Douleurs thoraciques',
                'diagnostic' => 'Angine de poitrine stable',
                'prescription' => 'Repos et médicaments prescrits',
            ]
        );
    }
}
