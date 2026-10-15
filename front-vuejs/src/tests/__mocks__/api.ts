// Mock for src/services/api.ts used in Jest tests.
// Replaces the Axios instance so import.meta.env is never evaluated.
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
})

export default api
