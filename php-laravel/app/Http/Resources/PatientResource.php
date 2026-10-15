<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'cpf'            => $this->cpf,
            'rg'             => $this->rg,
            'birth_date'     => $this->birth_date?->format('d/m/Y'),
            'biological_sex' => $this->biological_sex,
            'phone'          => $this->phone,
            'email'          => $this->email,
            'description'    => $this->description,
            'created_at'     => $this->created_at?->format('d/m/Y H:i'),
            'updated_at'     => $this->updated_at?->format('d/m/Y H:i'),
        ];
    }
}
