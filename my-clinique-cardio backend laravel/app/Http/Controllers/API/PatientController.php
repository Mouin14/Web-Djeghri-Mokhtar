<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\PatientResource;

class PatientController extends Controller
{
    /**
     * Display a listing of patients
     */
    public function index()
    {
        $patients = Patient::with('user')->get();
        return PatientResource::collection($patients);
    }

    /**
     * Create a new patient (Admin only)
     */
    public function store(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            // User fields
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'mot_de_passe' => 'required|string|min:8',

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
                'message' => 'Patient created successfully',
                'data' => [
                    'id' => $patient->id,
                    'user_id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'date_naissance' => $patient->date_naissance,
                    'sexe' => $patient->sexe,
                    'telephone' => $patient->telephone,
                    'adresse' => $patient->adresse,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create patient',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a specific patient
     */
    public function show($id)
    {
        $patient = Patient::with('user')->find($id);

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        return new PatientResource($patient);
    }

    /**
     * Update a patient
     */
    public function update(Request $request, $id)
    {
        $patient = Patient::with('user')->find($id);

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        // Validate input
        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $patient->user->id,
            'mot_de_passe' => 'nullable|string|min:8',
            'date_naissance' => 'sometimes|date',
            'sexe' => 'sometimes|in:M,F',
            'telephone' => 'sometimes|string|max:20',
            'adresse' => 'sometimes|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            // Update user fields if provided
            $userUpdateData = [
                'nom' => $validated['nom'] ?? $patient->user->nom,
                'prenom' => $validated['prenom'] ?? $patient->user->prenom,
                'email' => $validated['email'] ?? $patient->user->email,
            ];

            // Update password if provided
            if (!empty($validated['mot_de_passe'])) {
                $userUpdateData['mot_de_passe'] = Hash::make($validated['mot_de_passe']);
            }

            if (isset($validated['nom']) || isset($validated['prenom']) || isset($validated['email']) || !empty($validated['mot_de_passe'])) {
                $patient->user->update($userUpdateData);
            }

            // Update patient fields if provided
            $patient->update([
                'date_naissance' => $validated['date_naissance'] ?? $patient->date_naissance,
                'sexe' => $validated['sexe'] ?? $patient->sexe,
                'telephone' => $validated['telephone'] ?? $patient->telephone,
                'adresse' => $validated['adresse'] ?? $patient->adresse,
            ]);

            DB::commit();

            $patient->refresh();
            $patient->load('user');

            return response()->json([
                'success' => true,
                'message' => 'Patient updated successfully',
                'data' => [
                    'id' => $patient->id,
                    'nom' => $patient->user->nom,
                    'prenom' => $patient->user->prenom,
                    'email' => $patient->user->email,
                    'date_naissance' => $patient->date_naissance,
                    'sexe' => $patient->sexe,
                    'telephone' => $patient->telephone,
                    'adresse' => $patient->adresse,
                ]
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update patient',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a patient
     */
    public function destroy($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        try {
            $patient->delete();

            return response()->json([
                'success' => true,
                'message' => 'Patient deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete patient',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
