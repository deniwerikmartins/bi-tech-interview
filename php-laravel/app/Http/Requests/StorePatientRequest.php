<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:255'],
            'cpf'            => ['required', 'string', 'max:14', 'unique:patients,cpf'],
            'rg'             => ['required', 'string', 'max:12'],
            'birth_date'     => ['required', 'date', 'before:today'],
            'biological_sex' => ['required', 'in:Masculino,Feminino,Outro'],
            'phone'          => ['required', 'string', 'max:20'],
            'email'          => ['nullable', 'email', 'max:255'],
            'description'    => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'           => 'O nome completo é obrigatório.',
            'name.max'                => 'O nome pode ter no máximo 255 caracteres.',
            'cpf.required'            => 'O CPF é obrigatório.',
            'cpf.unique'              => 'Este CPF já está cadastrado.',
            'cpf.max'                 => 'CPF inválido.',
            'rg.required'             => 'O RG é obrigatório.',
            'birth_date.required'     => 'A data de nascimento é obrigatória.',
            'birth_date.date'         => 'Data de nascimento inválida.',
            'birth_date.before'       => 'A data de nascimento deve ser anterior a hoje.',
            'biological_sex.required' => 'O sexo biológico é obrigatório.',
            'biological_sex.in'       => 'Sexo biológico inválido.',
            'phone.required'          => 'O celular é obrigatório.',
            'email.email'             => 'E-mail inválido.',
        ];
    }
}
