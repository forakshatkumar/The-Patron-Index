// Same-origin proxy is required for reliable first-party session cookies.
const API_URL = '/api'

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

const inflight = new Map()
async function performRequest(path, options = {}) {
  const token = getToken()
  const headers = { 'X-Patron-Request': '1', ...(options.headers || {}) }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  }
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'same-origin', cache: 'no-store', signal: options.signal || AbortSignal.timeout(65000) })
  } catch (cause) {
    throw new Error(cause.name === 'TimeoutError' ? 'The server took too long to respond. Try again shortly.' : 'Unable to reach the API. Check your connection and whether the backend is running.', { cause })
  }
  let data
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (response.status === 401 && !['/auth/login','/auth/register','/auth/google','/auth/me'].includes(path)) {
    removeToken()
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
      window.dispatchEvent(new CustomEvent('patron:unauthorized'))
    }
  }

  if (!response.ok) {
    const error = new Error(data?.message || ([502, 503, 504].includes(response.status) ? 'Backend unavailable. Check the API service and try again.' : `Request failed (${response.status})`))
    error.status = response.status
    throw error
  }
  if (!data || typeof data !== 'object') throw new Error('The API returned an unexpected response. Check the API proxy configuration.')
  return data
}

function request(path, options = {}) {
  if (options.method && options.method !== 'GET') { inflight.clear(); return performRequest(path, options) }
  if (inflight.has(path)) return inflight.get(path)
  const pending = performRequest(path, options).finally(() => { if (inflight.get(path) === pending) inflight.delete(path) })
  inflight.set(path, pending)
  return pending
}

export const healthCheck = () => request('/health')

export async function loginUser(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  removeToken() // Do not store new session credentials in localStorage.
  return data
}

export async function registerUser(user) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(user)
  })
  removeToken() // Do not store new session credentials in localStorage.
  return data
}

export async function googleLogin(credential) {
  const data = await request('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential })
  })
  removeToken() // Do not store new session credentials in localStorage.
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

export const getMe = () => request('/auth/me')
export const updateMe = patch => request('/auth/me', { method: 'PUT', body: JSON.stringify(patch) })
export const signOut = all => request(all ? '/auth/logout-all' : '/auth/logout', { method: 'POST' })
