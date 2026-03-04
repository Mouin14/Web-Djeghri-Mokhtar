<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Login user (Session-based for all user types)
     */
    public function login(Request $request)
    {
        // Validate input
        $credentials = $request->validate([
            'email' => 'required|email',
            'mot_de_passe' => 'required',
        ]);

        // Find user by email
        $user = User::where('email', $credentials['email'])->first();

        // Check if user exists and password is correct
        if (!$user || !Hash::check($credentials['mot_de_passe'], $user->mot_de_passe)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Log the user in using session
        \Illuminate\Support\Facades\Auth::login($user);

        // Load relationships
        $user->load(['doctor', 'patient']);

        // Determine user type
        $userType = 'user';
        $profile = null;

        if ($user->role === 'admin') {
            $userType = 'admin';
        } elseif ($user->doctor) {
            $userType = 'doctor';
            $profile = [
                'id' => $user->doctor->id,
                'specialite' => $user->doctor->specialite,
                'telephone' => $user->doctor->telephone,
                'numero_ordre' => $user->doctor->numero_ordre,
            ];
        } elseif ($user->patient) {
            $userType = 'patient';
            $profile = [
                'id' => $user->patient->id,
                'date_naissance' => $user->patient->date_naissance,
                'sexe' => $user->patient->sexe,
                'telephone' => $user->patient->telephone,
                'adresse' => $user->patient->adresse,
            ];
        }

        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'role' => $user->role,
                'type' => $userType,
                'profile' => $profile,
            ],
        ], 200);
    }

    /**
     * Logout user (session-based)
     */
    public function logout(Request $request)
    {
        \Illuminate\Support\Facades\Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }

}
