<?php

namespace Database\Seeders;

use App\Models\Patient;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        // Avoid re-seeding if data already exists
        if (Patient::count() > 0) {
            $this->command->info('Patients table already seeded. Skipping.');
            return;
        }

        $this->command->info('Seeding 25 patients with realistic Brazilian data...');

        Patient::factory()
            ->count(25)
            ->create();

        $this->command->info('Done.');
    }
}
