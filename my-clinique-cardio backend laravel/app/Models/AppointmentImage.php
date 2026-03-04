<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentImage extends Model
{
    use HasFactory;

    protected $table = 'rendez_vous_images';

    protected $fillable = [
        'rendez_vous_id',
        'image_path',
    ];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class, 'rendez_vous_id');
    }
}
