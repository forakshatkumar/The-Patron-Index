/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { loginUser, registerUser, googleLogin, removeToken, getToken } from '../services/api'

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

  const register = async (userData) => {
    const data = await registerUser(userData)
    if (data.token) {
      setToken(data.token)
      setDemoMode(false)
      localStorage.removeItem('patron_demo')
      return data
    }
    if (userData.email && userData.password) {
      return await login(userData.email, userData.password)
    }
    return data
  }

  const loginWithGoogle = async (credential) => {
    const data = await googleLogin(credential)
    if (data.token) {
      setToken(data.token)
      setDemoMode(false)
      localStorage.removeItem('patron_demo')
    }
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(() => ({ token, demoMode, isAuthenticated: Boolean(token || demoMode), login, register, loginWithGoogle, logout, enterDemo }), [token, demoMode])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
