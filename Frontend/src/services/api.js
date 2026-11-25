const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? '/api' : 'http://localhost:5000/api')

export const getToken = () => localStorage.getItem('patron_token')
export const saveToken = token => localStorage.setItem('patron_token', token)
export const removeToken = () => {
  localStorage.removeItem('patron_token')
  localStorage.removeItem('patron_user')
}

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('patron_user') || 'null')
  } catch {
    return null
  }
}
export const saveUser = user => localStorage.setItem('patron_user', JSON.stringify(user))

async function request(path, options = {}) {
  const token = getToken()
  const headers = { ...(options.headers || {}) }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  let data
  try {
    data = await response.json()
  } catch {
    data = {}
  }

  if (response.status === 401) {
    removeToken()
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
      window.dispatchEvent(new CustomEvent('patron:unauthorized'))
    }
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
  if (data.token) saveToken(data.token)
  if (data.user) saveUser(data.user)
  return data
}

export async function registerUser(user) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(user)
  })
  if (data.token) saveToken(data.token)
  if (data.user) saveUser(data.user)
  return data
}

export async function googleLogin(credential) {
  const data = await request('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential })
  })
  if (data.token) saveToken(data.token)
  if (data.user) saveUser(data.user)
  return data
}

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

export const getTransactions = () => request('/transactions')
export const getCustomerTransactions = id => request(`/transactions/customer/${encodeURIComponent(id)}`)

export const getScan = id => request(`/scan/${encodeURIComponent(id)}`)
