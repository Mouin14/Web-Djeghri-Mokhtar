<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/*
|--------------------------------------------------------------------------
| Medical Record Model
|--------------------------------------------------------------------------
| Path: app/Models/MedicalRecord.php
*/

class MedicalRecord extends Model
{
    use HasFactory;

    protected $table = 'dossier_medicals'; // Fixed table name from previous incorrect assumption if any

    protected $fillable = [
        'malade_id',
        'medecin_id',
        'notes',
        'created_at',
        'updated_at',
    ];

    // Relationships
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'malade_id');
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'medecin_id');
    }

    public function attachments()
    {
        return $this->hasMany(MedicalRecordAttachment::class, 'dossier_medical_id');
    }
}
