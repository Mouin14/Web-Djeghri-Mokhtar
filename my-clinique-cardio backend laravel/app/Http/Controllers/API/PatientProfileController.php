<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PatientProfileController extends Controller
{
    /**
     * Get patient profile
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $patient = Patient::where('utilisateur_id', $user->id)->first();

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient profile not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'telephone' => $patient->telephone ?? '',
            ]
        ], 200);
    }

    /**
     * Update patient profile (email, password, phone)
     */
    public function update(Request $request)
    {
        $user = $request->user();
        $patient = Patient::where('utilisateur_id', $user->id)->first();

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient profile not found'
            ], 404);
        }

        $validated = $request->validate([
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'telephone' => 'nullable|string|max:20',
            'current_password' => 'required_with:new_password|string',
            'new_password' => ['nullable', 'confirmed', Password::min(8)],
        ]);

        try {
            // Update email if provided
            if (isset($validated['email'])) {
                $user->email = $validated['email'];
            }

            // Update password if provided
            if (isset($validated['new_password'])) {
                // Verify current password
                if (!Hash::check($validated['current_password'], $user->mot_de_passe)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Current password is incorrect'
                    ], 422);
                }

                $user->mot_de_passe = Hash::make($validated['new_password']);
            }

            $user->save();

            // Update phone number
            if (array_key_exists('telephone', $validated)) {
                $patient->telephone = $validated['telephone'];
                $patient->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'telephone' => $patient->telephone ?? '',
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
