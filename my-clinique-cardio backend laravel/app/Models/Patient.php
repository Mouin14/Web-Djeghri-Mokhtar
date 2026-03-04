<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/*
|--------------------------------------------------------------------------
| Patient Model
|--------------------------------------------------------------------------
| Path: app/Models/Patient.php
*/

class Patient extends Model
{
    use HasFactory;

    protected $table = 'malades';

    protected $fillable = [
        'utilisateur_id',
        'date_naissance',
        'sexe',
        'telephone',
        'adresse',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'date_naissance' => 'date',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    public function consultations()
    {
        return $this->hasMany(Consultation::class, 'malade_id');
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class, 'malade_id');
    }

    // Accessors
    public function getAgeAttribute()
    {
        return $this->date_naissance ? $this->date_naissance->age : null;
    }

    public function getFullInfoAttribute()
    {
        return "{$this->user->full_name} - {$this->age} ans";
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->whereHas('user', function ($q) {
            $q->whereNotNull('email_verified_at');
        });
    }
}
