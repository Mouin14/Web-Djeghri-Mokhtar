<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Doctor;

/*
|--------------------------------------------------------------------------
| Consultation Model
|--------------------------------------------------------------------------
| Path: app/Models/Consultation.php
*/

class Consultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'rendez_vous_id',
        'malade_id',
        'medecin_id',
        'date_consult',
        'heure_consult',
        'motif',
        'diagnostic',
        'prescription',
        'notes',
        'statut',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'date_consult' => 'date',
    ];

    // Relationships
    public function rendezVous()
    {
        return $this->belongsTo(Appointment::class, 'rendez_vous_id');
    }

    public function malade()
    {
        return $this->belongsTo(Patient::class, 'malade_id');
    }

    public function medecin()
    {
        return $this->belongsTo(Doctor::class, 'medecin_id');
    }

    // Scopes
    public function scopeRecent($query)
    {
        return $query->orderBy('date_consult', 'desc')
                    ->orderBy('heure_consult', 'desc');
    }

    public function scopeByPatient($query, $patientId)
    {
        return $query->where('malade_id', $patientId);
    }

    public function scopeByDoctor($query, $doctorId)
    {
        return $query->where('medecin_id', $doctorId);
    }
}
