<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/*
|--------------------------------------------------------------------------
| User Model
|--------------------------------------------------------------------------
| Path: app/Models/User.php
*/

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'prenom',
        'nom',
        'email',
        'telephone',
        'mot_de_passe',
        'role',
        'email_verified_at',
        'remember_token',
    ];

    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'mot_de_passe' => 'hashed',
    ];

    // Password hashing is handled by the 'hashed' cast in $casts above.
    // Do NOT add a setMotDePasseAttribute mutator — it would double-hash.

    // Get the password for authentication
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    // Relationships
    public function patient()
    {
        return $this->hasOne(Patient::class, 'utilisateur_id');
    }

    public function doctor()
    {
        return $this->hasOne(Doctor::class, 'utilisateur_id');
    }

    // Helper methods
    public function isDoctor()
    {
        return $this->doctor()->exists();
    }

    public function isPatient()
    {
        return $this->patient()->exists();
    }

    public function getFullNameAttribute()
    {
        return "{$this->prenom} {$this->nom}";
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }
}
