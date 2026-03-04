<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\DoctorResource;

class DoctorController extends Controller
{
    /**
     * Display a listing of doctors
     */
    public function index()
    {
        $doctors = Doctor::with('user')->get();
        return DoctorResource::collection($doctors);
    }

    /**
     * Create a new doctor (Admin only)
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

            // Doctor fields
            'specialite' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'numero_ordre' => 'required|integer',
        ]);

        try {
            // Use transaction to ensure both user and doctor are created together
            DB::beginTransaction();

            // Create user account for the doctor
            $user = User::create([
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'email' => $validated['email'],
                'mot_de_passe' => $validated['mot_de_passe'], // Auto-hashed by User model
                'role' => 'medecin', // Doctors have medecin role
            ]);

            // Create doctor profile
            $doctor = Doctor::create([
                'utilisateur_id' => $user->id,
                'specialite' => $validated['specialite'],
                'telephone' => $validated['telephone'],
                'numero_ordre' => $validated['numero_ordre'],
            ]);

            DB::commit();

            // Return success response with complete doctor info
            return response()->json([
                'success' => true,
                'message' => 'Doctor created successfully',
                'data' => [
                    'id' => $doctor->id,
                    'user_id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'specialite' => $doctor->specialite,
                    'telephone' => $doctor->telephone,
                    'numero_ordre' => $doctor->numero_ordre,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create doctor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a specific doctor
     */
    public function show($id)
    {
        $doctor = Doctor::with('user')->find($id);

        if (!$doctor) {
            return response()->json([
                'success' => false,
                'message' => 'Doctor not found'
            ], 404);
        }

        return new DoctorResource($doctor);
    }

    /**
     * Update a doctor
     */
    public function update(Request $request, $id)
    {
        $doctor = Doctor::with('user')->find($id);

        if (!$doctor) {
            return response()->json([
                'success' => false,
                'message' => 'Doctor not found'
            ], 404);
        }

        // Validate input
        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $doctor->user->id,
            'mot_de_passe' => 'nullable|string|min:8',
            'specialite' => 'sometimes|string|max:255',
            'telephone' => 'sometimes|string|max:20',
            'numero_ordre' => 'sometimes|integer',
        ]);

        try {
            DB::beginTransaction();

            // Update user fields if provided
            $userUpdateData = [
                'nom' => $validated['nom'] ?? $doctor->user->nom,
                'prenom' => $validated['prenom'] ?? $doctor->user->prenom,
                'email' => $validated['email'] ?? $doctor->user->email,
            ];

            // Update password if provided
            if (!empty($validated['mot_de_passe'])) {
                $userUpdateData['mot_de_passe'] = Hash::make($validated['mot_de_passe']);
            }

            if (isset($validated['nom']) || isset($validated['prenom']) || isset($validated['email']) || !empty($validated['mot_de_passe'])) {
                $doctor->user->update($userUpdateData);
            }

            // Update doctor fields if provided
            $doctor->update([
                'specialite' => $validated['specialite'] ?? $doctor->specialite,
                'telephone' => $validated['telephone'] ?? $doctor->telephone,
                'numero_ordre' => $validated['numero_ordre'] ?? $doctor->numero_ordre,
            ]);

            DB::commit();

            // Refresh to get updated data
            $doctor->refresh();
            $doctor->load('user');

            return response()->json([
                'success' => true,
                'message' => 'Doctor updated successfully',
                'data' => [
                    'id' => $doctor->id,
                    'nom' => $doctor->user->nom,
                    'prenom' => $doctor->user->prenom,
                    'email' => $doctor->user->email,
                    'specialite' => $doctor->specialite,
                    'telephone' => $doctor->telephone,
                    'numero_ordre' => $doctor->numero_ordre,
                ]
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update doctor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a doctor
     */
    public function destroy($id)
    {
        $doctor = Doctor::find($id);

        if (!$doctor) {
            return response()->json([
                'success' => false,
                'message' => 'Doctor not found'
            ], 404);
        }

        try {
            // Delete doctor (user will be cascade deleted if set up in migration)
            $doctor->delete();

            return response()->json([
                'success' => true,
                'message' => 'Doctor deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete doctor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
