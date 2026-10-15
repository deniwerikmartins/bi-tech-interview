import api from './api'

export interface Patient {
  id: number
  name: string
  cpf: string
  rg: string
  birth_date: string
  biological_sex: string
  phone: string
  email: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface PatientPayload {
  name: string
  cpf: string
  rg: string
  birth_date: string
  biological_sex: string
  phone: string
  email?: string | null
  description?: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

const patientService = {
  list(params: { search?: string; page?: number; per_page?: number } = {}) {
    return api.get<PaginatedResponse<Patient>>('/patients', { params })
  },

  show(id: number) {
    return api.get<{ data: Patient }>(`/patients/${id}`)
  },

  store(payload: PatientPayload) {
    return api.post<{ data: Patient }>('/patients', payload)
  },

  update(id: number, payload: PatientPayload) {
    return api.put<{ data: Patient }>(`/patients/${id}`, payload)
  },

  destroy(id: number) {
    return api.delete(`/patients/${id}`)
  }
}

export default patientService
