<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Http\Resources\AppointmentResource;
use Illuminate\Http\Request;

class PatientSearchController extends Controller
{
    /**
     * Search patients by name (first or last).
     */
    public function search(Request $request)
    {
        $q = trim($request->query('q', ''));

        if (strlen($q) < 1) {
            return response()->json(['success' => true, 'data' => []]);
        }

        $patients = Patient::with('user')
            ->whereHas('user', function ($query) use ($q) {
                $query->where('nom', 'like', "%{$q}%")
                      ->orWhere('prenom', 'like', "%{$q}%");
            })
            ->limit(8)
            ->get()
            ->map(fn($p) => [
                'id'        => $p->id,
                'nom'       => $p->user->nom ?? '',
                'prenom'    => $p->user->prenom ?? '',
                'email'     => $p->user->email ?? '',
                'telephone' => $p->telephone ?? '',
            ]);

        return response()->json(['success' => true, 'data' => $patients]);
    }

    /**
     * Get full patient info + all their appointments.
     */
    public function overview($id)
    {
        $patient = Patient::with([
            'user',
            'appointments.doctor.user',
            'appointments.images',
        ])->find($id);

        if (!$patient) {
            return response()->json(['success' => false, 'message' => 'Patient not found'], 404);
        }

        $appointments = $patient->appointments
            ->sortByDesc('appointment_date')
            ->values();

        return response()->json([
            'success' => true,
            'data' => [
                'id'             => $patient->id,
                'nom'            => $patient->user->nom ?? '',
                'prenom'         => $patient->user->prenom ?? '',
                'email'          => $patient->user->email ?? '',
                'telephone'      => $patient->telephone ?? '',
                'date_naissance' => $patient->date_naissance?->format('d/m/Y'),
                'sexe'           => $patient->sexe,
                'adresse'        => $patient->adresse ?? '',
                'appointments'   => AppointmentResource::collection($appointments),
            ],
        ]);
    }
}
