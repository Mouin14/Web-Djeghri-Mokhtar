<?php

namespace Database\Factories;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DoctorFactory extends Factory
{
    protected $model = Doctor::class;

    public function definition(): array
    {
        return [
            'utilisateur_id' => User::factory(),
            'specialite' => $this->faker->word(),
            'telephone' => $this->faker->phoneNumber(),
            'numero_ordre' => $this->faker->unique()->numerify('ORD-#####'),
        ];
    }
}
