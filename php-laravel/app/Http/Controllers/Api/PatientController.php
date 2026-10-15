<?php

namespace App\Http\Controllers\Api;

use App\Actions\PatientAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Http\Resources\PatientResource;
use App\Models\Patient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PatientController extends Controller
{
    public function __construct(private readonly PatientAction $action) {}

    /**
     * GET /api/patients
     * Returns a paginated list of patients, searchable by name or CPF.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $patients = $this->action->list(
            search: $request->string('search')->value(),
            perPage: (int) $request->get('per_page', 10),
        );

        return PatientResource::collection($patients);
    }

    /**
     * POST /api/patients
     * Creates a new patient record.
     */
    public function store(StorePatientRequest $request): JsonResponse
    {
        $patient = $this->action->store($request->validated());

        return (new PatientResource($patient))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * GET /api/patients/{patient}
     * Returns a single patient's details.
     */
    public function show(Patient $patient): PatientResource
    {
        return new PatientResource($patient);
    }

    /**
     * PUT /api/patients/{patient}
     * Updates an existing patient record.
     */
    public function update(UpdatePatientRequest $request, Patient $patient): PatientResource
    {
        $updated = $this->action->update($patient, $request->validated());

        return new PatientResource($updated);
    }

    /**
     * DELETE /api/patients/{patient}
     * Soft-deletes a patient record.
     */
    public function destroy(Patient $patient): JsonResponse
    {
        $this->action->destroy($patient);

        return response()->json(['message' => 'Patient deleted successfully.'], 200);
    }
}
