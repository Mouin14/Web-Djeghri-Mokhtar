<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/*
|--------------------------------------------------------------------------
| Doctor Model
|--------------------------------------------------------------------------
| Path: app/Models/Doctor.php
*/

class Doctor extends Model
{
    use HasFactory;

    protected $table = 'medecins';

    protected $fillable = [
        'utilisateur_id',
        'specialite',
        'telephone',
        'numero_ordre',
        'created_at',
        'updated_at',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }

    public function consultations()
    {
        return $this->hasMany(Consultation::class, 'medecin_id');
    }

    // Accessors
    public function getFullNameWithSpecialityAttribute()
    {
        return "Dr. {$this->user->full_name} - {$this->specialite}";
    }

    // Scopes
    public function scopeAvailable($query, $date, $time)
    {
        return $query->whereDoesntHave('appointments', function ($q) use ($date, $time) {
            $q->where('appointment_date', $date)
              ->where('appointment_time', $time)
              ->whereIn('status', ['confirmed', 'pending']);
        });
    }
}
