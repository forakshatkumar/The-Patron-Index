const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const getToken = () => localStorage.getItem('patron_token')
export const saveToken = token => localStorage.setItem('patron_token', token)
export const removeToken = () => localStorage.removeItem('patron_token')

async function request(path, options = {}) {
  const token = getToken()
  const headers = { ...(options.headers || {}) }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  let data = {}
  try {
    data = await response.json()
  } catch {
    data = {}
  }

  if (!response.ok) {
    const error = new Error(data.message || `Request failed (${response.status})`)
    error.status = response.status
    throw error
  }
  return data
}

export const healthCheck = () => request('/health')

export async function loginUser(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  saveToken(data.token)
  return data
}

export const registerUser = user => request('/auth/register', {
  method: 'POST',
  body: JSON.stringify(user)
})

export const getDashboardSummary = () => request('/dashboard/summary')
export const getCustomers = () => request('/customers')
export const getCustomer = id => request(`/customers/${encodeURIComponent(id)}`)
export const createCustomer = customer => request('/customers', {
  method: 'POST',
  body: JSON.stringify(customer)
})

export function uploadScan(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request('/scan/upload', { method: 'POST', body: formData })
}

export function importCustomerCsv(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request('/customers/import', { method: 'POST', body: formData })
}

export const getScan = id => request(`/scan/${encodeURIComponent(id)}`)
