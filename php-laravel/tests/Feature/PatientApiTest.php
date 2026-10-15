<?php

namespace Tests\Feature;

use App\Models\Patient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PatientApiTest extends TestCase
{
    use RefreshDatabase;

    // ---------------------------------------------------------------------------
    // Helper: valid patient payload
    // ---------------------------------------------------------------------------

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name'           => 'João da Silva',
            'cpf'            => '123.456.789-09',
            'rg'             => '12.345.678-9',
            'birth_date'     => '1990-05-15',
            'biological_sex' => 'Masculino',
            'phone'          => '(11) 91234-5678',
            'email'          => 'joao@example.com',
            'description'    => 'Paciente sem comorbidades.',
        ], $overrides);
    }

    // ---------------------------------------------------------------------------
    // Health check
    // ---------------------------------------------------------------------------

    public function test_health_check_returns_ok(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
                 ->assertJsonFragment(['status' => 'ok']);
    }

    // ---------------------------------------------------------------------------
    // Listing
    // ---------------------------------------------------------------------------

    public function test_index_returns_paginated_list(): void
    {
        Patient::factory()->count(15)->create();

        $response = $this->getJson('/api/patients');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [['id', 'name', 'cpf', 'birth_date', 'phone']],
                     'meta' => ['current_page', 'last_page', 'per_page', 'total'],
                 ]);
    }

    public function test_index_filters_by_name(): void
    {
        Patient::factory()->create(['name' => 'Maria Oliveira']);
        Patient::factory()->create(['name' => 'Carlos Mendes']);

        $response = $this->getJson('/api/patients?search=Maria');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonFragment(['name' => 'Maria Oliveira']);
    }

    public function test_index_filters_by_cpf(): void
    {
        Patient::factory()->create(['cpf' => '111.222.333-44']);
        Patient::factory()->create(['cpf' => '555.666.777-88']);

        $response = $this->getJson('/api/patients?search=111.222');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data');
    }

    // ---------------------------------------------------------------------------
    // Show
    // ---------------------------------------------------------------------------

    public function test_show_returns_patient_details(): void
    {
        $patient = Patient::factory()->create();

        $response = $this->getJson("/api/patients/{$patient->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $patient->id, 'name' => $patient->name]);
    }

    public function test_show_returns_404_for_nonexistent_patient(): void
    {
        $response = $this->getJson('/api/patients/9999');

        $response->assertStatus(404);
    }

    // ---------------------------------------------------------------------------
    // Store
    // ---------------------------------------------------------------------------

    public function test_store_creates_patient_with_valid_data(): void
    {
        $response = $this->postJson('/api/patients', $this->validPayload());

        $response->assertStatus(201)
                 ->assertJsonFragment(['name' => 'João da Silva', 'cpf' => '123.456.789-09']);

        $this->assertDatabaseHas('patients', ['cpf' => '123.456.789-09']);
    }

    public function test_store_returns_422_when_required_fields_are_missing(): void
    {
        $response = $this->postJson('/api/patients', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'cpf', 'rg', 'birth_date', 'biological_sex', 'phone']);
    }

    public function test_store_returns_422_when_cpf_is_duplicate(): void
    {
        Patient::factory()->create(['cpf' => '123.456.789-09']);

        $response = $this->postJson('/api/patients', $this->validPayload());

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['cpf']);
    }

    public function test_store_returns_422_for_invalid_biological_sex(): void
    {
        $response = $this->postJson('/api/patients', $this->validPayload(['biological_sex' => 'Indefinido']));

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['biological_sex']);
    }

    public function test_store_accepts_nullable_optional_fields(): void
    {
        $payload = $this->validPayload(['email' => null, 'description' => null]);

        $response = $this->postJson('/api/patients', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('patients', ['cpf' => '123.456.789-09', 'email' => null]);
    }

    // ---------------------------------------------------------------------------
    // Update
    // ---------------------------------------------------------------------------

    public function test_update_modifies_patient_data(): void
    {
        $patient = Patient::factory()->create();

        $response = $this->putJson("/api/patients/{$patient->id}", $this->validPayload([
            'cpf'  => $patient->cpf,
            'name' => 'Nome Atualizado',
        ]));

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'Nome Atualizado']);

        $this->assertDatabaseHas('patients', ['id' => $patient->id, 'name' => 'Nome Atualizado']);
    }

    public function test_update_returns_422_for_invalid_data(): void
    {
        $patient = Patient::factory()->create();

        $response = $this->putJson("/api/patients/{$patient->id}", []);

        $response->assertStatus(422);
    }

    public function test_update_allows_same_cpf_for_same_patient(): void
    {
        $patient = Patient::factory()->create(['cpf' => '999.888.777-66']);

        $response = $this->putJson("/api/patients/{$patient->id}", $this->validPayload([
            'cpf' => '999.888.777-66',
        ]));

        $response->assertStatus(200);
    }

    // ---------------------------------------------------------------------------
    // Destroy (soft delete)
    // ---------------------------------------------------------------------------

    public function test_destroy_soft_deletes_patient(): void
    {
        $patient = Patient::factory()->create();

        $response = $this->deleteJson("/api/patients/{$patient->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Patient deleted successfully.']);

        $this->assertSoftDeleted('patients', ['id' => $patient->id]);
    }

    public function test_soft_deleted_patient_does_not_appear_in_listing(): void
    {
        $patient = Patient::factory()->create();
        $patient->delete();

        $response = $this->getJson('/api/patients');

        $response->assertStatus(200);

        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertNotContains($patient->id, $ids);
    }

    public function test_destroy_returns_404_for_nonexistent_patient(): void
    {
        $response = $this->deleteJson('/api/patients/9999');

        $response->assertStatus(404);
    }
}
