<?php

namespace App\Actions;

use App\Models\Patient;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PatientAction
{
    /**
     * List patients with optional search by name or CPF.
     */
    public function list(string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        return Patient::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('cpf', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate($perPage);
    }

    /**
     * Create a new patient record.
     */
    public function store(array $data): Patient
    {
        return Patient::create($data);
    }

    /**
     * Update an existing patient record.
     */
    public function update(Patient $patient, array $data): Patient
    {
        $patient->update($data);

        return $patient->fresh();
    }

    /**
     * Soft-delete a patient record.
     */
    public function destroy(Patient $patient): void
    {
        $patient->delete();
    }
}
