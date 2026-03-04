<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalRecordAttachment extends Model
{
    use HasFactory;
    
    protected $table = 'dossier_medical_attachments';

    protected $fillable = [
        'dossier_medical_id',
        'file_path',
        'file_type',
        'original_name',
    ];

    // Relationships
    public function medicalRecord()
    {
        return $this->belongsTo(MedicalRecord::class, 'dossier_medical_id');
    }
}
