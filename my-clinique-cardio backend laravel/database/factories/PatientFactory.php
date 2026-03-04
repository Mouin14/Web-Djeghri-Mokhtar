<?php

namespace Database\Factories;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PatientFactory extends Factory
{
    protected $model = Patient::class;

    public function definition(): array
    {
        return [
            'utilisateur_id' => User::factory(),
            'date_naissance' => $this->faker->date(),
            'sexe' => $this->faker->randomElement(['M', 'F']),
            'telephone' => $this->faker->phoneNumber(),
            'adresse' => $this->faker->address(),
        ];
    }
}
