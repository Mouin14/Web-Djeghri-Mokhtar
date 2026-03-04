<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Appointment;
use App\Models\Consultation;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'totalPatients' => Patient::count(),
            'totalDoctors' => Doctor::count(),
            'todayAppointments' => Appointment::whereDate('appointment_date', now())->count(),
            'weekConsultations' => Consultation::whereBetween('date_consult', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'recentAppointments' => Appointment::with(['patient.user', 'doctor.user'])
                ->orderBy('appointment_date', 'desc')
                ->orderBy('appointment_time', 'desc')
                ->take(5)
                ->get()
                ->map(function ($appointment) {
                    // Check if relationships exist to avoid errors
                    if (!$appointment->patient || !$appointment->patient->user || !$appointment->doctor || !$appointment->doctor->user) {
                        return null;
                    }

                    // Format date and time
                    $date = $appointment->appointment_date ? \Carbon\Carbon::parse($appointment->appointment_date)->format('d/m/Y') : '';
                    $time = $appointment->appointment_time ? substr($appointment->appointment_time, 0, 5) : '';
                    $dateTime = trim($date . ' ' . $time);

                    return [
                        'id' => $appointment->id,
                        'patient_name' => $appointment->patient->user->prenom . ' ' . $appointment->patient->user->nom,
                        'doctor_name' => $appointment->doctor->user->prenom . ' ' . $appointment->doctor->user->nom,
                        'date' => $dateTime,
                        'status' => $appointment->status,
                        'type' => $appointment->type,
                    ];
                })
                ->filter() // Remove null values
                ->values(), // Re-index array
        ]);
    }
}
