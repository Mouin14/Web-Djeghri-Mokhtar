<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/*
|--------------------------------------------------------------------------
| Appointment Model
|--------------------------------------------------------------------------
| Path: app/Models/Appointment.php
*/

class Appointment extends Model
{
    use HasFactory;

    protected $table = 'rendez_vous';

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'appointment_date',
        'appointment_time',
        'status',
        'type',
        'reason',
        'cancellation_reason',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'appointment_date' => 'date',
    ];

    // Relationships
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    public function consultation()
    {
        return $this->hasOne(Consultation::class, 'rendez_vous_id');
    }

    public function images()
    {
        return $this->hasMany(AppointmentImage::class, 'rendez_vous_id');
    }

    // Accessors
    public function getFormattedDateAttribute()
    {
        return $this->appointment_date ? $this->appointment_date->format('d/m/Y') : null;
    }

    public function getStatusBadgeClassAttribute()
    {
        return match($this->status) {
            'confirmed' => 'bg-green-100 text-green-700',
            'pending' => 'bg-yellow-100 text-yellow-700',
            'cancelled' => 'bg-red-100 text-red-700',
            'completed' => 'bg-blue-100 text-blue-700',
            default => 'bg-gray-100 text-gray-700',
        };
    }

    // Scopes
    public function scopeUpcoming($query)
    {
        return $query->where('appointment_date', '>=', now()->toDateString())
                    ->whereIn('status', ['confirmed', 'pending'])
                    ->orderBy('appointment_date')
                    ->orderBy('appointment_time');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('appointment_date', today());
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
