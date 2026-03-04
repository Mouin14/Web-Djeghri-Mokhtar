<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AdminProfileController extends Controller
{
    /**
     * Get admin profile
     */
    public function show(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'id'        => $user->id,
                'nom'       => $user->nom,
                'prenom'    => $user->prenom,
                'email'     => $user->email,
                'telephone' => $user->telephone,
                'role'      => $user->role,
            ]
        ], 200);
    }

    /**
     * Update admin profile (nom, prenom, email, password)
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nom'              => 'sometimes|string|max:255',
            'prenom'           => 'sometimes|string|max:255',
            'email'            => 'sometimes|email|unique:users,email,' . $user->id,
            'telephone'        => 'nullable|string|max:20',
            'current_password' => 'required_with:new_password|string',
            'new_password'     => ['nullable', 'confirmed', Password::min(8)],
        ]);

        try {
            if (isset($validated['nom'])) {
                $user->nom = $validated['nom'];
            }
            if (isset($validated['prenom'])) {
                $user->prenom = $validated['prenom'];
            }
            if (isset($validated['email'])) {
                $user->email = $validated['email'];
            }
            if (array_key_exists('telephone', $validated)) {
                $user->telephone = $validated['telephone'];
            }

            if (isset($validated['new_password'])) {
                if (!Hash::check($validated['current_password'], $user->mot_de_passe)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Mot de passe actuel incorrect'
                    ], 422);
                }
                $user->mot_de_passe = Hash::make($validated['new_password']);
            }

            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Profil mis à jour avec succès',
                'data' => [
                    'id'        => $user->id,
                    'nom'       => $user->nom,
                    'prenom'    => $user->prenom,
                    'email'     => $user->email,
                    'telephone' => $user->telephone,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
