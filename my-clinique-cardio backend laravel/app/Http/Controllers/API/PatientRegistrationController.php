<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientRegistrationController extends Controller
{
    /**
     * Register a new patient (public endpoint)
     */
    public function register(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            // User fields
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'mot_de_passe' => 'required|string|min:8|confirmed',

            // Patient fields
            'date_naissance' => 'required|date',
            'sexe' => 'required|in:M,F',
            'telephone' => 'required|string|max:20',
            'adresse' => 'required|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            // Create user account for the patient
            $user = User::create([
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'email' => $validated['email'],
                'mot_de_passe' => $validated['mot_de_passe'],
                'role' => 'patient',
            ]);

            // Create patient profile
            $patient = Patient::create([
                'utilisateur_id' => $user->id,
                'date_naissance' => $validated['date_naissance'],
                'sexe' => $validated['sexe'],
                'telephone' => $validated['telephone'],
                'adresse' => $validated['adresse'],
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Patient account created successfully. You can now log in.',
                'data' => [
                    'id' => $patient->id,
                    'user_id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error creating account',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
