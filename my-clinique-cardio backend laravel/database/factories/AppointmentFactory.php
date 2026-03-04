<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        return [
            'patient_id' => Patient::factory(),
            'doctor_id' => Doctor::factory(),
            'appointment_date' => $this->faker->date(),
            'appointment_time' => $this->faker->time('H:i'),
            'status' => 'pending',
            'type' => 'consultation',
            'reason' => $this->faker->sentence(),
        ];
    }
}
