import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// Response interceptor — normalise error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 422) {
      // Validation errors — let each component handle them
      return Promise.reject(error)
    }

    if (status === 404) {
      error.userMessage = 'Registro não encontrado.'
    } else if (status === 500) {
      error.userMessage = 'Erro interno no servidor. Tente novamente.'
    } else if (!error.response) {
      error.userMessage = 'Não foi possível conectar ao servidor.'
    } else {
      error.userMessage = 'Ocorreu um erro inesperado.'
    }

    return Promise.reject(error)
  }
)

export default api
