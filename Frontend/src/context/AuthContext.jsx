import { createContext, useContext, useMemo, useState } from 'react'
import { loginUser, removeToken, getToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider ({ children }) {
  const [token, setToken] = useState(getToken())
  const [demoMode, setDemoMode] = useState(localStorage.getItem('patron_demo') === 'true')

  const login = async (email, password) => {
    const data = await loginUser(email, password)
    setToken(data.token)
    setDemoMode(false)
    localStorage.removeItem('patron_demo')
    return data
  }

  const enterDemo = () => {
    removeToken()
    setToken(null)
    localStorage.setItem('patron_demo', 'true')
    setDemoMode(true)
  }

  const logout = () => {
    removeToken()
    localStorage.removeItem('patron_demo')
    setToken(null)
    setDemoMode(false)
  }

  const value = useMemo(() => ({ token, demoMode, isAuthenticated: Boolean(token || demoMode), login, logout, enterDemo }), [token, demoMode])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
