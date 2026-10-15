<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

class PatientFactory extends Factory
{
    protected $model = Patient::class;

    public function definition(): array
    {
        // Generate a fake but structurally valid CPF (not mathematically valid)
        $cpf = sprintf(
            '%03d.%03d.%03d-%02d',
            $this->faker->numberBetween(100, 999),
            $this->faker->numberBetween(100, 999),
            $this->faker->numberBetween(100, 999),
            $this->faker->numberBetween(10, 99)
        );

        // Generate a fake RG
        $rg = sprintf(
            '%02d.%03d.%03d-%01s',
            $this->faker->numberBetween(10, 99),
            $this->faker->numberBetween(100, 999),
            $this->faker->numberBetween(100, 999),
            $this->faker->randomElement(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X'])
        );

        // Brazilian mobile phone format
        $ddd = $this->faker->randomElement(['11', '21', '31', '41', '51', '61', '71', '81', '85', '92']);
        $phone = sprintf('(%s) 9%04d-%04d', $ddd,
            $this->faker->numberBetween(1000, 9999),
            $this->faker->numberBetween(1000, 9999)
        );

        $firstName = $this->faker->firstName();
        $lastName  = $this->faker->lastName();

        return [
            'name'           => "{$firstName} {$lastName}",
            'cpf'            => $cpf,
            'rg'             => $rg,
            'birth_date'     => $this->faker->dateTimeBetween('-80 years', '-18 years')->format('Y-m-d'),
            'biological_sex' => $this->faker->randomElement(['Masculino', 'Feminino']),
            'phone'          => $phone,
            'email'          => $this->faker->optional(0.7)->safeEmail(),
            'description'    => $this->faker->optional(0.5)->paragraph(),
        ];
    }
}
